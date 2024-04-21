import { Project } from "src/domain/entities/project.entity";
import { ProjectDocument } from "src/domain/schemas/project.schema";
import ProjectDocumentsMapper from "../mappers/project-documents.mapper";

export class ListProjectsOutputSuccessDTO {

    values: Project[];
    size: number;

    constructor(projects: ProjectDocument[]) {
        this.values = ProjectDocumentsMapper.toEntities(projects);
        this.size = projects.length;
    }
}