import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

    async getSquad(squadId: string): Promise<SquadDocument> {
        return this.squadModel.findOne({ documentId: squadId }).exec();
    }
}
