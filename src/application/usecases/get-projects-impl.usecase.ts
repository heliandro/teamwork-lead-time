import { Inject, Injectable } from "@nestjs/common";
import { GetProjectsUseCase } from "./interfaces/get-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { ProjectRepository } from "src/infrastructure/repositories/project.repository";
import { GetProjectsRequestDTO } from "../dtos/get-projects-request.dto";
import { GetProjectsResponseSuccessDTO } from "../dtos/get-projects-response-success.dto";

@Injectable()
export class GetProjectsImplUseCase implements GetProjectsUseCase {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('ProjectRepository')
        private readonly projectsRepository: ProjectRepository,
    ) {
        this.logger.setContext(GetProjectsImplUseCase.name);
    }
        
    async execute(input?: GetProjectsRequestDTO): Promise<GetProjectsResponseSuccessDTO> {
        this.logger.log('iniciando busca dos projetos...');
        let projects = [];

        if (input?.projectIds?.length > 0) {
            this.logger.log(`recuperando projetos pelos ids: ${input.projectIds}...`);
            for (const projectId of input.projectIds) {
                const result = await this.projectsRepository.getProjectById(projectId);
                projects.push(result);
            }
            this.logger.log(`${projects.length} projetos recuperados com sucesso!`);
            return new GetProjectsResponseSuccessDTO(projects);
        }

        projects = await this.projectsRepository.getAll();
        this.logger.log(`${projects.length} projetos recuperados com sucesso!`);
        
        return new GetProjectsResponseSuccessDTO(projects);
    }
}