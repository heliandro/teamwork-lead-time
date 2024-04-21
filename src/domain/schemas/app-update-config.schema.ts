import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const AppUpdateConfigDocumentId = 'app_update_config';

@Schema()
export class AppUpdateConfigDocument extends Document {
    @Prop({ unique: true, default: AppUpdateConfigDocumentId })
    documentId: string;

    @Prop()
    bitbucketProjectsLastUpdate: Date;

    @Prop()
    bitbucketCommitsLastUpdate: Date;

    @Prop()
    bambooLastUpdate: Date;

    @Prop()
    jiraLastUpdate: Date;
}

export const AppUpdateConfigSchema = SchemaFactory.createForClass(
    AppUpdateConfigDocument,
);
