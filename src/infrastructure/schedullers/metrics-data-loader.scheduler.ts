import { Injectable, Inject, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';
import { AppConfigurationRepository } from '../repositories/app-configuration.repository';
import { AppLastUpdateDocument } from 'src/domain/schemas/app-lastupdate.schema';
import { BitbucketGateway } from '../gateways/bitbucket-impl.gateway';
import GetSquadsUseCase from 'src/application/usecases/interfaces/get-squads.usecase';
import { GetSquadsResponseSuccessDTO } from 'src/application/dtos/get-squads-response-success.dto';
import { GetAppLastUpdateUseCase } from 'src/application/usecases/interfaces/get-app-last-update.usecase';
import { GetAppLastUpdateResponseSuccessDTO } from 'src/application/dtos/get-app-last-update-response-success.dto';
import { AppLastUpdate } from 'src/domain/entities/app-last-update.entity';
import { DataLoaderBitbucketProjectsUseCase } from 'src/application/usecases/interfaces/data-loader-bitbucket-projects.usecase';
import { GetProjectsUseCase } from 'src/application/usecases/interfaces/get-projects.usecase';

@Injectable()
export class MetricsDataLoaderScheduler {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('DataLoaderBitbucketProjectsUseCase')
        private readonly dataLoaderBitbucketProjectsUseCase: DataLoaderBitbucketProjectsUseCase,

        @Inject('GetProjectsUseCase')
        private readonly getProjectsUseCase: GetProjectsUseCase,
    ) {
        this.logger.setContext(MetricsDataLoaderScheduler.name);
        this.init();
    }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    private handleCron() {
        this.init();
    }

    private async init() {
        try {
            this.runDataLoader();
        } catch (error) {
            this.logger.error(`${error.message} - carga de dados cancelada!`);
        }
    }

    private async runDataLoader() {
        this.logger.log('scheduler de carga dos dados de métricas iniciada!');

        await this.dataLoaderBitbucketProjectsUseCase.execute();
        await this.getProjectsUseCase.execute();

        // TODO - implementar usecase para buscar os projetos do bitbucket no mongo
        // const projects = await new GetProjectsUseCase.execute()

        // TODO - implementar usecase para recuperar os commits do bitcket e salvar no mongo
        // await new DataLoaderBitbucketCommitsForProjectsUseCase.execute()

            // TODO - composicao - projects + data commits
            // const projects = await new GetProjectsUseCase.execute()
            // schema - projectId + os demais campos do commit a serem mapeados
            // const commitsDoProjeto = await new BitbucketGateway.getCommits(projectId)
            // agrupar commits por historia do jira
            // await CommitsRepository.save(commitsDoProjetoAgrupadosPorTaskJira)

        // TODO - OUTRO ESCOPO - ENDPOINT -> ENTRADA: data-inicio, data-fim do range, filtro para 1..n squads
        // [ ] LEAD TIME DAS SQUADS - USECASE - ORQUESTRAR -- USAR OS USECASES ANTERIORES + LOGICA
    }
}
