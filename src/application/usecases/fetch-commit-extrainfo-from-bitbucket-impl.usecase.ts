import { Inject } from "@nestjs/common";
import { CommitRepository } from "src/infrastructure/repositories/commit.repository";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { FetchCommitExtraInfoFromBitbucketInputDTO } from "../dtos/fetch-commit-extrainfo-from-bitbucket-input.dto";
import { BitbucketGateway } from "../gateways/bitbucket.gateway";
import { JiraGateway } from "../gateways/jira.gateway";
import { FetchCommitExtraInfoFromBitbucketUseCase } from "./interfaces/fetch-commit-extrainfo-from-bitbucket.usecase";
import { Commit } from "src/domain/entities/commit.entity";
import { BitbucketCommitBranchInfoMapper } from "../mappers/bitbucket-commit-branch-info.mapper";
import { BitbucketCommitJiraInfoMapper } from "../mappers/bitbucket-commit-jira-info.mapper";
import { CommitDocument } from "src/domain/schemas/commit.schema";
import { FetchCommitExtraInfoFromBitbucketOutputDTO } from "../dtos/fetch-commit-extrainfo-from-bitbucket-output.dto";

export class FetchCommitExtraInfoFromBitbucketImplUseCase implements FetchCommitExtraInfoFromBitbucketUseCase {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('BitbucketGateway') private readonly bitbucketGateway: BitbucketGateway,
        @Inject('CommitRepository') private readonly commitRepository: CommitRepository,
        @Inject('JiraGateway') private readonly jiraGateway: JiraGateway,
    ) {
        this.logger.setContext(FetchCommitExtraInfoFromBitbucketImplUseCase.name);
    }

    public async execute(input: FetchCommitExtraInfoFromBitbucketInputDTO): Promise<FetchCommitExtraInfoFromBitbucketOutputDTO> {
        this.logger.log(`recuperando informações extras do commit ${input.commitId}...`);

        try {
            const commitDocument = await this._getCommitFromDatabase(input.commitId);
            let updatedCommit = await this._getCommitBranchInfoFromBitbucket(commitDocument);
            updatedCommit = await this._getCommitExtraInfoFromJira(updatedCommit);
            await this.commitRepository.save(updatedCommit);
            this.logger.log(`commit ${input.commitId} atualizado com sucesso`);
        } catch (error) {
            this.logger.error(`commit ${input.commitId} apresentou erro ao atualizar informações extras: ${error?.message}`);
            return new FetchCommitExtraInfoFromBitbucketOutputDTO(true);
        }
    }

    private async _getCommitFromDatabase(commitId: string): Promise<CommitDocument> {
        const commitDocument = await this.commitRepository.getById(commitId);

        if (!commitDocument?.documentId) {
            throw new Error(`commit ${commitId} não encontrado no database`);
        }

        return commitDocument;
    }

    private async _getCommitBranchInfoFromBitbucket(commitDocument: CommitDocument): Promise<Commit> {
        const commitBranch = await this.bitbucketGateway.fetchCommitBranchInfo(commitDocument.documentId, commitDocument.projectId);

        if (!commitBranch) {
            throw new Error(`informações de branch no bitbucket não encontradas`);
        }

        return BitbucketCommitBranchInfoMapper.toEntity(commitBranch, commitDocument);
    }

    private async _getCommitExtraInfoFromJira(updatedCommit: Commit): Promise<Commit> {
        const jiraIssue = await this.jiraGateway.fetchIssue(updatedCommit.getJiraIssueId());

        if (!jiraIssue.key) {
            throw new Error(`informações do jira ${updatedCommit.getJiraIssueId()} não encontradas`);
        }

        return BitbucketCommitJiraInfoMapper.toEntity(jiraIssue, updatedCommit);
    }
}