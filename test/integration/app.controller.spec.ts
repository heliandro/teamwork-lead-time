import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/infrastructure/controllers/app.controller';
import HealthImplUseCase from '../../src/application/usecases/health-impl.usecase';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { loadConfig } from '../../src/app.module';

const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    setContext: jest.fn(),
};

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(loadConfig()),
            ],
            controllers: [AppController],
            providers: [
                { provide: 'HealthUseCase', useClass: HealthImplUseCase },
                { provide: 'ConsoleLogger', useValue: mockLogger },
            ],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('getHealth', () => {
        it('Deve retornar o objeto de health check', () => {
            expect(appController.getHealth()).toStrictEqual({
                status: 'UP',
                message: 'Service is healthy',
            });
        });
    });
});
