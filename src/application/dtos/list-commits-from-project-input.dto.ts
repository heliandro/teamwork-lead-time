import { IsNotEmpty, IsString } from "class-validator";

export class ListCommitsFromProjectInputDTO {
    
    @IsNotEmpty({ message: 'projectId is required' })
    @IsString({ message: 'projectId must be a string' })
    projectId: string;
}