import { Commit } from 'src/domain/entities/commit.entity';
import { Inject } from "@nestjs/common";
import { DataLoaderBitbucketCommitsExtraInfoUseCase } from "./interfaces/data-loader-bitbucket-commits-extrainfo.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { BitbucketGateway } from "../gateways/bitbucket.gateway";
import { CommitRepository } from "src/infrastructure/repositories/commit.repository";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { ProjectRepository } from "src/infrastructure/repositories/project.repository";
import { ListProjectsUseCase } from './interfaces/list-projects.usecase';
import { ListProjectsOutputSuccessDTO } from '../dtos/list-projects-output-success.dto';
import { Project } from 'src/domain/entities/project.entity';

export class DataLoaderBitbucketCommitsExtraInfoImplUseCase implements DataLoaderBitbucketCommitsExtraInfoUseCase {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('ProjectRepository') private readonly projectRepository: ProjectRepository,
        @Inject('BitbucketGateway') private readonly bitbucketGateway: BitbucketGateway,
        @Inject('CommitRepository') private readonly commitRepository: CommitRepository,
        @Inject('ListProjectsUseCase') private readonly listProjectsUseCase: ListProjectsUseCase,
        private amqpConnection: AmqpConnection,
    ) {
        this.logger.setContext(DataLoaderBitbucketCommitsExtraInfoImplUseCase.name);
    }

    async execute(): Promise<void> {
        this.logger.log('Iniciando processo de carregamento de informações extras dos commits do Bitbucket');


        // TODO - as constantes com _ são temporarias para nao executar todos os commits - REMOVER depois de concluir as implementações

        const projectIds = await this._getProjectIdsFromDatabase();
        const _temporaryProjectIds = [projectIds[0]];
        const projectsWithCommitsMap: Map<string, any[]> = await this._getProjectsWithCommitsFromDatabase(_temporaryProjectIds);
        console.log('\n\nprojectsWithCommitsMap:::')
        console.log(JSON.stringify(projectsWithCommitsMap.get(_temporaryProjectIds[0]), null, 2));
        const _temporaryCommits = [...projectsWithCommitsMap.get(_temporaryProjectIds[0])];
        const _temporaryCommitAux = new Map(_temporaryCommits.map((commit: Commit) => [_temporaryProjectIds[0], [commit]]));
        await this._sendToBitbucketCommitsExtraInfoQueue(_temporaryCommitAux);

        this.logger.log('Processo de carregamento de informações extras dos commits do Bitbucket finalizado');
    }

    // TODO - Converter para ListProjectsWithCommitsUseCase
    private async _getProjectIdsFromDatabase(): Promise<string[]> {
        const result: ListProjectsOutputSuccessDTO = await this.listProjectsUseCase.execute();
        return result.values.map((project: Project) => project.getDocumentId());
    }

    // TODO - Converter para usecase - vai ser util quando for necessario calcular o lead time -> ListCommitsFromProjectUseCase & ListProjectsWithCommitsUseCase
    private async _getProjectsWithCommitsFromDatabase(projectIds: string[]): Promise<Map<string, any[]>> {
        const projectsWithCommitsMap = new Map<string, any[]>();

        for (const projectId of projectIds) {
            const commits = await this.commitRepository.getAllByFields({ statusQueue: 'Em Processamento', projectId });
            if (!commits.length) {
                this.logger.log(`Nenhum commit encontrado para o projeto: ${projectId}`);
                continue;
            }
            projectsWithCommitsMap.set(projectId, commits);
        }

        return projectsWithCommitsMap;
    }

    private async _sendToBitbucketCommitsExtraInfoQueue(projectsWithCommitsMap: Map<string, any[]>) {
        for (const commits of projectsWithCommitsMap.values()) {
            for (const commitItem of commits) {
                this.amqpConnection.publish('bitbucket_commit_extrainfo_exchange', `commit.${commitItem.documentId}.extrainfo`, {
                    projectId: commitItem.projectId,
                    commitId: commitItem.documentId,
                });
            }
        }
    }
}   