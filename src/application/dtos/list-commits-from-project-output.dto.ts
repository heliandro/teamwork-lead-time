import { Commit } from "src/domain/entities/commit.entity";
import { CommitDocument } from "src/domain/schemas/commit.schema";
import { CommitDocumentsMapper } from "../mappers/commit-documents.mapper";

export class ListCommitsFromProjectOutputDTO {

    values: Commit[];
    size: number;

    constructor(commitDocuments: CommitDocument[]) {
        this.values = CommitDocumentsMapper.toEntities(commitDocuments);
        this.size = this.values.length;
    }
}