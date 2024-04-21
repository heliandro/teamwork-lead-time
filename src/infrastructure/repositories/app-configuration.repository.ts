import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppUpdateConfig } from 'src/domain/entities/app-update-config.entity';
import { AppUpdateConfigDocument } from 'src/domain/schemas/app-update-config.schema';

@Injectable()
export class AppConfigurationRepository {
    constructor(
        @InjectModel('app_configurations')
        private readonly appUpdateConfigModel: Model<AppUpdateConfigDocument>,
    ) {}

    async save(
        appUpdateConfig: AppUpdateConfig
    ): Promise<AppUpdateConfigDocument> {
        let existingConfiguration = await this.getAppUpdateConfigById(appUpdateConfig.getDocumentId());

        if (existingConfiguration) {
            // nao quero substituir e sim mesclar
            existingConfiguration.set({ ...existingConfiguration, ...appUpdateConfig });
            return existingConfiguration.save();
        }

        const newConfiguration = new this.appUpdateConfigModel(appUpdateConfig);
        return newConfiguration.save();
    }

    async getAppUpdateConfigById(documentId: string): Promise<AppUpdateConfigDocument> {
        return this.appUpdateConfigModel.findOne({ documentId }).exec();
    }
}
