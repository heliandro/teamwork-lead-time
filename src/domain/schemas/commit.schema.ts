import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

export const CommitDocumentId = 'your_commit_id';

@Schema()
export class CommitDocument extends Document {
    @Prop({ unique: true, default: CommitDocumentId })
    documentId: string;

    @Prop()
    projectId: string;

    @Prop()
    branchRef: string;

    @Prop()
    jiraHistoryId: string;

    @Prop()
    jiraIssueId: string;

    @Prop()
    jiraIssueType: string;

    @Prop()
    message: string;

    @Prop()
    date: Date;

    @Prop()
    authorId: string;

    @Prop()
    authorName: string;

    @Prop()
    authorEmail: string;

    @Prop()
    statusQueue: string;
}

export const CommitSchema = SchemaFactory.createForClass(CommitDocument);