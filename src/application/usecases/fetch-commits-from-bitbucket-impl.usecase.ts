import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { FetchCommitsFromBitbucketUseCase } from "./interfaces/fetch-commits-from-bitbucket.usecase";
import { Inject } from "@nestjs/common";
import { CommitRepository } from "src/infrastructure/repositories/commit.repository";
import { FetchCommitsFromBitbucketInputDTO } from "../dtos/fetch-commits-from-bitbucket-input.dto";
import { BitbucketGateway } from "../gateways/bitbucket.gateway";
import { BitbucketCommitsMapper } from "../mappers/bitbucket-commits.mapper";
import { Nack } from "@golevelup/nestjs-rabbitmq";
import { FetchCommitsFromBitbucketOutputDTO } from "../dtos/fetch-commits-from-bitbucket-output.dto";

export class FetchCommitsFromBitbucketImplUseCase implements FetchCommitsFromBitbucketUseCase {

    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('BitbucketGateway') private readonly bitbucketGateway: BitbucketGateway,
        @Inject('CommitRepository') private readonly commitRepository: CommitRepository,
    ) {
        this.logger.setContext(FetchCommitsFromBitbucketImplUseCase.name);
    }

    public async execute(input: FetchCommitsFromBitbucketInputDTO): Promise<FetchCommitsFromBitbucketOutputDTO> {
        this.logger.log(`recuperando commits do projeto ${input.projectId}...`);

        try {
            const result: any = await this.bitbucketGateway.fetchCommits(input.projectId);

            if (!result?.size || !result?.values?.length) {
                throw new Error('nenhum commit encontrado');
            }

            const commits = BitbucketCommitsMapper.toEntities(result.values, input.projectId, 'Em Processamento');
            await this.commitRepository.saveAll(commits);
        } catch (error) {
            this.logger.error(`erro ao recuperar commits do projeto ${input.projectId}: ${error?.message}`);
            return new FetchCommitsFromBitbucketOutputDTO(true);
        }
    }
}