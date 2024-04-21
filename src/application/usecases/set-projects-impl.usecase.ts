import { Inject, Injectable } from "@nestjs/common";
import { SetProjectsUseCase } from "./interfaces/set-projects.usecase";
import { SetProjectsRequestDTO } from "../dtos/set-projects-request.dto";
import { Project } from "src/domain/entities/project.entity";
import { ProjectRepository } from "src/infrastructure/repositories/project.repository";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { BitbucketProjectsMapper } from "../mappers/bitbucket-projects.mapper";
import { SetAppUpdateConfigInputDTO } from "../dtos/set-app-update-config-input.dto";
import { GetAppUpdateConfigOutputSuccessDTO } from "../dtos/get-app-update-config-output-success.dto";

@Injectable()
export class SetProjectsImplUseCase implements SetProjectsUseCase {
    constructor(
        @Inject('ProjectRepository')
        private readonly projectRepository: ProjectRepository,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService
    ) {
        this.logger.setContext(SetProjectsImplUseCase.name);
    }

    async execute(input: SetProjectsRequestDTO): Promise<void> {
        this.logger.log('deletando todos os projetos do database...');
        await this.projectRepository.deleteAll();

        this.logger.log('salvando os projetos atualizados no database...');
        const projects: Project[] = BitbucketProjectsMapper.toProjects(input.projects);
        await this.projectRepository.saveAll(projects);
        
        this.logger.log('projetos salvos com sucesso!');
    }
}