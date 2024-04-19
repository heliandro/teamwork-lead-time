import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const AppLastUpdateDocumentId = 'last_update';

@Schema()
export class AppLastUpdateDocument extends Document {
    @Prop({ unique: true, default: AppLastUpdateDocumentId })
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

export const AppLastUpdateSchema = SchemaFactory.createForClass(
    AppLastUpdateDocument,
);
