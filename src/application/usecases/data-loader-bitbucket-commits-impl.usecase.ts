import { Inject, Injectable } from "@nestjs/common";
import { DataLoaderBitbucketCommitsUseCase } from "./interfaces/data-loader-bitbucket-commits.usecase";
import { GetProjectsUseCase } from "./interfaces/get-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import GetSquadsUseCase from "./interfaces/get-squads.usecase";
import { GetSquadsResponseSuccessDTO } from "../dtos/get-squads-response-success.dto";
import { GetAppLastUpdateResponseSuccessDTO } from "../dtos/get-app-last-update-response-success.dto";
import { GetAppLastUpdateUseCase } from "./interfaces/get-app-last-update.usecase";
import { SetAppLastUpdateUseCase } from "./interfaces/set-app-last-update.usecase";
import { AppLastUpdate } from "src/domain/entities/app-last-update.entity";
import { Project } from "src/domain/entities/project.entity";
import { SetAppLastUpdateRequestDTO } from "../dtos/set-app-last-update-request.dto";

@Injectable()
export class DataLoaderBitbucketCommitsImplUseCase implements DataLoaderBitbucketCommitsUseCase {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('GetSquadsUseCase')
        private readonly getSquadsUseCase: GetSquadsUseCase,
        @Inject('GetProjectsUseCase')
        private readonly getProjectsUseCase: GetProjectsUseCase,
        @Inject('GetAppLastUpdateUseCase')
        private readonly getAppLastUpdateUseCase: GetAppLastUpdateUseCase,
        @Inject('SetAppLastUpdateUseCase')
        private readonly setAppLastUpdateUseCase: SetAppLastUpdateUseCase,
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

            // TODO - implementar chamada para recuperar os commits do bitbucket via gateway
            // schema - projectId + os demais campos do commit a serem mapeados
            // const commitsDoProjeto = await new BitbucketGateway.getCommits(projectId)
            // agrupar commits por historia do jira
            // await CommitsRepository.save(commitsDoProjetoAgrupadosPorTaskJira)
        } catch (error) {
            this.logger.error(`${error.message}`);
        }
    }

    private async getAppConfiguration(): Promise<{ document: AppLastUpdate, isBitbucketCommitsUpdated: boolean }> {
        const appLastUpdateResponse: GetAppLastUpdateResponseSuccessDTO = await this.getAppLastUpdateUseCase.execute();
        return appLastUpdateResponse.values;
    }

    private async validateIfBitbucketCommitsIsUpdated(isBitbucketCommitsUpdated: boolean): Promise<void> {
        this.logger.log('validando se a carga dos dados de commits do bitbucket é necessária...');
        if (isBitbucketCommitsUpdated) {
            throw new Error('o bitbucket já foi atualizado, não é necessário realizar a carga dos dados de commits do bitbucket!');
        }
    }

    private async getProjectsIdsFromSquads(): Promise<string[]> {
        const squads: GetSquadsResponseSuccessDTO = await this.getSquadsUseCase.execute();
        const projectIds = this._getProjectsIdsFromSquads(squads);
        return projectIds;
    }

    private async getProjectsFromDatabase(projectIds: string[]): Promise<Project[]> {
        const projects = await this.getProjectsUseCase.execute({ projectIds });
        return projects.values;
    }

    private async updateAppConfiguration(document: AppLastUpdate): Promise<void> {
        const setAppLastUpdateRequestDTO: SetAppLastUpdateRequestDTO = {
            documentId: document.getDocumentId(),
            bitbucketCommitsLastUpdate: new Date()
        }
        await this.setAppLastUpdateUseCase.execute(setAppLastUpdateRequestDTO);
    }

    private _getProjectsIdsFromSquads(squads: GetSquadsResponseSuccessDTO): string[] {
        return squads.values.reduce((acc, squad) => {
            return [...acc, ...squad.getLinkedProjects().map((project: any) => project.name)];
        }, []);
    }
}