export class LeadTime {
    private jiraHistoryId: string;
    private firstCommitId: string;
    private firstCommitDate: Date;
    private lastCommitId: string;
    private lastCommitDate: Date;
    private timeInDays: number;

    constructor(jiraHistoryId: string, firstCommitId: string, lastCommitId: string, firstCommitDate: Date, lastCommitDate: Date, timeInDays?: number) {
        this.jiraHistoryId = jiraHistoryId;
        this.firstCommitId = firstCommitId;
        this.firstCommitDate = firstCommitDate;
        this.lastCommitId = lastCommitId;
        this.lastCommitDate = lastCommitDate;
        this.timeInDays = timeInDays;
    }

    public getJiraHistoryId(): string {
        return this.jiraHistoryId;
    }

    public getFirstCommitId(): string {
        return this.firstCommitId;
    }

    public getLastCommitId(): string {
        return this.lastCommitId;
    }

    public getFirstCommitDate(): Date {
        return this.firstCommitDate;
    }

    public getLastCommitDate(): Date {
        return this.lastCommitDate;
    }

    public getTimeInDays(): number {
        this._calculateLeadTimeInDays();
        return this.timeInDays;
    }

    private _calculateLeadTimeInDays(): void {
        const diff = this.lastCommitDate.getTime() - this.firstCommitDate.getTime();
        const diffInTime = diff / (1000 * 60 * 60 * 24) // 1000 ms, 3600 s, 24 h | diffInTime = ms / (ms/s * s/h * h/d) => dias
        this.timeInDays = +diffInTime.toFixed(2);
    }
}

export class LeadTimeBuilder {

    private jiraHistoryId: string;
    private firstCommitId: string;
    private firstCommitDate: Date;
    private lastCommitId: string;
    private lastCommitDate: Date;
    private timeInDays: number;

    public withJiraHistoryId(jiraHistoryId: string): LeadTimeBuilder {
        this.jiraHistoryId = jiraHistoryId;
        return this;
    }

    public withFirstCommitId(firstCommitId: string): LeadTimeBuilder {
        this.firstCommitId = firstCommitId;
        return this;
    }

    public withFirstCommitDate(firstCommitDate: Date): LeadTimeBuilder {
        this.firstCommitDate = firstCommitDate;
        return this;
    }

    public withLastCommitId(lastCommitId: string): LeadTimeBuilder {
        this.lastCommitId = lastCommitId;
        return this;
    }

    public withLastCommitDate(lastCommitDate: Date): LeadTimeBuilder {
        this.lastCommitDate = lastCommitDate;
        return this;
    }

    public withTimeInDays(timeInDays: number): LeadTimeBuilder {
        this.timeInDays = timeInDays;
        return this;
    }

    public build(): LeadTime {
        return new LeadTime(this.jiraHistoryId, this.firstCommitId, this.lastCommitId, this.firstCommitDate, this.lastCommitDate, this.timeInDays);
    }
}