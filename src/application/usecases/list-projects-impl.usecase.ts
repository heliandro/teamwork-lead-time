import { Inject, Injectable } from "@nestjs/common";
import { ListProjectsUseCase } from "./interfaces/list-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { ProjectRepository } from "src/infrastructure/repositories/project.repository";
import { ListProjectsInputDTO } from "../dtos/list-projects-input.dto";
import { ListProjectsOutputSuccessDTO } from "../dtos/list-projects-output-success.dto";
import { ProjectDocument } from "src/domain/schemas/project.schema";

@Injectable()
export class ListProjectsImplUseCase implements ListProjectsUseCase {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('ProjectRepository')
        private readonly projectsRepository: ProjectRepository,
    ) {
        this.logger.setContext(ListProjectsImplUseCase.name);
    }
        
    async execute(input?: ListProjectsInputDTO): Promise<ListProjectsOutputSuccessDTO> {
        this.logger.log('iniciando busca dos projetos...');
        if (this.shouldSearchProjectsByIds(input)) {
            return this.searchProjectsByIds(input);
        }
        return this.searchAllProjects();
    }

    private shouldSearchProjectsByIds(input: ListProjectsInputDTO): boolean {
        return input?.projectIds?.length > 0;
    }

    private async searchProjectsByIds(input: ListProjectsInputDTO): Promise<ListProjectsOutputSuccessDTO> {
        this.logger.log(`recuperando projetos pela lista de ids...`);
        let projectsMap: Map<string, ProjectDocument> = new Map<string, ProjectDocument>();

        for (const projectId of input.projectIds) {
            const result: ProjectDocument = await this.projectsRepository.getProjectById(projectId);
            if (result?.documentId) {
                projectsMap.set(result.documentId, result);
            }
        }

        this.logger.log(`${projectsMap.size} projetos recuperados com sucesso!`);
        return new ListProjectsOutputSuccessDTO(this.iterableMapToArray(projectsMap));
    }

    private async searchAllProjects(): Promise<ListProjectsOutputSuccessDTO> {
        let projects = await this.projectsRepository.getAll();
        let projectsMap: Map<string, ProjectDocument> = new Map(projects.map((project) => [project.documentId, project]));
        this.logger.log(`${projectsMap.size} projetos recuperados com sucesso!`);
        return new ListProjectsOutputSuccessDTO(this.iterableMapToArray(projectsMap));
    }

    private iterableMapToArray(projects: Map<string, ProjectDocument>): ProjectDocument[] {
        return Array.from(projects.values());
    }
}