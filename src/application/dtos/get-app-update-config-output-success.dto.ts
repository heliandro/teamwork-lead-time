import { AppUpdateConfig } from "src/domain/entities/app-update-config.entity";
import { AppUpdateConfigDocument } from "src/domain/schemas/app-update-config.schema";
import { AppUpdateConfigDocumentMapper } from "../mappers/app-update-config-document.mapper";

export class GetAppUpdateConfigOutputSuccessDTO {

    values: {
        document: AppUpdateConfig,
        isBitbucketProjectsUpdated: boolean,
        isBitbucketCommitsUpdated: boolean,
        isBambooUpdated: boolean,
        isJiraUpdated: boolean,
    }

    constructor(appUpdateConfigDocument: AppUpdateConfigDocument) {
        const document = AppUpdateConfigDocumentMapper.toEntity(appUpdateConfigDocument);
        this.values = {
            document,
            isBitbucketProjectsUpdated: document.isBitbucketProjectsUpdated(),
            isBitbucketCommitsUpdated: document.isBitbucketCommitsUpdated(),
            isBambooUpdated: document.isBambooUpdated(),
            isJiraUpdated: document.isJiraUpdated(),
        }
    }
}