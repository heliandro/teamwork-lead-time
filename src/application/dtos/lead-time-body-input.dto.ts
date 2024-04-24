import { IsArray, IsOptional } from "class-validator";

export class LeadTimeBodyInputDTO {

    @IsOptional({ message: 'squads is optional' })
    @IsArray({ message: 'squads must be an array of strings' })
    squads?: string[];
}