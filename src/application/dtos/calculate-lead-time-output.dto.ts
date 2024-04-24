import { SquadLeadTime } from "src/domain/entities/squad-lead-time.entity";

export class CalculateLeadTimeOutputDTO {

    values: SquadLeadTime[];
    size: number;

    constructor(squadsLeadTime: SquadLeadTime[]) {
        this.values = squadsLeadTime;
        this.size = squadsLeadTime.length;
    }
}