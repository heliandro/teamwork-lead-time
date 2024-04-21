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
    ) {
        this.logger.setContext(DataLoaderBitbucketCommitsImplUseCase.name);
    }

    async execute(): Promise<void> {
        try {
            this.logger.log('iniciando carga dos commits do bitbucket...');
            const { isBitbucketCommitsUpdated, document } = await this.getAppConfiguration();
            this.validateIfBitbucketCommitsIsUpdated(isBitbucketCommitsUpdated);
            const projectIds = await this.getProjectsIdsFromSquads();
            const projects = await this.getProjectsFromDatabase(projectIds);
            // TODO - Implementar fila de processamento para recuperar os commits de todos os projetos
                /* TODO - USAR RABBITMQ
                * 1. Criar uma fila de processamento para recuperar os commits dos projetos
                * 2. Recuperar 10e00 commits de um projeto por consumer e associar com o projectId + jiraKey + statusQueu = "Em Processamento"
                * 3. Criar uma collection de commits e Salvar no mongodb
                * 
                * 4. Criar outra fila de processamento para recuperar as informações da branch de cada commit
                * 5. Recuperar as informacoes do commit
                * 6. Buscar no bitbucket as informações da branch associada ao commit
                * 7. Associar as informações da branch com o commit + statusQue = "Finalizado"
                * 8. Atualizar a collection de commits do mongodb
                */

            // TODO - LEAD TIME - agrupar commits por jiraKey, pegar o primeiro commit e o último commit associado ao jiraKey e calcular o lead time
            
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

    private async getProjectsIdsFromSquads(): Promise<string[]> {
        const squads: GetAllSquadsOutputSuccessDTO = await this.getAllSquadsUseCase.execute();
        const projectIds = this._getProjectsIdsFromSquads(squads);
        return projectIds;
    }

    private async getProjectsFromDatabase(projectIds: string[]): Promise<Project[]> {
        const projects = await this.listProjectsUseCase.execute({ projectIds });
        return projects.values;
    }

    private async getBitbucketCommits(projectIds: string[]): Promise<any> {
        const bitbucketCommits = await this.bitbucketGateway.fetchCommits(projectIds[0]);
        return bitbucketCommits;
    }

    private async updateAppConfiguration(document: AppUpdateConfig): Promise<void> {
        const setAppLastUpdateRequestDTO: ModifyAppUpdateConfigInputDTO = {
            documentId: document.getDocumentId(),
            bitbucketCommitsLastUpdate: new Date()
        }
        await this.modifyAppUpdateConfigUseCase.execute(setAppLastUpdateRequestDTO);
    }

    private _getProjectsIdsFromSquads(squads: GetAllSquadsOutputSuccessDTO): string[] {
        return squads.values.reduce((acc, squad) => {
            return [...acc, ...squad.getLinkedProjects().map((project: any) => project.name)];
        }, []);
    }
}