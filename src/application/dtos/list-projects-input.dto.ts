import { IsArray, IsOptional } from "class-validator";

export class ListProjectsInputDTO {

    @IsOptional()
    @IsArray({ message: 'projectIds must be an array of strings' })
    projectIds?: string[];

    constructor(projectIds?: string[]) {
        this.projectIds = projectIds;
    }
}