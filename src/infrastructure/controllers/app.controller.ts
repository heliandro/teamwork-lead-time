import { Controller, Get, Inject } from '@nestjs/common';
import HealthUseCase from '../../application/usecases/interfaces/health.usecase';
import HealthResponseDTO from '../../application/dtos/health-response.dto';

@Controller()
export class AppController {
    constructor(
        @Inject('HealthUseCase') private readonly healthUsecase: HealthUseCase,
    ) {}

    @Get('/health')
    getHealth(): HealthResponseDTO {
        return this.healthUsecase.execute();
    }
}
