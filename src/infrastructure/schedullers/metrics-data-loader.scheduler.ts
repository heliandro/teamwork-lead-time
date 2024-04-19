import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';
import { DataLoaderBitbucketProjectsUseCase } from 'src/application/usecases/interfaces/data-loader-bitbucket-projects.usecase';
import { GetProjectsUseCase } from 'src/application/usecases/interfaces/get-projects.usecase';
import { DataLoaderBitbucketCommitsUseCase } from 'src/application/usecases/interfaces/data-loader-bitbucket-commits.usecase';

@Injectable()
export class MetricsDataLoaderScheduler {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('DataLoaderBitbucketProjectsUseCase')
        private readonly dataLoaderBitbucketProjectsUseCase: DataLoaderBitbucketProjectsUseCase,
        @Inject('DataLoaderBitbucketCommitsUseCase')
        private readonly dataLoaderBitbucketCommitsUseCase: DataLoaderBitbucketCommitsUseCase,
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
        try {
            this.logger.log('scheduler de carga dos dados de métricas iniciada!');
            await this.dataLoaderBitbucketProjectsUseCase.execute();
            await this.dataLoaderBitbucketCommitsUseCase.execute();
            this.logger.log('scheduler de carga dos dados de métricas finalizada!');
        } catch (error) {
            this.logger.error(`scheduler de carga dos dados de métricas finalizada com erro: ${error.message}`);
        }
    }
}
