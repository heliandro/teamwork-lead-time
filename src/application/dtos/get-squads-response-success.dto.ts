import { Squad } from "src/domain/entities/squad.entity";
import SquadDocumentsMapper from "../mappers/squad-documents.mapper";
import { SquadDocument } from "src/domain/schemas/squad.schema";

export class GetSquadsResponseSuccessDTO {
    values: Squad[];
    size: number;

    constructor(squadDocuments: SquadDocument[]) {
        this.values = SquadDocumentsMapper.toSquads(squadDocuments);
        this.size = this.values.length;
    }
}