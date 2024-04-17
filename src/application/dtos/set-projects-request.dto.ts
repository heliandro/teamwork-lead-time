import { Project } from "src/domain/entities/project.entity";

export class SetProjectsRequestDTO {
    projects: any[];
    
    constructor(projects: any[]) {
        this.projects = projects;
    }
}