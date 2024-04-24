import { Inject, Injectable } from "@nestjs/common";
import { ListProjectsUseCase } from "./interfaces/list-projects.usecase";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { ProjectRepository } from "src/infrastructure/repositories/project.repository";
import { ListProjectsInputDTO } from "../dtos/list-projects-input.dto";
import { ListProjectsOutputSuccessDTO } from "../dtos/list-projects-output-success.dto";
import { ProjectDocument } from "src/domain/schemas/project.schema";
import { SquadRepository } from "src/infrastructure/repositories/squad.repository";
import { SquadDocument } from "src/domain/schemas/squad.schema";

@Injectable()
export class ListProjectsImplUseCase implements ListProjectsUseCase {

    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
        @Inject('ProjectRepository')
        private readonly projectsRepository: ProjectRepository,
        @Inject('SquadRepository')
        private readonly squadRepository: SquadRepository,
    ) {
        this.logger.setContext(ListProjectsImplUseCase.name);
    }
        
    async execute(input?: ListProjectsInputDTO): Promise<ListProjectsOutputSuccessDTO> {
        this.logger.log('iniciando busca dos projetos...');
        if (this.shouldSearchProjectsByIds(input)) {
            this.logger.log(`recuperando projetos do database pela lista de ids...`);
            const result = await this.searchProjectsById(input.projectIds);
            this.logger.log(`${result.length} projetos recuperados pela lista de ids com sucesso!`);
            return new ListProjectsOutputSuccessDTO(result);
        }

        if (this.shouldSearchProjectsBySquad(input)) {
            this.logger.log(`recuperando projetos do database pela lista de squads...`);
            const result = await this.searchProjectsBySquad();
            this.logger.log(`${result.length} projetos recuperados pela lista de squads com sucesso!`);
            return new ListProjectsOutputSuccessDTO(result);
        }

        this.logger.log(`recuperando todos os projetos do database...`);
        return await this.searchAllProjects();
    }

    private shouldSearchProjectsByIds(input: ListProjectsInputDTO): boolean {
        return input?.projectIds && input.projectIds.length > 0;
    }

    private shouldSearchProjectsBySquad(input: ListProjectsInputDTO): boolean {
        return input?.fromSquads;
    }

    private async searchProjectsById(projectIds: string[]): Promise<ProjectDocument[]> {
        let projectsMap: Map<string, ProjectDocument> = new Map<string, ProjectDocument>();

        for (const projectId of projectIds) {
            const result: ProjectDocument = await this.projectsRepository.getProjectById(projectId);
            if (result?.documentId) {
                projectsMap.set(result.documentId, result);
            }
        }

        return this.iterableMapToArray(projectsMap);
    }

    private async searchProjectsBySquad(): Promise<ProjectDocument[]> {
        let squads: SquadDocument[] = await this.squadRepository.getAll();
        let projectsMap: Map<string, ProjectDocument> = new Map<string, ProjectDocument>();

        for (const squad of squads) {
            const projectIds = squad.linkedProjects.map((project: any) => project.name);
            const result: ProjectDocument[] = await this.searchProjectsById(projectIds);
            projectsMap = new Map([...projectsMap, ...new Map(result.map((project) => [project.documentId, project]))]);
        }

        return this.iterableMapToArray(projectsMap);
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