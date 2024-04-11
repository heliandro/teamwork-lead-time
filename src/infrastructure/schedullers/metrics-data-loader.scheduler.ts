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
        // TODO - IMPLEMENTAR CARGA DE DADOS
        // [ ] 1 - BITBUCKET PROJECTS - USECASE - ORQUESTRAR
        // [x] 2 - BITBUCKET PROJECTS - GATEWAY
        // [ ] 3 - BITBUCKET PROJECTS - DTOS
        // [ ] 4 - BITBUCKET PROJECTS - CRIAR MAPPER PARA DTO RESPONSE
        // [ ] 5 - BITBUCKET PROJECTS - REPOSITORY - SALVAR E RECUPERAR DADOS

        // [ ] 6 - BITBUCKET COMMITS - USECASE - ORQUESTRAR
        // [ ] 7 - BITBUCKET COMMITS - GATEWAY
        // [ ] 8 - BITBUCKET COMMITS - DTOS
        // [ ] 9 - BITBUCKET COMMITS - CRIAR MAPPER PARA DTO RESPONSE
        // [ ] 10 - BITBUCKET COMMITS - REPOSITORY - SALVAR E RECUPERAR DADOS

        // TODO - OUTRO ESCOPO - CADASTRO DE SQUADS - CONSULTA
        // [x] 1 - CADASTRO DE TODAS AS SQUADS NO MONGODB AO INICIAR
        // [ ] 2 - SQUADS DO MONGO - USECASE - ORQUESTRAR
        // [ ] 3 - SQUADS DO MONGO - REPOSITORY

        // TODO - OUTRO ESCOPO - ENDPOINT -> ENTRADA: data-inicio, data-fim do range, filtro para 1..n squads
        // [ ] 1 - LEAD TIME DAS SQUADS - USECASE - ORQUESTRAR -- USAR OS USECASES ANTERIORES + LOGICA
        // [ ] 2 - LEAD TIME DAS SQUADS - GATEWAY
        // [ ] 3 - LEAD TIME DAS SQUADS - DTOS
        // [ ] 4 - LEAD TIME DAS SQUADS - CRIAR MAPPER PARA DTO RESPONSE
        // [ ] 5 - LEAD TIME DAS SQUADS - REPOSITORY - SALVAR RELATORIO

        this.logger.log(
            'Carga dos dados do Bitbucket sendo realizada a cada 2 minutos...',
        );
        const projects = await this.bitbucketGateway.getProjects();
        console.log(projects);
        this.appConfigurationRepository.saveLastUpdate(new Date(), null);
    }
}
