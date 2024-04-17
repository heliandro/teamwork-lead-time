import { Inject } from "@nestjs/common";
import { GetAppLastUpdateUseCase } from "./interfaces/get-app-last-update.usecase";
import { AppConfigurationRepository } from "src/infrastructure/repositories/app-configuration.repository";
import { GetAppLastUpdateResponseSuccessDTO } from "../dtos/get-app-last-update-response-success.dto";
import { AppLastUpdateDocument, AppLastUpdateDocumentId } from "src/domain/schemas/app-lastupdate.schema";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";

export class GetAppLastUpdateImplUseCase implements GetAppLastUpdateUseCase {
    
    constructor(
        @Inject('AppConfigurationRepository')
        readonly appConfigurationRepository: AppConfigurationRepository,
        @Inject('ConsoleLogger')
        readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(GetAppLastUpdateImplUseCase.name);
    }

    async execute(): Promise<GetAppLastUpdateResponseSuccessDTO> {
        this.logger.log('iniciando a busca do documento de configuração da aplicação para listar as informações de última atualização...');
        const lastUpdateDocument: AppLastUpdateDocument = await this.appConfigurationRepository.getAppLastUpdateById(AppLastUpdateDocumentId);
        this.logger.log('o documento de configuração da aplicação foi recuperado com sucesso!');
        
        return new GetAppLastUpdateResponseSuccessDTO(lastUpdateDocument);
    }
}