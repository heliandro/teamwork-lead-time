import { Inject, Injectable } from "@nestjs/common";
import { ModifyAppUpdateConfigUseCase } from "./interfaces/modify-app-update-config.usecase";
import { AppConfigurationRepository } from '../../infrastructure/repositories/app-configuration.repository';
import { ModifyAppUpdateConfigInputDTO } from "../dtos/modify-app-update-config-input.dto";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { AppUpdateConfigBuilder } from "src/domain/entities/app-update-config.entity";

@Injectable()
export class ModifyAppUpdateConfigImplUseCase implements ModifyAppUpdateConfigUseCase {
    constructor(
        @Inject('AppConfigurationRepository')
        private readonly appConfigurationRepository: AppConfigurationRepository,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService
    ) { 
        this.logger.setContext(ModifyAppUpdateConfigImplUseCase.name);
    }

    async execute(input: ModifyAppUpdateConfigInputDTO): Promise<void> {
        this.logger.log('salvando as datas de última atualização dos serviços no database...');
        const appLastUpdate = new AppUpdateConfigBuilder()
            .withDocumentId(input.documentId)
            .withBitbucketProjectsLastUpdate(input.bitbucketProjectsLastUpdate)
            .withBitbucketCommitsLastUpdate(input.bitbucketCommitsLastUpdate)
            .withBambooLastUpdate(input.bambooLastUpdate)
            .withJiraLastUpdate(input.jiraLastUpdate)
            .build();

        const result = await this.appConfigurationRepository.save(appLastUpdate);

        if (!result) {
            throw new Error('ocorreu um erro ao tentar salvar as datas de última atualização dos serviços no database!');
        }
        
        this.logger.log('o documento de configuração da aplicação foi atualizado com sucesso!');
    }
}