import { Commit, CommitBuilder } from "src/domain/entities/commit.entity";
import { CommitDocument } from "src/domain/schemas/commit.schema";

export class BitbucketCommitBranchInfoMapper {
    static toEntity(bitbucketCommitBranchInfo: any, commitDocument: CommitDocument): Commit {
        return new CommitBuilder()
            .withDocumentId(commitDocument.documentId)
            .withProjectId(commitDocument.projectId)
            .withBranchRef(bitbucketCommitBranchInfo?.values?.[0]?.displayId)
            .withJiraHistoryId(commitDocument.jiraHistoryId)
            .withJiraIssueId(commitDocument.jiraIssueId)
            .withJiraIssueType(commitDocument.jiraIssueType)
            .withMessage(commitDocument.message)
            .withDate(commitDocument.date)
            .withAuthorId(commitDocument.authorId)
            .withAuthorName(commitDocument.authorName)
            .withAuthorEmail(commitDocument.authorEmail)
            .withSquadId('')
            .withStatusQueue(commitDocument.statusQueue)
            .build();
    }
}