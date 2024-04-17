import { Inject, Injectable } from '@nestjs/common';
import { DataLoaderBitbucketProjectsUseCase } from "./interfaces/data-loader-bitbucket-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { BitbucketGateway } from "src/infrastructure/gateways/bitbucket-impl.gateway";
import { GetAppLastUpdateResponseSuccessDTO } from "../dtos/get-app-last-update-response-success.dto";
import { GetAppLastUpdateUseCase } from './interfaces/get-app-last-update.usecase';
import { SetAppLastUpdateUseCase } from './interfaces/set-app-last-update.usecase';
import { SetAppLastUpdateRequestDTO } from '../dtos/set-app-last-update-request.dto';
import { SetProjectsUseCase } from './interfaces/set-projects.usecase';
import { GetSquadsResponseSuccessDTO } from '../dtos/get-squads-response-success.dto';
import GetSquadsUseCase from './interfaces/get-squads.usecase';

@Injectable()
export class DataLoaderBitbucketProjectsImplUseCase implements DataLoaderBitbucketProjectsUseCase {
    
    constructor(
        @Inject('GetSquadsUseCase')
        private readonly getSquadsUseCase: GetSquadsUseCase,
        @Inject('BitbucketGateway')
        private readonly bitbucketGateway: BitbucketGateway,
        @Inject('GetAppLastUpdateUseCase')
        private readonly getAppLastUpdateUseCase: GetAppLastUpdateUseCase,
        @Inject('SetAppLastUpdateUseCase')
        private readonly setAppLastUpdateUseCase: SetAppLastUpdateUseCase,
        @Inject('SetProjectsUseCase')
        private readonly setProjectsUseCase: SetProjectsUseCase,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService
    ) {
        this.logger.setContext(DataLoaderBitbucketProjectsImplUseCase.name);
    }

    async execute(): Promise<void> {
        this.logger.log('carga dos dados de projetos do bitbucket iniciada!');
        const appLastUpdateResponse: GetAppLastUpdateResponseSuccessDTO = await this.getAppLastUpdateUseCase.execute();

        this.logger.log('validando se a carga dos dados de projetos do bitbucket é necessária...');
        if (appLastUpdateResponse.values.isBitbucketUpdated) { // TODO - refatorar para isBitbucketCommitsUpdated, isBitbucketProjectsUpdated
            this.logger.log('o bitbucket já foi atualizado, não é necessário realizar a carga dos dados de projetos do bitbucket!');
            return;
        }

        const squads: GetSquadsResponseSuccessDTO = await this.getSquadsUseCase.execute();
        const projectsIds = this._getProjectsIdsFromSquads(squads);
        const bitbucketProjects = await this.bitbucketGateway.getProjects(projectsIds);

        await this.setProjectsUseCase.execute({ projects: bitbucketProjects });

        const setAppLastUpdateRequestDTO: SetAppLastUpdateRequestDTO = {
            documentId: appLastUpdateResponse.values.document.getDocumentId(),
            bitbucketLastUpdate: new Date()
        }
        this.setAppLastUpdateUseCase.execute(setAppLastUpdateRequestDTO);
    }

    private _getProjectsIdsFromSquads(squads: GetSquadsResponseSuccessDTO): string[] {
        return squads.values.reduce((acc, squad) => {
            return [...acc, ...squad.getLinkedProjects().map((project: any) => project.name)];
        }, []);
    }
}