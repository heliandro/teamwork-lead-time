import { Commit, CommitBuilder } from "src/domain/entities/commit.entity";

export class BitbucketCommitJiraInfoMapper {
    static toEntity(bitbucketCommitJiraInfo: any, commit: Commit): Commit {
        return new CommitBuilder()
            .withDocumentId(commit.getDocumentId())
            .withProjectId(commit.getProjectId())
            .withBranchRef(commit.getBranchRef())
            .withJiraHistoryId(BitbucketCommitJiraInfoMapper._getJiraHistoryId(bitbucketCommitJiraInfo))
            .withJiraIssueId(commit.getJiraIssueId())
            .withJiraIssueType(BitbucketCommitJiraInfoMapper._getJiraIssueType(bitbucketCommitJiraInfo))
            .withMessage(commit.getMessage())
            .withDate(commit.getDate())
            .withAuthorId(commit.getAuthorId())
            .withAuthorName(commit.getAuthorName())
            .withAuthorEmail(commit.getAuthorEmail())
            .withSquadId(BitbucketCommitJiraInfoMapper._getSquadId(bitbucketCommitJiraInfo))
            .withStatusQueue('Finalizado')
            .build();
    }

    private static _getJiraIssueType(bitbucketCommitJiraInfo: any): string {
        const name = bitbucketCommitJiraInfo?.fields?.issuetype?.name;
        const isNameContainsHistory = name?.toLowerCase()?.includes('hist');
        const isIssueSubtask = bitbucketCommitJiraInfo?.fields?.issuetype?.subtask;

        if (isNameContainsHistory || !isIssueSubtask) {
            return 'historia';
        }
        return 'subtarefa';
    }

    private static _getJiraHistoryId(bitbucketCommitJiraInfo: any): string {
        const parentId = bitbucketCommitJiraInfo?.fields?.parent?.key
        const isParentContainsHistory = bitbucketCommitJiraInfo?.fields?.parent?.fields?.issuetype?.name?.toLowerCase()?.includes('hist');
        const isParentSubtask = bitbucketCommitJiraInfo?.fields?.parent?.fields?.issuetype?.subtask;

        if (parentId && isParentContainsHistory && !isParentSubtask && BitbucketCommitJiraInfoMapper._getJiraIssueType(bitbucketCommitJiraInfo) === 'subtarefa') {
            return parentId;
        } 
        
        return bitbucketCommitJiraInfo.key;
    }

    private static _getSquadId(bitbucketCommitJiraInfo: any): string {
        try {
            const squadName = bitbucketCommitJiraInfo?.fields?.customfield_10401?.name;
            const normalizedSquadName = squadName?.toLowerCase()?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '');
            return normalizedSquadName ? normalizedSquadName : '';
        } catch (error) {
            return '';
        }
    }
}