import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class ProjectDocument extends Document {
    @Prop()
    slug: string;

    @Prop()
    name: string;

    @Prop()
    projectGroup: string;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectDocument);