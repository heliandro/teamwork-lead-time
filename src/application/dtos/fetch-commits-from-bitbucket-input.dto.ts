import { IsNotEmpty, IsString } from "class-validator";

export class FetchCommitsFromBitbucketInputDTO {
    
    @IsString({ message: 'projectId must be a string' })
    @IsNotEmpty({ message: 'projectId is required' })
    projectId: string;
}