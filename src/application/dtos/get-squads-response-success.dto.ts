import { Squad } from "src/domain/entities/squad.entity";
import GetSquadsMapper from "../mappers/get-squads.mapper";

export class GetSquadsResponseSuccessDTO {
    values: Squad[];
    size: number;

    constructor(squads: Squad[]) {
        this.values = GetSquadsMapper.toGetSquadsResponseDTO(squads);
        this.size = this.values.length;
    }
}