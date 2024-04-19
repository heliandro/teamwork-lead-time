export class AppLastUpdate {

    private documentId: string;
    private bitbucketProjectsLastUpdate: Date;
    private bitbucketCommitsLastUpdate: Date;
    private bambooLastUpdate: Date;
    private jiraLastUpdate: Date;

    private static bitbucketTimeToCheckInMinutes: number = 30;
    private static bambooTimeToCheckInMinutes: number = 30;
    private static jiraTimeToCheckInMinutes: number = 30;

    constructor(documentId: string, bitbucketProjectsLastUpdate: Date, bitbucketCommitsLastUpdate: Date, bambooLastUpdate: Date, jiraLastUpdate: Date) {
        this.documentId = documentId;
        this.bitbucketProjectsLastUpdate = bitbucketProjectsLastUpdate;
        this.bitbucketCommitsLastUpdate = bitbucketCommitsLastUpdate;
        this.bambooLastUpdate = bambooLastUpdate;
        this.jiraLastUpdate = jiraLastUpdate;
    }

    getDocumentId(): string {
        return this.documentId;
    }

    getBitbucketProjectsLastUpdate(): Date {
        return this.bitbucketProjectsLastUpdate;
    }

    getBitbucketCommitsLastUpdate(): Date {
        return this.bitbucketCommitsLastUpdate;
    }

    getBambooLastUpdate(): Date {
        return this.bambooLastUpdate;
    }

    getJiraLastUpdate(): Date {
        return this.jiraLastUpdate;
    }

    isBitbucketProjectsUpdated(): boolean {
        return this._calculateIfLastUpdateIsValid(this.bitbucketProjectsLastUpdate, AppLastUpdate.bitbucketTimeToCheckInMinutes);
    }

    isBitbucketCommitsUpdated(): boolean {
        return this._calculateIfLastUpdateIsValid(this.bitbucketCommitsLastUpdate, AppLastUpdate.bitbucketTimeToCheckInMinutes);
    }

    isBambooUpdated(): boolean {
        return this._calculateIfLastUpdateIsValid(this.bambooLastUpdate, AppLastUpdate.bambooTimeToCheckInMinutes);
    }

    isJiraUpdated(): boolean {
        return this._calculateIfLastUpdateIsValid(this.jiraLastUpdate, AppLastUpdate.jiraTimeToCheckInMinutes);
    }

    private _calculateIfLastUpdateIsValid(lastUpdate: Date, timeToCheckInMinutes: number): boolean {

        if (!lastUpdate) {
            return false;
        }

        const now = new Date();
        const timeDifference = now.getTime() - lastUpdate.getTime();

        const timeToCheck = timeToCheckInMinutes * 60 * 1000;

        return timeDifference < timeToCheck;
    }
}

export class AppLastUpdateBuilder {

    private documentId: string;
    private bitbucketProjectsLastUpdate: Date;
    private bitbucketCommitsLastUpdate: Date;
    private bambooLastUpdate: Date;
    private jiraLastUpdate: Date;

    constructor() {
        this.documentId = '';
        this.bitbucketProjectsLastUpdate = null;
        this.bitbucketCommitsLastUpdate = null;
        this.bambooLastUpdate = null;
        this.jiraLastUpdate = null;
    }

    withDocumentId(documentId: string): AppLastUpdateBuilder {
        this.documentId = documentId;
        return this;
    }

    withBitbucketProjectsLastUpdate(bitbucketProjectsLastUpdate: Date): AppLastUpdateBuilder {
        this.bitbucketProjectsLastUpdate = bitbucketProjectsLastUpdate;
        return this;
    }

    withBitbucketCommitsLastUpdate(bitbucketCommitsLastUpdate: Date): AppLastUpdateBuilder {
        this.bitbucketCommitsLastUpdate = bitbucketCommitsLastUpdate;
        return this;
    }

    withBambooLastUpdate(bambooLastUpdate: Date): AppLastUpdateBuilder {
        this.bambooLastUpdate = bambooLastUpdate;
        return this;
    }

    withJiraLastUpdate(jiraLastUpdate: Date): AppLastUpdateBuilder {
        this.jiraLastUpdate = jiraLastUpdate;
        return this;
    }

    build(): AppLastUpdate {
        return new AppLastUpdate(this.documentId, this.bitbucketProjectsLastUpdate, this.bitbucketCommitsLastUpdate, this.bambooLastUpdate, this.jiraLastUpdate);
    }
}