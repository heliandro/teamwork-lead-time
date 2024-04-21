import { Inject, Injectable } from "@nestjs/common";
import { DataLoaderBitbucketCommitsUseCase } from "./interfaces/data-loader-bitbucket-commits.usecase";
import { ListProjectsUseCase } from "./interfaces/list-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import GetAllSquadsUseCase from "./interfaces/get-all-squads.usecase";
import { GetAllSquadsOutputSuccessDTO } from "../dtos/get-all-squads-output-success.dto";
import { GetAppUpdateConfigOutputSuccessDTO } from "../dtos/get-app-update-config-output-success.dto";
import { GetAppUpdateConfigUseCase } from "./interfaces/get-app-update-config.usecase";
import { ModifyAppUpdateConfigUseCase } from "./interfaces/modify-app-update-config.usecase";
import { AppUpdateConfig } from "src/domain/entities/app-update-config.entity";
import { Project } from "src/domain/entities/project.entity";
import { ModifyAppUpdateConfigInputDTO } from "../dtos/modify-app-update-config-input.dto";
import { BitbucketGateway } from "src/application/gateways/bitbucket.gateway";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { CommitRepository } from "src/infrastructure/repositories/commit.repository";

@Injectable()
export class DataLoaderBitbucketCommitsImplUseCase implements DataLoaderBitbucketCommitsUseCase {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('BitbucketGateway')
        private readonly bitbucketGateway: BitbucketGateway,
        @Inject('GetAllSquadsUseCase')
        private readonly getAllSquadsUseCase: GetAllSquadsUseCase,
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
            const squadProjectIds = await this._getProjectIdsFromSquadsDatabase();
            const projectIds = await this._getProjectIdsFromProjectsDatabase(squadProjectIds);
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

    private async _getProjectIdsFromSquadsDatabase(): Promise<string[]> {
        const squads: GetAllSquadsOutputSuccessDTO = await this.getAllSquadsUseCase.execute();
        const projectIds = this._filterProjectsIdsFromSquads(squads);
        return projectIds;
    }

    private async _getProjectIdsFromProjectsDatabase(projectIds: string[]): Promise<string[]> {
        const projects = await this.listProjectsUseCase.execute({ projectIds });
        const filteredProjectIds = await this._filterProjectsIdsFromProjects(projects.values);
        return filteredProjectIds;
    }

    private async _filterProjectsIdsFromProjects(projects: Project[]): Promise<string[]> {
        return projects.map(project => project.getDocumentId());
    }

    private async _deleteAllCommitsFromDatabase(): Promise<void> {
        await this.commitRepository.deleteAll();
    }

    private async _sendToBitbucketCommitsQueue(projectIds: string[]): Promise<void> {
        while (projectIds.length > 0) {
            const projectId = projectIds.shift();
            const message = {
                projectId
            }
            await this.amqpConnection.publish('bitbucket_commits_exchange', `project.${projectId}.commits`, message);
        }
    }

    private async _updateAppConfiguration(document: AppUpdateConfig): Promise<void> {
        const inputDTO: ModifyAppUpdateConfigInputDTO = {
            documentId: document.getDocumentId(),
            bitbucketProjectsLastUpdate: document.getBitbucketProjectsLastUpdate(),
            bitbucketCommitsLastUpdate: new Date(),
            bambooLastUpdate: document.getBambooLastUpdate(),
            jiraLastUpdate: document.getJiraLastUpdate(),
        }
        await this.modifyAppUpdateConfigUseCase.execute(inputDTO);
    }

    private _filterProjectsIdsFromSquads(squads: GetAllSquadsOutputSuccessDTO): string[] {
        return squads.values.reduce((acc, squad) => {
            return [...acc, ...squad.getLinkedProjects().map((project: any) => project.name)];
        }, []);
    }
}