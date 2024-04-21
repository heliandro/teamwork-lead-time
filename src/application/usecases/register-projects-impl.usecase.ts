import { Inject, Injectable } from "@nestjs/common";
import { RegisterProjectsUseCase } from "./interfaces/register-projects.usecase";
import { RegisterProjectsInputDTO } from "../dtos/register-projects-input.dto";
import { Project } from "src/domain/entities/project.entity";
import { ProjectRepository } from "src/infrastructure/repositories/project.repository";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { BitbucketProjectsMapper } from "../mappers/bitbucket-projects.mapper";

@Injectable()
export class RegisterProjectsImplUseCase implements RegisterProjectsUseCase {
    constructor(
        @Inject('ProjectRepository')
        private readonly projectRepository: ProjectRepository,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService
    ) {
        this.logger.setContext(RegisterProjectsImplUseCase.name);
    }

    async execute(input: RegisterProjectsInputDTO): Promise<void> {
        this.logger.log('deletando todos os projetos do database...');
        await this.projectRepository.deleteAll();

        this.logger.log('salvando os projetos atualizados no database...');
        const projects: Project[] = BitbucketProjectsMapper.toEntities(input.projects);
        const result = await this.projectRepository.saveAll(projects);

        if (!result) {
            throw new Error('falha ao salvar os projetos no database');
        }
        
        this.logger.log('projetos salvos com sucesso!');
    }
}