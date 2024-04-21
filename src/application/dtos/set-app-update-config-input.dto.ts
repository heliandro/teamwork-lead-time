export class SetAppUpdateConfigInputDTO {

    documentId: string;
    bitbucketProjectsLastUpdate?: Date;
    bitbucketCommitsLastUpdate?: Date;
    bambooLastUpdate?: Date;
    jiraLastUpdate?: Date;

    constructor(documentId: string, bitbucketProjectsLastUpdate: Date, bitbucketCommitsLastUpdate: Date, bambooLastUpdate: Date, jiraLastUpdate: Date) {
        this.documentId = documentId;
        this.bitbucketProjectsLastUpdate = bitbucketProjectsLastUpdate;
        this.bitbucketCommitsLastUpdate = bitbucketCommitsLastUpdate;
        this.bambooLastUpdate = bambooLastUpdate;
        this.jiraLastUpdate = jiraLastUpdate;
    }
}