import { Module } from '@nestjs/common';
import { AppController } from './infrastructure/controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig } from './config/configuration';
import HealthImplUseCase from './application/usecases/health-impl.usecase';
import { UtilsModule } from './utils/utils.module';

function loadEnvFilesByNodeEnv(): string[] {
    switch (process.env.NODE_ENV) {
        case 'production':
            return ['.env'];
        case 'staging':
            return ['.env.staging'];
        case 'test':
            return ['.env.test.local'];
        default:
            return ['.env.development.local'];
    }
}

export function loadConfig(): any {
    return {
        isGlobal: true,
        envFilePath: [...loadEnvFilesByNodeEnv()],
        load: [applicationConfig],
    };
}

@Module({
    imports: [
        ConfigModule.forRoot(loadConfig()),
        UtilsModule,
    ],
    controllers: [AppController],
    providers: [{ provide: 'HealthUseCase', useClass: HealthImplUseCase }],
})
export class AppModule {}
