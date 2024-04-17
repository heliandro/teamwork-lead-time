export class SetAppLastUpdateRequestDTO {

    documentId: string;
    bitbucketLastUpdate?: Date;
    bambooLastUpdate?: Date;
    jiraLastUpdate?: Date;

    constructor(documentId: string, bitbucketLastUpdate: Date, bambooLastUpdate: Date, jiraLastUpdate: Date) {
        this.documentId = documentId;
        this.bitbucketLastUpdate = bitbucketLastUpdate;
        this.bambooLastUpdate = bambooLastUpdate;
        this.jiraLastUpdate = jiraLastUpdate;
    }
}