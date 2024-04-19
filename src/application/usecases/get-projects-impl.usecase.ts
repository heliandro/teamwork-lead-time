import { Inject, Injectable } from "@nestjs/common";
import { GetProjectsUseCase } from "./interfaces/get-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { ProjectRepository } from "src/infrastructure/repositories/project.repository";
import { GetProjectsRequestDTO } from "../dtos/get-projects-request.dto";
import { GetProjectsResponseSuccessDTO } from "../dtos/get-projects-response-success.dto";
import { ProjectDocument } from "src/domain/schemas/project.schema";
import { Project } from "src/domain/entities/project.entity";

@Injectable()
export class GetProjectsImplUseCase implements GetProjectsUseCase {

    listaRepetidos: any[] = [];

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
        if (this.shouldSearchProjectsByIds(input)) {
            return this.searchProjectsByIds(input);
        }
        return this.searchAllProjects();
    }

    private shouldSearchProjectsByIds(input: GetProjectsRequestDTO): boolean {
        return input?.projectIds?.length > 0;
    }

    private async searchProjectsByIds(input: GetProjectsRequestDTO): Promise<GetProjectsResponseSuccessDTO> {
        this.logger.log(`recuperando projetos pela lista de ids...`);
        let projectsMap: Map<string, ProjectDocument> = new Map<string, ProjectDocument>();

        for (const projectId of input.projectIds) {
            const result: ProjectDocument = await this.projectsRepository.getProjectById(projectId);
            if (result?.documentId) {
                projectsMap.set(result.documentId, result);
            }
        }

        this.logger.log(`${projectsMap.size} projetos recuperados com sucesso!`);
        return new GetProjectsResponseSuccessDTO(this.iterableMapToArray(projectsMap));
    }

    private async searchAllProjects(): Promise<GetProjectsResponseSuccessDTO> {
        let projects = await this.projectsRepository.getAll();
        let projectsMap: Map<string, ProjectDocument> = new Map(projects.map((project) => [project.documentId, project]));
        this.logger.log(`${projectsMap.size} projetos recuperados com sucesso!`);
        return new GetProjectsResponseSuccessDTO(this.iterableMapToArray(projectsMap));
    }

    private iterableMapToArray(projects: Map<string, ProjectDocument>): ProjectDocument[] {
        return Array.from(projects.values());
    }
}