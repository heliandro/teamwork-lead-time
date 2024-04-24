import { CalculateLeadTimeInputDTO } from "src/application/dtos/calculate-lead-time-input.dto";
import { CalculateLeadTimeOutputDTO } from "src/application/dtos/calculate-lead-time-output.dto";

export interface CalculateLeadTimeUseCase {
    execute(input: CalculateLeadTimeInputDTO): Promise<CalculateLeadTimeOutputDTO>;
}