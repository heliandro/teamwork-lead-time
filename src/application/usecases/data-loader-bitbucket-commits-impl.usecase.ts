import { Inject, Injectable } from "@nestjs/common";
import { DataLoaderBitbucketCommitsUseCase } from "./interfaces/data-loader-bitbucket-commits.usecase";
import { GetProjectsUseCase } from "./interfaces/get-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import GetSquadsUseCase from "./interfaces/get-squads.usecase";
import { GetSquadsResponseSuccessDTO } from "../dtos/get-squads-response-success.dto";
import { GetAppLastUpdateResponseSuccessDTO } from "../dtos/get-app-last-update-response-success.dto";
import { GetAppLastUpdateUseCase } from "./interfaces/get-app-last-update.usecase";
import { SetAppLastUpdateUseCase } from "./interfaces/set-app-last-update.usecase";

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
        this.logger.log('iniciando carga dos commits do bitbucket...');

        const appLastUpdateResponse: GetAppLastUpdateResponseSuccessDTO = await this.getAppLastUpdateUseCase.execute();

        this.logger.log('validando se a carga dos dados de projetos do bitbucket é necessária...');
        if (appLastUpdateResponse.values.isBitbucketUpdated) {  // TODO - refatorar para isBitbucketCommitsUpdated, isBitbucketProjectsUpdated
            this.logger.log('o bitbucket já foi atualizado, não é necessário realizar a carga dos dados de projetos do bitbucket!');
            return;
        }

        const squads: GetSquadsResponseSuccessDTO = await this.getSquadsUseCase.execute();
        const projectIds = this._getProjectsIdsFromSquads(squads);
        const projects = await this.getProjectsUseCase.execute({ projectIds });

        // TODO - implementar chamada para recuperar os commits do bitbucket via gateway
    }

    private _getProjectsIdsFromSquads(squads: GetSquadsResponseSuccessDTO): string[] {
        return squads.values.reduce((acc, squad) => {
            return [...acc, ...squad.getLinkedProjects().map((project: any) => project.name)];
        }, []);
    }
}