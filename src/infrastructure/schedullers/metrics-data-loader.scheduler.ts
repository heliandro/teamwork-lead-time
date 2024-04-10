import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';
import { AppConfigurationRepository } from '../repositories/app-configuration.repository';
import { AppLastUpdateDocument } from 'src/domain/schemas/app-lastupdate.schema';
import { BitbucketGateway } from '../gateways/bitbucket-impl.gateway';

@Injectable()
export class MetricsDataLoaderScheduler {
    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('AppConfigurationRepository')
        private readonly appConfigurationRepository: AppConfigurationRepository,
        @Inject('BitbucketGateway')
        private readonly bitbucketGateway: BitbucketGateway,
    ) {
        this.logger.setContext(MetricsDataLoaderScheduler.name);
        this.dataLoader();
    }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    private handleCron() {
        this.dataLoader();
    }

    private async dataLoader() {
        const appLastUpdateDocument: AppLastUpdateDocument =
            await this.appConfigurationRepository.getLastUpdate();

        if (this.isBitbucketUpdated(appLastUpdateDocument)) {
            return;
        }

        this.runBitbucketDataLoader();
    }

    private isBitbucketUpdated(appLastUpdateDocument: AppLastUpdateDocument) {
        if (!appLastUpdateDocument?.bitbucketLastUpdate) {
            return false;
        }

        const currentTime = new Date();
        const lastUpdate = appLastUpdateDocument.bitbucketLastUpdate;
        const timeDifference = currentTime.getTime() - lastUpdate.getTime();
        const sixHours = 6 * 60 * 60 * 1000; // 6 horas
        // const fifteenMinutes = 15 * 60 * 1000; // 2 minutos

        if (timeDifference > sixHours) {
            return false;
        }

        return true;
    }

    private async runBitbucketDataLoader() {
        // TODO - IMPLEMENTAR CARGA DE DADOS DO BITBUCKET
        // 3 - CRIAR MAPPER PARA DTO RESPONSE - TRANSFORMAR EM ENTIDADE DO SISTEMA E USAR NO RETORNO DO GATEWAY
        // 4 - CRIAR REPOSITORY PARA SALVAR DADOS DOS REPOSITORIOS
        // 5 - CRIAR USECASE PARA ORQUESTRAR A CARGA DE DADOS
        this.logger.log(
            'Carga dos dados do Bitbucket sendo realizada a cada 2 minutos...',
        );
        const projects = await this.bitbucketGateway.getProjects();
        console.log(projects);
        this.appConfigurationRepository.saveLastUpdate(new Date(), null);
    }
}
