import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export const ProjectDocumentId = 'your_project_id';

@Schema()
export class ProjectDocument extends Document {
    @Prop({ unique: true, default: ProjectDocumentId })
    documentId: string;

    @Prop()
    name: string;

    @Prop()
    group: string;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectDocument);