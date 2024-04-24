import { Inject, Injectable } from "@nestjs/common";
import { DataLoaderBitbucketCommitsUseCase } from "./interfaces/data-loader-bitbucket-commits.usecase";
import { ListProjectsUseCase } from "./interfaces/list-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { GetAppUpdateConfigOutputSuccessDTO } from "../dtos/get-app-update-config-output-success.dto";
import { GetAppUpdateConfigUseCase } from "./interfaces/get-app-update-config.usecase";
import { ModifyAppUpdateConfigUseCase } from "./interfaces/modify-app-update-config.usecase";
import { AppUpdateConfig } from "src/domain/entities/app-update-config.entity";
import { Project } from "src/domain/entities/project.entity";
import { ModifyAppUpdateConfigInputDTO } from "../dtos/modify-app-update-config-input.dto";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { CommitRepository } from "src/infrastructure/repositories/commit.repository";
import { ListProjectsOutputSuccessDTO } from "../dtos/list-projects-output-success.dto";

@Injectable()
export class DataLoaderBitbucketCommitsImplUseCase implements DataLoaderBitbucketCommitsUseCase {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('ListProjectsUseCase')
        private readonly listProjectsUseCase: ListProjectsUseCase,
        @Inject('GetAppUpdateConfigUseCase')
        private readonly getAppUpdateConfigUseCase: GetAppUpdateConfigUseCase,
        @Inject('ModifyAppUpdateConfigUseCase')
        private readonly modifyAppUpdateConfigUseCase: ModifyAppUpdateConfigUseCase,
        private amqpConnection: AmqpConnection,
        @Inject('CommitRepository')
        private readonly commitRepository: CommitRepository,
    ) {
        this.logger.setContext(DataLoaderBitbucketCommitsImplUseCase.name);
    }

    async execute(): Promise<void> {
        try {
            this.logger.log('iniciando carga dos commits do bitbucket...');
            const { isBitbucketCommitsUpdated, document } = await this.getAppConfiguration();
            this.validateIfBitbucketCommitsIsUpdated(isBitbucketCommitsUpdated);
            const projectIds: string[] = await this._getProjectIdsFromProjectsDatabase();
            await this._deleteAllCommitsFromDatabase();
            await this._sendToBitbucketCommitsQueue(projectIds);
            this.logger.log('processando carga dos commits do bitbucket via fila!');
            await this._updateAppConfiguration(document);
        } catch (error) {
            this.logger.error(`${error.message}`);
        }
    }

    private async getAppConfiguration(): Promise<{ document: AppUpdateConfig, isBitbucketCommitsUpdated: boolean }> {
        const appLastUpdateResponse: GetAppUpdateConfigOutputSuccessDTO = await this.getAppUpdateConfigUseCase.execute();
        return appLastUpdateResponse.values;
    }

    private validateIfBitbucketCommitsIsUpdated(isBitbucketCommitsUpdated: boolean): void {
        this.logger.log('validando se a carga dos dados de commits do bitbucket é necessária...');
        if (isBitbucketCommitsUpdated) {
            throw Error('o bitbucket já foi atualizado, não é necessário realizar a carga dos dados de commits do bitbucket!');
        }
    }

    private async _getProjectIdsFromProjectsDatabase(): Promise<string[]> {
        const projects: ListProjectsOutputSuccessDTO = await this.listProjectsUseCase.execute();
        const filteredProjectIds = this._filterProjectsIdsFromProjects(projects.values);
        return filteredProjectIds;
    }

    private async _filterProjectsIdsFromProjects(projects: Project[]): Promise<string[]> {
        return projects.map(project => project.getDocumentId());
    }

    private async _deleteAllCommitsFromDatabase(): Promise<void> {
        this.logger.log('deletando todos os commits do banco de dados...');
        await this.commitRepository.deleteAll();
    }

    private async _sendToBitbucketCommitsQueue(projectIds: string[]): Promise<void> {
        while (projectIds.length > 0) {
            const projectId = projectIds.shift();
            const message = { projectId }
            await this.amqpConnection.publish('bitbucket_commits_exchange', `project.${projectId}.commits`, message);
        }
    }

    private async _updateAppConfiguration(document: AppUpdateConfig): Promise<void> {
        const inputDTO: ModifyAppUpdateConfigInputDTO = {
            documentId: document.getDocumentId(),
            bitbucketProjectsLastUpdate: document.getBitbucketProjectsLastUpdate(),
            bitbucketCommitsLastUpdate: new Date(),
            bitbucketCommitsExtraInfoLastUpdate: document.getBitbucketCommitsExtraInfoLastUpdate(),
            bambooLastUpdate: document.getBambooLastUpdate(),
            jiraLastUpdate: document.getJiraLastUpdate(),
        }
        await this.modifyAppUpdateConfigUseCase.execute(inputDTO);
    }
}