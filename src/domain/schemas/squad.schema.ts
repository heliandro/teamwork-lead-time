import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class SquadDocument extends Document {

    @Prop()
    documentId: string;

    @Prop()
    name: string;

    @Prop()
    members: string[];

    @Prop()
    linkedProjects: string[];
}

export const SquadSchema = SchemaFactory.createForClass(SquadDocument);