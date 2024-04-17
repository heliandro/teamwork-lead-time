import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLastUpdateDocument } from 'src/domain/schemas/app-lastupdate.schema';

@Injectable()
export class AppConfigurationRepository {
    constructor(
        @InjectModel('app-configurations')
        private readonly appLastUpdateModel: Model<AppLastUpdateDocument>,
    ) {}

    async save(
        document: any
    ): Promise<AppLastUpdateDocument | any> {
        let existingConfiguration = await this.getDocumentById(document.documentId);

        if (existingConfiguration) {
            existingConfiguration = { ...existingConfiguration, ...document };
            return existingConfiguration.save();
        }

        const newConfiguration = new this.appLastUpdateModel(document);
        return newConfiguration.save();
    }

    async getDocumentById(documentId: string): Promise<AppLastUpdateDocument | any> {
        return this.appLastUpdateModel.findOne({ documentId }).exec();
    }
}
