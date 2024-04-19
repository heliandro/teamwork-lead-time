import { AppLastUpdate } from "src/domain/entities/app-last-update.entity";
import { AppLastUpdateDocument } from "src/domain/schemas/app-lastupdate.schema";
import { AppLastUpdateDocumentMapper } from "../mappers/app-last-update-document.mapper";

export class GetAppLastUpdateResponseSuccessDTO {

    values: {
        document: AppLastUpdate,
        isBitbucketProjectsUpdated: boolean,
        isBitbucketCommitsUpdated: boolean,
        isBambooUpdated: boolean,
        isJiraUpdated: boolean,
    }

    constructor(appLastUpdateDocument: AppLastUpdateDocument) {
        const document = AppLastUpdateDocumentMapper.toAppLastUpdate(appLastUpdateDocument);
        this.values = {
            document,
            isBitbucketProjectsUpdated: document.isBitbucketProjectsUpdated(),
            isBitbucketCommitsUpdated: document.isBitbucketCommitsUpdated(),
            isBambooUpdated: document.isBambooUpdated(),
            isJiraUpdated: document.isJiraUpdated(),
        }
    }
}