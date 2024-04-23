import { IsArray, IsBoolean, IsOptional } from "class-validator";

export class ListProjectsInputDTO {

    @IsOptional()
    @IsArray({ message: 'projectIds must be an array of strings' })
    projectIds?: string[];

    @IsOptional()
    @IsBoolean({ message: 'filter fromSquads must be a boolean' })
    fromSquads?: boolean;
}