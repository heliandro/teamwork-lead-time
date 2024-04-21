import { Project } from "src/domain/entities/project.entity";

export class RegisterProjectsInputDTO {
    projects: any[];
    
    constructor(projects: any[]) {
        this.projects = projects;
    }
}