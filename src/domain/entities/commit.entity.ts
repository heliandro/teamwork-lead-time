export class Commit {
    private documentId: string; // commitId
    private projectId: string;
    private branchRef: string;
    private jiraHistoryId: string;
    private jiraIssueId: string;
    private jiraIssueType: string;
    private message: string;
    private date: Date;
    private authorId: string; // slug => key
    private authorName: string; // displayName
    private authorEmail: string; // email
    private squadId: string;
    private statusQueue: string;
    
    constructor(
        documentId: string,
        projectId: string,
        branchRef: string,
        jiraHistoryId: string,
        jiraIssueId: string,
        jiraIssueType: string,
        message: string,
        date: Date,
        authorId: string,
        authorName: string,
        authorEmail: string,
        squadId: string,
        statusQueue: string
    ) {
        this.documentId = documentId;
        this.projectId = projectId;
        this.branchRef = branchRef;
        this.jiraHistoryId = jiraHistoryId;
        this.jiraIssueId = jiraIssueId;
        this.jiraIssueType = jiraIssueType;
        this.message = message;
        this.date = date;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.squadId = squadId;
        this.statusQueue = statusQueue;
    }

    getDocumentId(): string {
        return this.documentId;
    }

    getProjectId(): string {
        return this.projectId;
    }

    getBranchRef(): string {
        return this.branchRef;
    }

    getJiraHistoryId(): string {
        return this.jiraHistoryId;
    }

    getJiraIssueId(): string {
        return this.jiraIssueId;
    }

    getJiraIssueType(): string {
        return this.jiraIssueType;
    }

    getMessage(): string {
        return this.message;
    }

    getDate(): Date {
        return this.date;
    }

    getAuthorId(): string {
        return this.authorId;
    }

    getAuthorName(): string {
        return this.authorName;
    }

    getAuthorEmail(): string {
        return this.authorEmail;
    }

    getSquadId(): string {
        return this.squadId;
    }

    getStatusQueue(): string {
        return this.statusQueue;
    }
}

export class CommitBuilder {
    private documentId: string;
    private projectId: string;
    private branchRef: string;
    private jiraHistoryId: string;
    private jiraIssueId: string;
    private jiraIssueType: string;
    private message: string;
    private date: Date;
    private authorId: string;
    private authorName: string;
    private authorEmail: string;
    private squadId: string;
    private statusQueue: string;

    withDocumentId(documentId: string): CommitBuilder {
        this.documentId = documentId;
        return this;
    }

    withProjectId(projectId: string): CommitBuilder {
        this.projectId = projectId;
        return this;
    }

    withBranchRef(branchRef: string): CommitBuilder {
        this.branchRef = branchRef;
        return this;
    }

    withJiraHistoryId(jiraHistory: string): CommitBuilder {
        this.jiraHistoryId = jiraHistory;
        return this;
    }

    withJiraIssueId(jiraIssueId: string): CommitBuilder {
        this.jiraIssueId = jiraIssueId;
        return this;
    }

    withJiraIssueType(jiraIssueType: string): CommitBuilder {
        this.jiraIssueType = jiraIssueType;
        return this;
    }

    withMessage(message: string): CommitBuilder {
        this.message = message;
        return this;
    }

    withDate(date: Date): CommitBuilder {
        this.date = date;
        return this;
    }

    withAuthorId(authorId: string): CommitBuilder {
        this.authorId = authorId;
        return this;
    }

    withAuthorName(authorName: string): CommitBuilder {
        this.authorName = authorName;
        return this;
    }

    withAuthorEmail(authorEmail: string): CommitBuilder {
        this.authorEmail = authorEmail;
        return this;
    }

    withSquadId(squadId: string): CommitBuilder {
        this.squadId = squadId;
        return this;
    }

    withStatusQueue(statusQueue: string): CommitBuilder {
        this.statusQueue = statusQueue;
        return this;
    }

    build(): Commit {
        return new Commit(
            this.documentId,
            this.projectId,
            this.branchRef,
            this.jiraHistoryId,
            this.jiraIssueId,
            this.jiraIssueType,
            this.message,
            this.date,
            this.authorId,
            this.authorName,
            this.authorEmail,
            this.squadId,
            this.statusQueue
        );
    }
}