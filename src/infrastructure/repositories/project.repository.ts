import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project } from "src/domain/entities/project.entity";
import { ProjectDocument } from "src/domain/schemas/project.schema";

@Injectable()
export class ProjectRepository {
    
    constructor(
        @InjectModel('projects')
        private readonly projectModel: Model<ProjectDocument>
    ) {}

    async getAll(): Promise<ProjectDocument[]> {
        return this.projectModel.find().exec();
    }

    async getProjectById(projectId: string): Promise<ProjectDocument> {
        return this.projectModel.findOne({ documentId: projectId }).exec();
    }

    async save(project: Project): Promise<ProjectDocument> {
        let existingProject = await this.getProjectById(project.getDocumentId());

        if (existingProject) {
            existingProject.set(project);
            return existingProject.save();
        }

        const newProject = new this.projectModel(project);
        return newProject.save();
    }

    async saveAll(projects: Project[]): Promise<ProjectDocument[]> {
        return await this.projectModel.insertMany(projects);
    }

    async deleteAll(): Promise<void> {
        await this.projectModel.deleteMany({}).exec();
    }
}