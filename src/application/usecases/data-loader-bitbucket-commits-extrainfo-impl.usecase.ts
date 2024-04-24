import { Commit } from 'src/domain/entities/commit.entity';
import { Inject } from "@nestjs/common";
import { DataLoaderBitbucketCommitsExtraInfoUseCase } from "./interfaces/data-loader-bitbucket-commits-extrainfo.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { CommitRepository } from "src/infrastructure/repositories/commit.repository";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { ListProjectsUseCase } from './interfaces/list-projects.usecase';
import { ListProjectsOutputSuccessDTO } from '../dtos/list-projects-output-success.dto';
import { Project } from 'src/domain/entities/project.entity';
import { ListCommitsFromProjectUseCase } from './interfaces/list-commits-from-project.usecase';
import { ListCommitsFromProjectOutputDTO } from '../dtos/list-commits-from-project-output.dto';
import { GetAppUpdateConfigUseCase } from './interfaces/get-app-update-config.usecase';
import { ModifyAppUpdateConfigUseCase } from './interfaces/modify-app-update-config.usecase';
import { AppUpdateConfig } from 'src/domain/entities/app-update-config.entity';
import { GetAppUpdateConfigOutputSuccessDTO } from '../dtos/get-app-update-config-output-success.dto';
import { ModifyAppUpdateConfigInputDTO } from '../dtos/modify-app-update-config-input.dto';

export class DataLoaderBitbucketCommitsExtraInfoImplUseCase implements DataLoaderBitbucketCommitsExtraInfoUseCase {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('GetAppUpdateConfigUseCase') private readonly getAppUpdateConfigUseCase: GetAppUpdateConfigUseCase,
        @Inject('ModifyAppUpdateConfigUseCase') private readonly modifyAppUpdateConfigUseCase: ModifyAppUpdateConfigUseCase,
        @Inject('ListProjectsUseCase') private readonly listProjectsUseCase: ListProjectsUseCase,
        @Inject('ListCommitsFromProjectUseCase') private readonly listCommitsFromProjectUseCase: ListCommitsFromProjectUseCase,
        private amqpConnection: AmqpConnection,
    ) {
        this.logger.setContext(DataLoaderBitbucketCommitsExtraInfoImplUseCase.name);
    }

    async execute(): Promise<void> {
        this.logger.log('Iniciando processo de carregamento de informações extras dos commits do Bitbucket');

        try {
            const { document, isBitbucketCommitsExtraInfoUpdated } = await this._getAppConfiguration();
            this._validateIfBitbucketCommitsIsUpdated(isBitbucketCommitsExtraInfoUpdated);
            const projectIds = await this._getProjectIdsFromDatabase();
            const projectsWithCommitsMap: Map<string, any[]> = await this._getProjectsWithCommitsFromDatabase(projectIds);
            await this._sendToBitbucketCommitsExtraInfoQueue(projectsWithCommitsMap);
            this.logger.log('Processo de carregamento de informações extras dos commits do Bitbucket finalizado');
            await this._updateAppConfiguration(document);
        } catch (error) {
            this.logger.error(`${error.message}`);
        }
    }

    private async _getAppConfiguration(): Promise<{ document: AppUpdateConfig, isBitbucketCommitsExtraInfoUpdated: boolean }> {
        const appLastUpdateResponse: GetAppUpdateConfigOutputSuccessDTO = await this.getAppUpdateConfigUseCase.execute();
        return appLastUpdateResponse.values;
    }

    private _validateIfBitbucketCommitsIsUpdated(isBitbucketCommitsExtraInfoUpdated: boolean): void {
        this.logger.log('validando se a carga dos dados de commits do bitbucket para informações extras é necessária...');
        if (isBitbucketCommitsExtraInfoUpdated) {
            throw Error('o bitbucket já foi atualizado, não é necessário realizar a carga dos dados de commits do bitbucket para informações extras!');
        }
    }

    private async _getProjectIdsFromDatabase(): Promise<string[]> {
        const result: ListProjectsOutputSuccessDTO = await this.listProjectsUseCase.execute();
        return result.values.map((project: Project) => project.getDocumentId());
    }

    private async _getProjectsWithCommitsFromDatabase(projectIds: string[]): Promise<Map<string, any[]>> {
        const projectsWithCommitsMap = new Map<string, any[]>();

        for (const projectId of projectIds) {
            const commits: ListCommitsFromProjectOutputDTO = await this.listCommitsFromProjectUseCase.execute({ projectId });
            projectsWithCommitsMap.set(projectId, commits.values);
        }
        return projectsWithCommitsMap;
    }

    private async _sendToBitbucketCommitsExtraInfoQueue(projectsWithCommitsMap: Map<string, any[]>) {
        for (const commits of projectsWithCommitsMap.values()) {
            for (const commitItem of commits) {
                await this.amqpConnection.publish('bitbucket_commit_extrainfo_exchange', `commit.${commitItem.documentId}.extrainfo`, {
                    projectId: commitItem.projectId,
                    commitId: commitItem.documentId,
                    jiraIssueId: commitItem.jiraIssueId,
                });
            }
        }
    }

    private async _updateAppConfiguration(document: AppUpdateConfig): Promise<void> {
        const inputDTO: ModifyAppUpdateConfigInputDTO = {
            documentId: document.getDocumentId(),
            bitbucketProjectsLastUpdate: document.getBitbucketProjectsLastUpdate(),
            bitbucketCommitsLastUpdate: document.getBitbucketCommitsLastUpdate(),
            bitbucketCommitsExtraInfoLastUpdate: new Date(),
            bambooLastUpdate: document.getBambooLastUpdate(),
            jiraLastUpdate: document.getJiraLastUpdate(),
        }
        await this.modifyAppUpdateConfigUseCase.execute(inputDTO);
    }
}   