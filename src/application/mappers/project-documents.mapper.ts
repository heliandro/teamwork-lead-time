import { ProjectBuilder } from "src/domain/entities/project.entity";

export default class ProjectDocumentsMapper {
    static toProjects(projectDocuments) {

        if (!projectDocuments.length) {
            return [];
        }
        
        let response = projectDocuments.map((projectDocument) => {
            return new ProjectBuilder()
                .withDocumentId(projectDocument.documentId)
                .withName(projectDocument.name)
                .withGroup(projectDocument.group)
                .build();
        });
        
        return response;
    }
}