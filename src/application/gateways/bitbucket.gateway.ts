export interface BitbucketGateway {
    fetchProjects(ids?: string[]): Promise<any[]>;
    fetchCommits(projectId: string, limit?: number): Promise<any>;
    fetchCommitBranchInfo(commitId: string, projectId: string): Promise<any>;
}