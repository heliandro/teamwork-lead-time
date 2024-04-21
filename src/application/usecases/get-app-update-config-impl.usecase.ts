import { Inject } from "@nestjs/common";
import { GetAppUpdateConfigUseCase } from "./interfaces/get-app-update-config.usecase";
import { AppConfigurationRepository } from "src/infrastructure/repositories/app-configuration.repository";
import { GetAppUpdateConfigOutputSuccessDTO } from "../dtos/get-app-update-config-output-success.dto";
import { AppUpdateConfigDocument, AppUpdateConfigDocumentId } from "src/domain/schemas/app-update-config.schema";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";

export class GetAppUpdateConfigImplUseCase implements GetAppUpdateConfigUseCase {
    
    constructor(
        @Inject('AppConfigurationRepository')
        readonly appConfigurationRepository: AppConfigurationRepository,
        @Inject('ConsoleLogger')
        readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(GetAppUpdateConfigImplUseCase.name);
    }

    async execute(): Promise<GetAppUpdateConfigOutputSuccessDTO> {
        this.logger.log('iniciando a busca do documento de configuração da aplicação para listar as informações de última atualização...');
        const lastUpdateDocument: AppUpdateConfigDocument = await this.appConfigurationRepository.getAppUpdateConfigById(AppUpdateConfigDocumentId);
        this.logger.log('o documento de configuração da aplicação foi recuperado com sucesso!');
        return new GetAppUpdateConfigOutputSuccessDTO(lastUpdateDocument);
    }
}