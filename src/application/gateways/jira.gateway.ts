export interface JiraGateway {
    fetchIssue(issueId: string): Promise<any>;
}