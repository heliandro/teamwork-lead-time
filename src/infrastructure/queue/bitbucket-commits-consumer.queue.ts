import { RabbitSubscribe, Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable } from "@nestjs/common";
import { ConsumeMessage } from 'amqplib';
import { BitbucketGateway } from "src/application/gateways/bitbucket.gateway";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { CommitRepository } from "../repositories/commit.repository";
import { BitbucketCommitsMapper } from "src/application/mappers/bitbucket-commits.mapper";

@Injectable()
export class CommitConsumerQueue {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('BitbucketGateway') private readonly bitbucketGateway: BitbucketGateway,
        @Inject('CommitRepository') private readonly commitRepository: CommitRepository,
    ) {
        this.logger.setContext(CommitConsumerQueue.name);
    }

    @RabbitSubscribe({
        exchange: 'bitbucket_commits_exchange',
        routingKey: 'project.*.commits',
        queue: 'dataloader_bitbucket_commits_queue',
        queueOptions: {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'dead_letter_bitbucket_commits_exchange',
                'x-dead-letter-routing-key': 'project.*.commits',
            },
        }
    })
    public async commitsSubscribeHandler(message: any, amqpMessage: ConsumeMessage) {
        this.logger.log(`rabbitmq::processando mensagem: ${JSON.stringify(message)}`);
        
        try {
            const result: any = await this.bitbucketGateway.fetchCommits(message.projectId);

            if (result.size === 0) {
                return new Nack(false); // rejeita a mensagem
            }

            const commits = BitbucketCommitsMapper.toEntities(result.values, message.projectId, 'Em Processamento');
            await this.commitRepository.saveAll(commits);
        } catch (error) {
            this.logger.error(`error:: ${error}`);
            return new Nack(false); // rejeita a mensagem
        }
    }

    @RabbitSubscribe({
        exchange: 'dead_letter_bitbucket_commits_exchange',
        routingKey: 'project.*.commits',
        queue: 'dead_letter_dataloader_bitbucket_commits_queue',
    })
    public async handleDeadLetterMessages(message: any, amqpMessage: ConsumeMessage) {
        this.logger.error(`rabbitmq::dead-letter::received message: ${JSON.stringify(message)}`);
        // console.log(`Received message: ${JSON.stringify(amqpMessage)}`);
    }

    @RabbitSubscribe({
        exchange: 'bitbucket_commit_extrainfo_exchange',
        routingKey: 'commit.*.extrainfo',
        queue: 'dataloader_bitbucket_commits_extrainfo_queue',
        queueOptions: {
            durable: true
        }
    })
    public async commitExtraInfoSubscribeHandler(message: any, amqpMessage: ConsumeMessage) {
        this.logger.log(`rabbitmq::commit-extrainfo::processando mensagem: ${JSON.stringify(message)}`);
        try {
            /* 
            * 5. Recuperar as informacoes do commit do mongodb
            * 6. Buscar no bitbucket as informações da branch associada ao commit
            * 7. Buscar no jira as informações do jiraKey do tipo historia associado ao commit
            * 8. Associar as informações da branch com o commit + statusQue = "Finalizado"
            * 9. Atualizar a collection de commits do mongodb
            */

        } catch (error) {
            this.logger.error(`error:: ${error}`);
            return new Nack(false);
        }
    }
}