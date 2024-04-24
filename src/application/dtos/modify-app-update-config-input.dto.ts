export class ModifyAppUpdateConfigInputDTO {

    documentId: string;
    bitbucketProjectsLastUpdate?: Date;
    bitbucketCommitsLastUpdate?: Date;
    bitbucketCommitsExtraInfoLastUpdate?: Date;
    bambooLastUpdate?: Date;
    jiraLastUpdate?: Date;

    constructor(documentId: string, bitbucketProjectsLastUpdate: Date, bitbucketCommitsLastUpdate: Date, bitbucketCommitsExtraInfoLastUpdate: Date, bambooLastUpdate: Date, jiraLastUpdate: Date) {
        this.documentId = documentId;
        this.bitbucketProjectsLastUpdate = bitbucketProjectsLastUpdate;
        this.bitbucketCommitsLastUpdate = bitbucketCommitsLastUpdate;
        this.bitbucketCommitsExtraInfoLastUpdate = bitbucketCommitsExtraInfoLastUpdate;
        this.bambooLastUpdate = bambooLastUpdate;
        this.jiraLastUpdate = jiraLastUpdate;
    }
}