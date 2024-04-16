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

    async getAll(): Promise<Squad[]> {
        let squads = await this.squadModel.find().exec();
        return squads.map(squad => new Squad(squad.documentId, squad.name, squad.members, squad.linkedProjects));
    }

    async getSquad(squadId: string): Promise<Squad> {
        let squadDocument = await this.squadModel.findOne({ documentId: squadId }).exec();
        return new Squad(squadDocument.documentId, squadDocument.name, squadDocument.members, squadDocument.linkedProjects);
    }
}
