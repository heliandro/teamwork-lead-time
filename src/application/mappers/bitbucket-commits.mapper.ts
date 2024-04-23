import { CommitBuilder } from "src/domain/entities/commit.entity";

export class BitbucketCommitsMapper {
    static toEntities(bitbucketCommits: any[], projectId: string, statusQueue?: string) {
        return bitbucketCommits.map((bitbucketCommit: any) => {
            return new CommitBuilder()
                .withDocumentId(bitbucketCommit.id)
                .withProjectId(projectId)
                .withBranchRef('')
                .withJiraHistoryId('')
                .withJiraIssueId(bitbucketCommit?.properties?.["jira-key"]?.[0])
                .withJiraIssueType('')
                .withMessage(bitbucketCommit?.message)
                .withDate(bitbucketCommit?.committerTimestamp ? new Date(bitbucketCommit.committerTimestamp) : null)
                .withAuthorId(bitbucketCommit?.committer?.slug)
                .withAuthorName(bitbucketCommit?.committer?.displayName)
                .withAuthorEmail(bitbucketCommit?.committer?.emailAddress)
                .withSquadId('')
                .withStatusQueue(statusQueue || 'Em Processamento')
                .build();
        });
    }
}