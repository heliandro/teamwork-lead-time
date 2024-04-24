import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export const SquadDocumentId = 'your_squad_id';

interface Member {
    id?: string;
    name?: string;
    email?: string;
}

@Schema()
export class SquadDocument extends Document {

    @Prop({ unique: true, default: SquadDocumentId })
    documentId: string;

    @Prop()
    name: string;

    @Prop()
    members?: Member[];

    @Prop()
    linkedProjects: { name: string }[];
}

export const SquadSchema = SchemaFactory.createForClass(SquadDocument);