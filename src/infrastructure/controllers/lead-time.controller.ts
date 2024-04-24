import { Body, Controller, Get, Inject, Query, ValidationPipe } from "@nestjs/common";
import { CalculateLeadTimeOutputDTO } from "src/application/dtos/calculate-lead-time-output.dto";
import { LeadTimeBodyInputDTO } from "src/application/dtos/lead-time-body-input.dto";
import { LeadTimeOutputDTO } from "src/application/dtos/lead-time-output.dto";
import { LeadTimeQueryInputDTO } from "src/application/dtos/lead-time-query-input.dto";
import { CalculateLeadTimeUseCase } from "src/application/usecases/interfaces/calculate-lead-time.usecase";

@Controller()
export class LeadTimeController {
    constructor(
        @Inject('CalculateLeadTimeUseCase') private readonly calculateLeadTimeUseCase: CalculateLeadTimeUseCase
    ) {}

    @Get('/lead-time')
    async getLeadTime(
        @Query(new ValidationPipe({ transform: true })) queryParams: LeadTimeQueryInputDTO,
        @Body() body: LeadTimeBodyInputDTO
    ): Promise<LeadTimeOutputDTO> {
        console.log(`queryParams: ${JSON.stringify(queryParams)}`);
        console.log(`body: ${JSON.stringify(body)}`);
        const result: CalculateLeadTimeOutputDTO = await this.calculateLeadTimeUseCase.execute({ ...queryParams, ...body });
        return new LeadTimeOutputDTO(result, queryParams.startDate, queryParams.endDate);
    }
}