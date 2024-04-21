import { AppUpdateConfig, AppUpdateConfigBuilder } from "src/domain/entities/app-update-config.entity";
import { AppUpdateConfigDocument } from "src/domain/schemas/app-update-config.schema";

export class AppUpdateConfigDocumentMapper {
    static toEntity(appUpdateConfigDocument: AppUpdateConfigDocument): AppUpdateConfig {

        if (!appUpdateConfigDocument) {
            return null;
        }

        return new AppUpdateConfigBuilder()
            .withDocumentId(appUpdateConfigDocument.documentId)
            .withBitbucketProjectsLastUpdate(appUpdateConfigDocument?.bitbucketProjectsLastUpdate || null)
            .withBitbucketCommitsLastUpdate(appUpdateConfigDocument?.bitbucketCommitsLastUpdate || null)
            .withBambooLastUpdate(appUpdateConfigDocument?.bambooLastUpdate || null)
            .withJiraLastUpdate(appUpdateConfigDocument?.jiraLastUpdate || null)
            .build();
    }
}