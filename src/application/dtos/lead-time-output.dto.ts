import { SquadLeadTime } from "src/domain/entities/squad-lead-time.entity";
import { CalculateLeadTimeOutputDTO } from "./calculate-lead-time-output.dto";

export class LeadTimeOutputDTO {
    public readonly values: SquadLeadTime[];
    public readonly size: number;
    public readonly startDate: string;
    public readonly endDate: string;

    constructor(result: CalculateLeadTimeOutputDTO, startDate: string, endDate?: string) {
        this.values = result.values;
        this.size = result.size;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}