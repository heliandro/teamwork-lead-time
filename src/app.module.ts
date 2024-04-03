import { Module } from '@nestjs/common';
import { AppController } from './infrastructure/controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig } from './config/configuration';
import HealthImplUseCase from './application/usecases/health-impl.usecase';
import { UtilsModule } from './utils/utils.module';
import { BitbucketDataLoaderScheduler } from './infrastructure/schedullers/bitbucket-data-loader.scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './domain/schemas/project.schema';

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
        ScheduleModule.forRoot(),
        MongooseModule.forRoot('mongodb://localhost:27017/leadtime'),
        MongooseModule.forFeature([
            { name: 'projects', schema: ProjectSchema },
        ]),
        UtilsModule,
    ],
    controllers: [AppController],
    providers: [
        { provide: 'HealthUseCase', useClass: HealthImplUseCase },
        BitbucketDataLoaderScheduler,
    ],
})
export class AppModule {}
