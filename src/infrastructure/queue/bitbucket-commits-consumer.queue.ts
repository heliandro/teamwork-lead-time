import { RabbitSubscribe, Nack } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable } from "@nestjs/common";
import { ConsumeMessage } from 'amqplib';
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { SquadRepository } from "../repositories/squad.repository";
import { FetchCommitExtraInfoFromBitbucketUseCase } from "src/application/usecases/interfaces/fetch-commit-extrainfo-from-bitbucket.usecase";
import { FetchCommitsFromBitbucketUseCase } from "src/application/usecases/interfaces/fetch-commits-from-bitbucket.usecase";

@Injectable()
export class CommitConsumerQueue {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('FetchCommitsFromBitbucketUseCase') private readonly fetchCommitsFromBitbucketUseCase: FetchCommitsFromBitbucketUseCase,
        @Inject('FetchCommitExtraInfoFromBitbucketUseCase') private readonly fetchCommitExtraInfoFromBitbucketUseCase: FetchCommitExtraInfoFromBitbucketUseCase,
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
        this.logger.log(`rabbitmq processando mensagem para recuperar commits do projeto ${JSON.stringify(message)}`);
        try {
            const { projectId } = message;
            const result = await this.fetchCommitsFromBitbucketUseCase.execute({ projectId });

            if (result.error) {
                return new Nack(false); // rejeita a mensagem
            }
            this.logger.log(`rabbitmq::commitsSubscribeHandler::commits recuperados com sucesso!`);
        } catch (error) {
            this.logger.error(`rabbitmq::commitsSubscribeHandler::error:: ${error?.message}`);
            return new Nack(false);
        }
    }

    @RabbitSubscribe({
        exchange: 'dead_letter_bitbucket_commits_exchange',
        routingKey: 'project.*.commits',
        queue: 'dead_letter_dataloader_bitbucket_commits_queue',
    })
    public async handleDeadLetterMessages(message: any, amqpMessage: ConsumeMessage) {
        this.logger.error(`rabbitmq::dead-letter::received message: ${JSON.stringify(message)}`);
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
            const result = await this.fetchCommitExtraInfoFromBitbucketUseCase.execute(message);

            if (result?.error) {
                return new Nack(false);
            }

            // TODO - Atualizar a collection de squads com os nomes dos membros do squad
            // TODO - TAMBEM POSSO EXTRAIR DO COMMIT O projectId relacionado ao squadId e atualizar a collection de squads para preencher o linkedProjects
            // const squadDocument: SquadDocument  = await this.squadRepository.getSquadById(updatedCommit.squadId);
            // console.log('squadDocument:::', squadDocument.documentId);
            // if (squadDocument.documentId) {
            //     const { authorId, authorName, AuthorEmail } = updatedCommit;
            //     const member = { id: authorId, name: authorName, email: AuthorEmail };
            //     console.log('member:::', member);
            //     const isAuthorInMemberList = squadDocument?.members?.length > 0 && !!squadDocument?.members?.find(member => member.id === authorId);
            //     const squad = SquadDocumentsMapper.toEntities([squadDocument])[0];
            //     if (!isAuthorInMemberList) {
            //         squadDocument.members.push(member);
            //         await this.squadRepository.save(squad);
            //     }
            // }
        } catch (error) {
            this.logger.error(`error:: ${error}`);
            return new Nack(false);
        }
    }
}