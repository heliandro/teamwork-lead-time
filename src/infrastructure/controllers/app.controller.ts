import { Controller, Get, Inject } from '@nestjs/common';
import HealthUseCase from '../../application/usecases/interfaces/health.usecase';
import HealthOutputDTO from '../../application/dtos/health-output.dto';

@Controller()
export class AppController {
    constructor(
        @Inject('HealthUseCase') private readonly healthUsecase: HealthUseCase,
    ) {}

    @Get('/health')
    getHealth(): HealthOutputDTO {
        return this.healthUsecase.execute();
    }
}
