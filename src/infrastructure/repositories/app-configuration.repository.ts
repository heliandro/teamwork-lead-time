import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLastUpdateDocument, AppLastUpdateDocumentId } from 'src/domain/schemas/app-lastupdate.schema';

@Injectable()
export class AppConfigurationRepository {
    constructor(
        @InjectModel('app-configurations')
        private readonly appLastUpdateModel: Model<AppLastUpdateDocument>,
    ) {}

    async saveLastUpdate(
        bitbucketLastUpdate: Date,
        bambooLastUpdate: Date,
    ): Promise<AppLastUpdateDocument> {
        const existingConfiguration = await this.getLastUpdate();

        if (existingConfiguration) {
            existingConfiguration.bitbucketLastUpdate = bitbucketLastUpdate;
            existingConfiguration.bambooLastUpdate = bambooLastUpdate;
            return existingConfiguration.save();
        }

        const newConfiguration = new this.appLastUpdateModel({
            bitbucketLastUpdate,
            bambooLastUpdate,
        });
        return newConfiguration.save();
    }

    async getLastUpdate(): Promise<AppLastUpdateDocument> {
        return this.appLastUpdateModel
            .findOne({ documentId: AppLastUpdateDocumentId })
            .exec();
    }
}
