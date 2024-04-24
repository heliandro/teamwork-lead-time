import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';
import { DataLoaderBitbucketProjectsUseCase } from 'src/application/usecases/interfaces/data-loader-bitbucket-projects.usecase';
import { DataLoaderBitbucketCommitsUseCase } from 'src/application/usecases/interfaces/data-loader-bitbucket-commits.usecase';
import { DataLoaderBitbucketCommitsExtraInfoUseCase } from 'src/application/usecases/interfaces/data-loader-bitbucket-commits-extrainfo.usecase';

@Injectable()
export class MetricsDataLoaderScheduler {

    private static MONDAY_TO_FRIDAY_AT_9AM = "0 0 09 * * 1-5";
    private static MONDAY_TO_FRIDAY_AT_09_30AM = "0 30 09 * * 1-5";
    private static MONDAY_TO_FRIDAY_AT_09_15AM = '0 15 09 * * 1-5';
    private static EVERY_5_MINUTES = "0 */5 * * * *" // a cada 5 minutos
    private static MONDAY_TO_FRIDAY_EVERY_5_MINUTES: string = '0 */5 * * * 1-7';
    private static MONDAY_AT_7AM = "0 0 07 * * 1";
    private static MONDAY_AT_7AM_30 = "0 30 07 * * 1";

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('DataLoaderBitbucketProjectsUseCase')
        private readonly dataLoaderBitbucketProjectsUseCase: DataLoaderBitbucketProjectsUseCase,
        @Inject('DataLoaderBitbucketCommitsUseCase')
        private readonly dataLoaderBitbucketCommitsUseCase: DataLoaderBitbucketCommitsUseCase,
        @Inject('DataLoaderBitbucketCommitsExtraInfoUseCase')
        private readonly dataLoaderBitbucketCommitsExtraInfoUseCase: DataLoaderBitbucketCommitsExtraInfoUseCase,
    ) {
        this.logger.setContext(MetricsDataLoaderScheduler.name);
        this.loarderMainInfo();
        setTimeout(() => {
            this.loaderExtraInfo();
        }, 1000 * 60 * 5); // 30 minutos
    }

    @Cron(MetricsDataLoaderScheduler.MONDAY_AT_7AM)
    private handleMainCron() {
        this.loarderMainInfo();
    }

    // every day of week at 9:15 AM
    @Cron(MetricsDataLoaderScheduler.MONDAY_AT_7AM_30)
    private handleExtraCron() {
        // this.loaderExtraInfo();
    }

    private async loarderMainInfo() {
        try {
            this.runMainDataLoader();
        } catch (error) {
            this.logger.error(`${error.message} - carga de dados de métricas principal cancelada!`);
        }
    }

    private async runMainDataLoader() {
        try {
            this.logger.log('scheduler de carga dos dados de métricas principal iniciada!');
            await this.dataLoaderBitbucketProjectsUseCase.execute();
            await this.dataLoaderBitbucketCommitsUseCase.execute();
            this.logger.log('scheduler de carga dos dados de métricas principal finalizada!');
        } catch (error) {
            this.logger.error(`scheduler de carga dos dados de métricas principal finalizada com erro: ${error.message}`);
        }
    }

    private async loaderExtraInfo() {
        try {
            this.runExtraDataLoader();
        } catch (error) {
            this.logger.error(`${error.message} - carga de dados de métricas para informações adicionais cancelada!`);
        }
    }

    private async runExtraDataLoader() {
        try {
            this.logger.log('scheduler de carga de dados de métricas para informações adicionais iniciada!');
            await this.dataLoaderBitbucketCommitsExtraInfoUseCase.execute();
            this.logger.log('scheduler de carga de dados de métricas para informações adicionais finalizada!');
        } catch (error) {
            this.logger.error(`scheduler de carga de dados de métricas para informações adicionais finalizada com erro: ${error.message}`);
        }
    }
}
