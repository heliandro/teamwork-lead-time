import { RabbitSubscribe, Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable } from "@nestjs/common";
import { ConsumeMessage } from 'amqplib';
import { BitbucketGateway } from "src/application/gateways/bitbucket.gateway";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { CommitRepository } from "../repositories/commit.repository";
import { BitbucketCommitsMapper } from "src/application/mappers/bitbucket-commits.mapper";
import { BitbucketCommitBranchInfoMapper } from "src/application/mappers/bitbucket-commit-branch-info.mapper";
import { JiraGateway } from "src/application/gateways/jira.gateway";
import { BitbucketCommitJiraInfoMapper } from "src/application/mappers/bitbucket-commit-jira-info.mapper";
import { SquadRepository } from "../repositories/squad.repository";
import { AppUpdateConfig } from '../../domain/entities/app-update-config.entity';
import { SquadDocument } from "src/domain/schemas/squad.schema";
import SquadDocumentsMapper from "src/application/mappers/squad-documents.mapper";

@Injectable()
export class CommitConsumerQueue {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('BitbucketGateway') private readonly bitbucketGateway: BitbucketGateway,
        @Inject('CommitRepository') private readonly commitRepository: CommitRepository,
        @Inject('JiraGateway') private readonly jiraGateway: JiraGateway,
        @Inject('SquadRepository') private readonly squadRepository: SquadRepository,
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

            if (!result?.size || !result?.values?.length) {
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
            let commitDocument = await this.commitRepository.getById(message.commitId);
            
            let updatedCommit;
            const commitBranchInfo = await this.bitbucketGateway.fetchCommitBranchInfo(message.commitId, message.projectId);
            updatedCommit = BitbucketCommitBranchInfoMapper.toEntity(commitBranchInfo, commitDocument);

            const commitJiraInfo = await this.jiraGateway.fetchIssue(message.jiraIssueId);
            updatedCommit = BitbucketCommitJiraInfoMapper.toEntity(commitJiraInfo, updatedCommit);
            console.log('commitJiraInfo:::', updatedCommit);

            updatedCommit.status = 'Finalizado';
            await this.commitRepository.save(updatedCommit);

            // TODO - Atualizar a collection de squads com os nomes dos membros do squad
            // TODO - TAMBEM POSSO EXTRAIR DO COMMIT O projectId relacionado ao squadId e atualizar a collection de squads para preencher o linkedProjects
            const squadDocument: SquadDocument  = await this.squadRepository.getSquadById(updatedCommit.squadId);
            console.log('squadDocument:::', squadDocument.documentId);
            if (squadDocument.documentId) {
                const { authorId, authorName, AuthorEmail } = updatedCommit;
                const member = { id: authorId, name: authorName, email: AuthorEmail };
                console.log('member:::', member);
                const isAuthorInMemberList = squadDocument?.members?.length > 0 && !!squadDocument?.members?.find(member => member.id === authorId);
                const squad = SquadDocumentsMapper.toEntities([squadDocument])[0];
                if (!isAuthorInMemberList) {
                    squadDocument.members.push(member);
                    await this.squadRepository.save(squad);
                }
            }
        } catch (error) {
            this.logger.error(`error:: ${error}`);
            return new Nack(false);
        }
    }
}