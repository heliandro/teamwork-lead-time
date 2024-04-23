import { CommitBuilder } from "src/domain/entities/commit.entity";
import { CommitDocument } from "src/domain/schemas/commit.schema";

export class CommitDocumentsMapper {
    static toEntities(commitDocuments: CommitDocument[]) {
        return commitDocuments.map((commit: CommitDocument) => {
            return new CommitBuilder()
                .withDocumentId(commit.documentId)
                .withProjectId(commit.projectId)
                .withBranchRef(commit.branchRef)
                .withJiraHistoryId(commit.jiraHistoryId)
                .withJiraIssueId(commit.jiraIssueId)
                .withJiraIssueType(commit.jiraIssueType)
                .withMessage(commit.message)
                .withDate(commit.date)
                .withAuthorId(commit.authorId)
                .withAuthorName(commit.authorName)
                .withAuthorEmail(commit.authorEmail)
                .withSquadId(commit.squadId)
                .withStatusQueue(commit.statusQueue)
                .build();
        });
    }
}