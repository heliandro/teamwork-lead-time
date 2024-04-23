import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Squad } from "src/domain/entities/squad.entity";
import { SquadDocument } from "src/domain/schemas/squad.schema";

@Injectable()
export class SquadRepository {
    
    constructor(
        @InjectModel('squads')
        private readonly squadModel: Model<SquadDocument>
    ) {}

    async getAll(): Promise<SquadDocument[]> {
        return this.squadModel.find().exec();
    }

    async getSquadById(squadId: string): Promise<SquadDocument> {
        return this.squadModel.findOne({ documentId: squadId }).exec();
    }

    async save(squad: Squad): Promise<SquadDocument> {
        const existingSquad = await this.getSquadById(squad.getDocumentId());

        if (existingSquad) {
            existingSquad.set(squad);
            return existingSquad.save();
        }

        const newSquad = new this.squadModel(squad);
        return newSquad.save();
    }
}
