import { AppLastUpdate, AppLastUpdateBuilder } from "src/domain/entities/app-last-update.entity";
import { AppLastUpdateDocument } from "src/domain/schemas/app-lastupdate.schema";

export class AppLastUpdateDocumentMapper {
    static toAppLastUpdate(appLastUpdateDocument: AppLastUpdateDocument): AppLastUpdate {

        if (!appLastUpdateDocument) {
            return null;
        }

        return new AppLastUpdateBuilder()
            .withDocumentId(appLastUpdateDocument.documentId)
            .withBitbucketLastUpdate(appLastUpdateDocument?.bitbucketLastUpdate || null)
            .withBambooLastUpdate(appLastUpdateDocument?.bambooLastUpdate || null)
            .withJiraLastUpdate(appLastUpdateDocument?.jiraLastUpdate || null)
            .build();
    }
}