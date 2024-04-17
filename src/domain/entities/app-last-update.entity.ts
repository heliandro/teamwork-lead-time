export class AppLastUpdate {

    private documentId: string;
    private bitbucketLastUpdate: Date;
    private bambooLastUpdate: Date;
    private jiraLastUpdate: Date;

    private static timeToCheckInMinutes: number = 5;

    constructor(documentId: string, bitbucketLastUpdate: Date, bambooLastUpdate: Date, jiraLastUpdate: Date) {
        this.documentId = documentId;
        this.bitbucketLastUpdate = bitbucketLastUpdate;
        this.bambooLastUpdate = bambooLastUpdate;
        this.jiraLastUpdate = jiraLastUpdate;
    }

    getDocumentId(): string {
        return this.documentId;
    }

    getBitbucketLastUpdate(): Date {
        return this.bitbucketLastUpdate;
    }

    getBambooLastUpdate(): Date {
        return this.bambooLastUpdate;
    }

    getJiraLastUpdate(): Date {
        return this.jiraLastUpdate;
    }

    isBitbucketUpdated(): boolean {
        return this._calculateIfLastUpdateIsValid(this.bitbucketLastUpdate);
    }

    isBambooUpdated(): boolean {
        return this._calculateIfLastUpdateIsValid(this.bambooLastUpdate);
    }

    isJiraUpdated(): boolean {
        return this._calculateIfLastUpdateIsValid(this.jiraLastUpdate);
    }

    private _calculateIfLastUpdateIsValid(lastUpdate: Date): boolean {

        if (!lastUpdate) {
            return false;
        }

        const now = new Date();
        const timeDifference = now.getTime() - lastUpdate.getTime();

        const timeToCheck = AppLastUpdate.timeToCheckInMinutes * 60 * 1000;

        return timeDifference < timeToCheck;
    }
}

export class AppLastUpdateBuilder {

    private documentId: string;
    private bitbucketLastUpdate: Date;
    private bambooLastUpdate: Date;
    private jiraLastUpdate: Date;

    constructor() {
        this.documentId = '';
        this.bitbucketLastUpdate = null;
        this.bambooLastUpdate = null;
        this.jiraLastUpdate = null;
    }

    withDocumentId(documentId: string): AppLastUpdateBuilder {
        this.documentId = documentId;
        return this;
    }

    withBitbucketLastUpdate(bitbucketLastUpdate: Date): AppLastUpdateBuilder {
        this.bitbucketLastUpdate = bitbucketLastUpdate;
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
        return new AppLastUpdate(this.documentId, this.bitbucketLastUpdate, this.bambooLastUpdate, this.jiraLastUpdate);
    }
}