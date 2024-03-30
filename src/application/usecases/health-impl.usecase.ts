import { Inject, Injectable } from '@nestjs/common';
import { ConsoleLoggerService } from '../../utils/services/console-logger.service';
import HealthUseCase from './interfaces/health.usecase';
import HealthResponseDTO from '../dtos/health-response.dto';

@Injectable()
export default class HealthImplUseCase implements HealthUseCase {
    constructor(
        @Inject('ConsoleLogger')
        private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(HealthImplUseCase.name);
    }

    execute(): HealthResponseDTO {
        const healthStatus = {
            status: 'UP',
            message: 'Service is healthy',
        };
        this.logger.log(JSON.stringify(healthStatus));
        return healthStatus;
    }
}
