import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, SortOrder } from "mongoose";
import { Commit } from "src/domain/entities/commit.entity";
import { CommitDocument } from "src/domain/schemas/commit.schema";

@Injectable()
export class CommitRepository {

    constructor(
        @InjectModel('commits')
        private readonly commitModel: Model<CommitDocument>
    ) {}

    async getAll(): Promise<CommitDocument[]> {
        return this.commitModel.find().exec();
    }

    async getAllByFields(fields: any): Promise<CommitDocument[]> {
        return this.commitModel.find({ ...fields }).exec();
    }

    async getAllByFieldsAndSortedByDate(fields: any, isDescending: boolean = true): Promise<CommitDocument[]> {
        const result: SortOrder = isDescending ? 'descending' : 'ascending';
        const newFields = {
            ...fields,
            date: fields.date? { $gte: fields.date } : undefined
        }
        return this.commitModel.find({ ...newFields }).sort({ date: result }).exec();
    }

    async getById(commitId: string): Promise<CommitDocument> {
        return this.commitModel.findOne({ documentId: commitId }).exec();
    }

    async save(commit: Commit): Promise<CommitDocument> {
        let existingCommit = await this.getById(commit.getDocumentId());

        if (existingCommit) {
            existingCommit.set(commit);
            return existingCommit.save();
        }

        const newCommit = new this.commitModel(commit);
        return newCommit.save();
    }

    async saveAll(commits: Commit[]): Promise<CommitDocument[]> {
        return await this.commitModel.insertMany(commits);
    }

    async deleteAll(): Promise<void> {
        await this.commitModel.deleteMany({}).exec();
    }
}