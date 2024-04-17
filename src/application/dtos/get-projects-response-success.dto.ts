import { Project } from "src/domain/entities/project.entity";

export class GetProjectsResponseSuccessDTO {

    values: Project[];
    size: number;

    constructor(projects: Project[]) {
        this.values = projects;
        this.size = projects.length;
    }
}