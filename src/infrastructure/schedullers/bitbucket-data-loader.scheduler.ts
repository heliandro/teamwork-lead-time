import { Injectable, Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";

@Injectable()
export class BitbucketDataLoaderScheduler {
    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(BitbucketDataLoaderScheduler.name);
        this.dataLoader()
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    private handleCron() {
        this.dataLoader();
    }

    private dataLoader() {
        // TODO - LOAD DE CARGA DO BITBUCKET
        // 1 - CRIAR REPOSITORY PARA VERIFICAR COLLECTION DOC MONGODB PARA VERIFICAR ULTIMO UPDATE
        // 2 - CRIAR GATEWAY PARA PEGAR OS REPOSITORIOS DO BITBUCKET
        // 3 - CRIAR MAPPER PARA DTO RESPONSE - TRANSFORMAR EM ENTIDADE DO SISTEMA E USAR NO RETORNO DO GATEWAY
        // 4 - CRIAR REPOSITORY PARA SALVAR DADOS DOS REPOSITORIOS
        this.logger.log(
            'Carga dos dados do Bitbucket sendo realizada a cada 2 minutos...',
        );
    }
}
