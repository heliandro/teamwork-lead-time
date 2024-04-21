import { Inject, Injectable } from "@nestjs/common";
import { GetAllSquadsOutputSuccessDTO } from "../dtos/get-all-squads-output-success.dto";
import GetAllSquadsUseCase from "./interfaces/get-all-squads.usecase";
import { SquadRepository } from "src/infrastructure/repositories/squad.repository";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";

@Injectable()
export default class GetAllSquadsImplUseCase implements GetAllSquadsUseCase {
    constructor(
        @Inject('SquadRepository')
        private readonly squadRepository: SquadRepository,
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(GetAllSquadsImplUseCase.name);
    }

    async execute(): Promise<GetAllSquadsOutputSuccessDTO> {
        this.logger.log('iniciando busca de squads no database...');
        
        const squadsDocuments = await this.squadRepository.getAll();
        const response = new GetAllSquadsOutputSuccessDTO(squadsDocuments);

        if (!response.size) {
            this.logger.warn('não foram encontradas squads no database');
            return response;
        }

        this.logger.log(`${response.size} squads encontradas no database`);
        return response;
    }
}