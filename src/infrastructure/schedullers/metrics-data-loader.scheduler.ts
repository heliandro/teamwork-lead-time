import { Injectable, Inject, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';
import { AppConfigurationRepository } from '../repositories/app-configuration.repository';
import { AppLastUpdateDocument } from 'src/domain/schemas/app-lastupdate.schema';
import { BitbucketGateway } from '../gateways/bitbucket-impl.gateway';
import GetSquadsUseCase from 'src/application/usecases/interfaces/get-squads.usecase';
import { GetSquadsResponseSuccessDTO } from 'src/application/dtos/get-squads-response-success.dto';

@Injectable()
export class MetricsDataLoaderScheduler {
    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('AppConfigurationRepository')
        private readonly appConfigurationRepository: AppConfigurationRepository,
        @Inject('BitbucketGateway')
        private readonly bitbucketGateway: BitbucketGateway,
        @Inject('GetSquadsUseCase')
        private readonly getSquadsUseCase: GetSquadsUseCase,
    ) {
        this.logger.setContext(MetricsDataLoaderScheduler.name);
        this.dataLoader();
    }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    private handleCron() {
        this.dataLoader();
    }

    private async dataLoader() {
        try {
            const appConfiguration = await this.appConfigurationRepository.getDocument();
            this._validateBitbucketIsUpdated(appConfiguration);
            this.runBitbucketDataLoader();
        } catch (error) {
            this.logger.error(`${error.message} - carga de dados cancelada!`);
        }
    }

    private async runBitbucketDataLoader() {
        // TODO - OUTRO ESCOPO - CONFIGURACAO DA APLICACAO
        // [x] 1 - DADOS DE CONFIGURACAO DA APLICACAO - REPOSITORY
        // [ ] 2 - DADOS DE CONFIGURACAO DA APLICACAO - USECASE - ORQUESTRAR

        // TODO - OUTRO ESCOPO - CADASTRO DE SQUADS - CONSULTA
        // [x] 1 - CADASTRO DE TODAS AS SQUADS NO MONGODB AO INICIAR
        // [x] 2 - SQUADS DO MONGO - USECASE - ORQUESTRAR
        // [x] 3 - SQUADS DO MONGO - REPOSITORY


        // TODO - IMPLEMENTAR CARGA DE DADOS
        // [ ] 1 - BITBUCKET PROJECTS - USECASE - ORQUESTRAR
        // [x] 2 - BITBUCKET PROJECTS - GATEWAY
        // [ ] 3 - BITBUCKET PROJECTS - DTOS
        // [ ] 4 - BITBUCKET PROJECTS - CRIAR MAPPER PARA DTO RESPONSE
        // [ ] 5 - BITBUCKET PROJECTS - REPOSITORY - SALVAR E RECUPERAR DADOS

        // [ ] 6 - BITBUCKET COMMITS - USECASE - ORQUESTRAR - AGRUPAR OS COMMITS POR HISTORIA
        // [ ] 7 - BITBUCKET COMMITS - GATEWAY
        // [ ] 8 - BITBUCKET COMMITS - DTOS
        // [ ] 9 - BITBUCKET COMMITS - CRIAR MAPPER PARA DTO RESPONSE
        // [ ] 10 - BITBUCKET COMMITS - REPOSITORY - SALVAR E RECUPERAR DADOS


        // TODO - OUTRO ESCOPO - ENDPOINT -> ENTRADA: data-inicio, data-fim do range, filtro para 1..n squads
        // [ ] 1 - LEAD TIME DAS SQUADS - USECASE - ORQUESTRAR -- USAR OS USECASES ANTERIORES + LOGICA
        // [ ] 2 - LEAD TIME DAS SQUADS - GATEWAY
        // [ ] 3 - LEAD TIME DAS SQUADS - DTOS
        // [ ] 4 - LEAD TIME DAS SQUADS - CRIAR MAPPER PARA DTO RESPONSE
        // [ ] 5 - LEAD TIME DAS SQUADS - REPOSITORY - SALVAR RELATORIO

        this.logger.log('carga dos dados de métricas iniciada!');

        const squads = await this.getSquadsUseCase.execute();
        this._validateSquadsData(squads);


        // const projects = await this.bitbucketGateway.getProjects();
        // console.log(projects);
        // this.appConfigurationRepository.saveLastUpdate(new Date(), null);
    }

    private _validateBitbucketIsUpdated(appLastUpdateDocument: AppLastUpdateDocument) {
        this.logger.log('validando data de última atualização do bitbucket...');

        if (!appLastUpdateDocument?.bitbucketLastUpdate) {
            throw new Error('não há data de última atualização do bitbucket no documento de app-configuration');
        }

        const timeToCheckInMinutes = 5;
        let isValid = this._isLastUpdateValid(appLastUpdateDocument.bitbucketLastUpdate, timeToCheckInMinutes);

        if (!isValid) {
            this.logger.log('Os dados do bitbucket estão desatualizados - continuando carga de dados...');
            return;
        }

        throw new Error('os dados do bitbucket estão atualizados');
    }

    private _isLastUpdateValid(lastUpdate: Date, minutes: number = 5) {
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - lastUpdate.getTime();
        let timeToCheck = minutes * 60 * 1000;

        if (timeDifference > timeToCheck) {
            return false;
        }

        return true;
    }

    private _validateSquadsData(data: GetSquadsResponseSuccessDTO) {
        if (!data.size) {
            this.logger.warn('não há squads cadastradas no banco de dados - finalizando carga de dados');
            return;
        }
    }

}
