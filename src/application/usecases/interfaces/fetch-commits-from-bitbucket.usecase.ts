import { FetchCommitsFromBitbucketInputDTO } from "src/application/dtos/fetch-commits-from-bitbucket-input.dto";
import { FetchCommitsFromBitbucketOutputDTO } from "src/application/dtos/fetch-commits-from-bitbucket-output.dto";

export interface FetchCommitsFromBitbucketUseCase {
    execute(input: FetchCommitsFromBitbucketInputDTO): Promise<FetchCommitsFromBitbucketOutputDTO>;
}