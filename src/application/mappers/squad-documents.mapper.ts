import { Squad, SquadBuilder } from "src/domain/entities/squad.entity";
import { SquadDocument } from "src/domain/schemas/squad.schema";

export default class SquadDocumentsMapper {
    static toEntities(squadDocuments: SquadDocument[]): Squad[] {

        if (!squadDocuments.length) {
            return [];
        }

        let response: Squad[] = squadDocuments.map((squadDocument: SquadDocument) => {
            return new SquadBuilder()
                .withDocumentId(squadDocument.documentId)
                .withName(squadDocument.name)
                .withMembers(squadDocument.members)
                .withLinkedProjects(squadDocument.linkedProjects)
                .build()
        });

        return response;
    }
}