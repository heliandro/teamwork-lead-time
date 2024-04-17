import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export const SquadDocumentId = 'your_squad_id';
@Schema()
export class SquadDocument extends Document {

    @Prop({ unique: true, default: SquadDocumentId })
    documentId: string;

    @Prop()
    name: string;

    @Prop()
    members: string[];

    @Prop()
    linkedProjects: string[];
}

export const SquadSchema = SchemaFactory.createForClass(SquadDocument);