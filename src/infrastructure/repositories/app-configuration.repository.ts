import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLastUpdate } from 'src/domain/entities/app-last-update.entity';
import { AppLastUpdateDocument } from 'src/domain/schemas/app-lastupdate.schema';

@Injectable()
export class AppConfigurationRepository {
    constructor(
        @InjectModel('app-configurations')
        private readonly appLastUpdateModel: Model<AppLastUpdateDocument>,
    ) {}

    async save(
        appLastUpdate: AppLastUpdate
    ): Promise<AppLastUpdateDocument> {
        let existingConfiguration = await this.getAppLastUpdateById(appLastUpdate.getDocumentId());

        if (existingConfiguration) {
            existingConfiguration.set(appLastUpdate)
            return existingConfiguration.save();
        }

        const newConfiguration = new this.appLastUpdateModel(appLastUpdate);
        return newConfiguration.save();
    }

    async getAppLastUpdateById(documentId: string): Promise<AppLastUpdateDocument> {
        return this.appLastUpdateModel.findOne({ documentId }).exec();
    }
}
