import { FetchCommitExtraInfoFromBitbucketInputDTO } from "src/application/dtos/fetch-commit-extrainfo-from-bitbucket-input.dto";
import { FetchCommitExtraInfoFromBitbucketOutputDTO } from "src/application/dtos/fetch-commit-extrainfo-from-bitbucket-output.dto";

export interface FetchCommitExtraInfoFromBitbucketUseCase {
    execute(input: FetchCommitExtraInfoFromBitbucketInputDTO): Promise<FetchCommitExtraInfoFromBitbucketOutputDTO>;
}
