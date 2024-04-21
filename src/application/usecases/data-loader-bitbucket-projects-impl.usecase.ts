import { Inject, Injectable } from '@nestjs/common';
import { DataLoaderBitbucketProjectsUseCase } from "./interfaces/data-loader-bitbucket-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { BitbucketGateway } from "src/application/gateways/bitbucket.gateway";
import { GetAppUpdateConfigOutputSuccessDTO } from "../dtos/get-app-update-config-output-success.dto";
import { GetAppUpdateConfigUseCase } from './interfaces/get-app-update-config.usecase';
import { ModifyAppUpdateConfigUseCase } from './interfaces/modify-app-update-config.usecase';
import { ModifyAppUpdateConfigInputDTO } from '../dtos/modify-app-update-config-input.dto';
import { RegisterProjectsUseCase } from './interfaces/register-projects.usecase';
import { GetAllSquadsOutputSuccessDTO } from '../dtos/get-all-squads-output-success.dto';
import GetAllSquadsUseCase from './interfaces/get-all-squads.usecase';
import { AppUpdateConfig } from 'src/domain/entities/app-update-config.entity';

@Injectable()
export class DataLoaderBitbucketProjectsImplUseCase implements DataLoaderBitbucketProjectsUseCase {
    
    constructor(
        @Inject('GetAllSquadsUseCase')
        private readonly getAllSquadsUseCase: GetAllSquadsUseCase,
        @Inject('BitbucketGateway')
        private readonly bitbucketGateway: BitbucketGateway,
        @Inject('GetAppUpdateConfigUseCase')
        private readonly getAppUpdateConfigUseCase: GetAppUpdateConfigUseCase,
        @Inject('ModifyAppUpdateConfigUseCase')
        private readonly modifyAppUpdateConfigUseCase: ModifyAppUpdateConfigUseCase,
        @Inject('RegisterProjectsUseCase')
        private readonly registerProjectsUseCase: RegisterProjectsUseCase,
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
        const appLastUpdateResponse: GetAppUpdateConfigOutputSuccessDTO = await this.getAppUpdateConfigUseCase.execute();
        return appLastUpdateResponse.values;
    }

    private validateIfBitbucketProjectsUpdated(isBitbucketProjectsUpdated: boolean): void {
        this.logger.log('validando se a carga dos dados de projetos do bitbucket é necessária...');
        if (isBitbucketProjectsUpdated) {
            throw Error('o bitbucket já foi atualizado, não é necessário realizar a carga dos dados de projetos do bitbucket!');
        }
    }

    private async getProjectsIdsFromSquads(): Promise<string[]> {
        const squads: GetAllSquadsOutputSuccessDTO = await this.getAllSquadsUseCase.execute();
        const projectIds = this._getProjectsIdsFromSquads(squads);
        return projectIds;
    }

    private async getBitbucketProjects(projectIds: string[]): Promise<any[]> {
        const bitbucketProjects = await this.bitbucketGateway.fetchProjects(projectIds);
        return bitbucketProjects;
    }

    private async saveProjectsInDatabase(bitbucketProjects: any[]): Promise<void> {
        await this.registerProjectsUseCase.execute({ projects: bitbucketProjects });
    }

    private async updateAppConfiguration(document: AppUpdateConfig): Promise<void> {
        const setAppLastUpdateRequestDTO: ModifyAppUpdateConfigInputDTO = {
            documentId: document.getDocumentId(),
            bitbucketProjectsLastUpdate: new Date()
        }
        await this.modifyAppUpdateConfigUseCase.execute(setAppLastUpdateRequestDTO);
    }

    private _getProjectsIdsFromSquads(squads: GetAllSquadsOutputSuccessDTO): string[] {
        return squads.values.reduce((acc, squad) => {
            return [...acc, ...squad.getLinkedProjects().map((project: any) => project.name)];
        }, []);
    }
}