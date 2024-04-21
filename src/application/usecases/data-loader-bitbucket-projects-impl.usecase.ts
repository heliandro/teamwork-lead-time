import { Inject, Injectable } from '@nestjs/common';
import { DataLoaderBitbucketProjectsUseCase } from "./interfaces/data-loader-bitbucket-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { BitbucketGateway } from "src/infrastructure/gateways/bitbucket-impl.gateway";
import { GetAppUpdateConfigOutputSuccessDTO } from "../dtos/get-app-update-config-output-success.dto";
import { GetAppUpdateConfigUseCase } from './interfaces/get-app-update-config.usecase';
import { SetAppUpdateConfigUseCase } from './interfaces/set-app-update-config.usecase';
import { SetAppUpdateConfigInputDTO } from '../dtos/set-app-update-config-input.dto';
import { SetProjectsUseCase } from './interfaces/set-projects.usecase';
import { GetSquadsResponseSuccessDTO } from '../dtos/get-squads-response-success.dto';
import GetSquadsUseCase from './interfaces/get-squads.usecase';
import { AppUpdateConfig } from 'src/domain/entities/app-update-config.entity';

@Injectable()
export class DataLoaderBitbucketProjectsImplUseCase implements DataLoaderBitbucketProjectsUseCase {
    
    constructor(
        @Inject('GetSquadsUseCase')
        private readonly getSquadsUseCase: GetSquadsUseCase,
        @Inject('BitbucketGateway')
        private readonly bitbucketGateway: BitbucketGateway,
        @Inject('GetAppLastUpdateUseCase')
        private readonly getAppLastUpdateUseCase: GetAppUpdateConfigUseCase,
        @Inject('SetAppLastUpdateUseCase')
        private readonly setAppLastUpdateUseCase: SetAppUpdateConfigUseCase,
        @Inject('SetProjectsUseCase')
        private readonly setProjectsUseCase: SetProjectsUseCase,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService
    ) {
        this.logger.setContext(DataLoaderBitbucketProjectsImplUseCase.name);
    }

    async execute(): Promise<void> {
        try {
            this.logger.log('carga dos dados de projetos do bitbucket iniciada!');
            const { isBitbucketProjectsUpdated, document } = await this.getAppConfiguration();
            this.validateIfBitbucketProjectsUpdated(isBitbucketProjectsUpdated);
            const projectIds = await this.getProjectsIdsFromSquads()
            const bitbucketProjects = await this.getBitbucketProjects(projectIds);
            await this.saveProjectsInDatabase(bitbucketProjects);
            await this.updateAppConfiguration(document);
            this.logger.log('carga dos dados de projetos do bitbucket finalizada!');
        } catch (error) {
            this.logger.error(`${error.message}`);
        }
    }

    private async getAppConfiguration(): Promise<{ document: AppUpdateConfig, isBitbucketProjectsUpdated: boolean }> {
        const appLastUpdateResponse: GetAppUpdateConfigOutputSuccessDTO = await this.getAppLastUpdateUseCase.execute();
        return appLastUpdateResponse.values;
    }

    private validateIfBitbucketProjectsUpdated(isBitbucketProjectsUpdated: boolean): void {
        this.logger.log('validando se a carga dos dados de projetos do bitbucket é necessária...');
        if (isBitbucketProjectsUpdated) {
            throw Error('o bitbucket já foi atualizado, não é necessário realizar a carga dos dados de projetos do bitbucket!');
        }
    }

    private async getProjectsIdsFromSquads(): Promise<string[]> {
        const squads: GetSquadsResponseSuccessDTO = await this.getSquadsUseCase.execute();
        const projectIds = this._getProjectsIdsFromSquads(squads);
        return projectIds;
    }

    private async getBitbucketProjects(projectIds: string[]): Promise<any[]> {
        const bitbucketProjects = await this.bitbucketGateway.getProjects(projectIds);
        return bitbucketProjects;
    }

    private async saveProjectsInDatabase(bitbucketProjects: any[]): Promise<void> {
        await this.setProjectsUseCase.execute({ projects: bitbucketProjects });
    }

    private async updateAppConfiguration(document: AppUpdateConfig): Promise<void> {
        const setAppLastUpdateRequestDTO: SetAppUpdateConfigInputDTO = {
            documentId: document.getDocumentId(),
            bitbucketProjectsLastUpdate: new Date()
        }
        await this.setAppLastUpdateUseCase.execute(setAppLastUpdateRequestDTO);
    }

    private _getProjectsIdsFromSquads(squads: GetSquadsResponseSuccessDTO): string[] {
        return squads.values.reduce((acc, squad) => {
            return [...acc, ...squad.getLinkedProjects().map((project: any) => project.name)];
        }, []);
    }
}