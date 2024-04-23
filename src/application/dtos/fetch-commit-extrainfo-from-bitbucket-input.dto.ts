import { IsNotEmpty, IsString } from "class-validator";

export class FetchCommitExtraInfoFromBitbucketInputDTO {
    
    @IsString({ message: 'projectId must be a string' })
    @IsNotEmpty({ message: 'projectId is required' })
    projectId: string;

    @IsString({ message: 'commitId must be a string' })
    @IsNotEmpty({ message: 'commitId is required' })
    commitId: string;

    @IsString({ message: 'jiraIssueId must be a string' })
    @IsNotEmpty({ message: 'jiraIssueId is required' })
    jiraIssueId: string;
}