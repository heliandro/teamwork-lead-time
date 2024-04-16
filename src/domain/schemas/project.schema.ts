import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class ProjectDocument extends Document {
    @Prop()
    documentId: string;

    @Prop()
    name: string;

    @Prop()
    group: string;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectDocument);