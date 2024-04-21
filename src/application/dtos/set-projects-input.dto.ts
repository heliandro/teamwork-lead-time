import { Project } from "src/domain/entities/project.entity";

export class SetProjectsInputDTO {
    projects: any[];
    
    constructor(projects: any[]) {
        this.projects = projects;
    }
}