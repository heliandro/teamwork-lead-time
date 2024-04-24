import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class LeadTimeQueryInputDTO {

    @IsDateString()
    @IsNotEmpty({ message: 'startDate is required' })
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}