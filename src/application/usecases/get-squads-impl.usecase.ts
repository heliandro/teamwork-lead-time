import { Inject, Injectable } from "@nestjs/common";
import { GetSquadsResponseSuccessDTO } from "../dtos/get-squads-response-success.dto";
import GetSquadsUseCase from "./interfaces/get-squads.usecase";
import { SquadRepository } from "src/infrastructure/repositories/squad.repository";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";

@Injectable()
export default class GetSquadsImplUseCase implements GetSquadsUseCase {
    constructor(
        @Inject('SquadRepository')
        private readonly squadRepository: SquadRepository,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(GetSquadsImplUseCase.name);
    }

    async execute(): Promise<GetSquadsResponseSuccessDTO> {
        this.logger.log('iniciando busca de squads no database...');
        
        const squadsDocuments = await this.squadRepository.getAll();
        const response = new GetSquadsResponseSuccessDTO(squadsDocuments);

        if (!response.size) {
            this.logger.warn('não foram encontradas squads no database');
            return response;
        }

        this.logger.log(`${response.size} squads encontradas no database`);
        return response;
    }
}