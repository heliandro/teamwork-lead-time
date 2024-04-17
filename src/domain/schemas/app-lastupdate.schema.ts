import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const AppLastUpdateDocumentId = 'last_update';

@Schema()
export class AppLastUpdateDocument extends Document {
    @Prop({ unique: true, default: AppLastUpdateDocumentId })
    documentId: string;

    @Prop()
    bitbucketLastUpdate: Date;

    @Prop()
    bambooLastUpdate: Date;

    @Prop()
    jiraLastUpdate: Date;
    lastUpdate: string;
}

export const AppLastUpdateSchema = SchemaFactory.createForClass(
    AppLastUpdateDocument,
);
