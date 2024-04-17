import { Inject, Injectable } from "@nestjs/common";
import { SetAppLastUpdateUseCase } from "./interfaces/set-app-last-update.usecase";
import { AppConfigurationRepository } from '../../infrastructure/repositories/app-configuration.repository';
import { SetAppLastUpdateRequestDTO } from "../dtos/set-app-last-update-request.dto";
import { AppLastUpdateDocument } from "src/domain/schemas/app-lastupdate.schema";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { AppLastUpdateBuilder } from "src/domain/entities/app-last-update.entity";

@Injectable()
export class SetAppLastUpdateImplUseCase implements SetAppLastUpdateUseCase {
    constructor(
        @Inject('AppConfigurationRepository')
        private readonly appConfigurationRepository: AppConfigurationRepository,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService
    ) { 
        this.logger.setContext(SetAppLastUpdateImplUseCase.name);
    }

    async execute(input: SetAppLastUpdateRequestDTO): Promise<void> {
        this.logger.log('salvando as datas de última atualização dos serviços no database...');
        const appLastUpdate = new AppLastUpdateBuilder()
            .withDocumentId(input.documentId)
            .withBitbucketLastUpdate(input.bitbucketLastUpdate)
            .build();

        await this.appConfigurationRepository.save(appLastUpdate);
    }
}