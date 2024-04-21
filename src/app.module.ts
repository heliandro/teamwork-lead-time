import { Module } from '@nestjs/common';
import { AppController } from './infrastructure/controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig } from './config/configuration';
import HealthImplUseCase from './application/usecases/health-impl.usecase';
import { UtilsModule } from './utils/utils.module';
import { MetricsDataLoaderScheduler } from './infrastructure/schedullers/metrics-data-loader.scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './domain/schemas/project.schema';
import { AppUpdateConfigSchema } from './domain/schemas/app-update-config.schema';
import { AppConfigurationRepository } from './infrastructure/repositories/app-configuration.repository';
import { HttpModule } from '@nestjs/axios';
import { BitbucketImplGateway } from './infrastructure/gateways/bitbucket-impl.gateway';
import { SquadRepository } from './infrastructure/repositories/squad.repository';
import GetSquadsImplUseCase from './application/usecases/get-squads-impl.usecase';
import { SquadSchema } from './domain/schemas/squad.schema';
import { GetAppUpdateConfigImplUseCase } from './application/usecases/get-app-update-config-impl.usecase';
import { DataLoaderBitbucketProjectsImplUseCase } from './application/usecases/data-loader-bitbucket-projects-impl.usecase';
import { SetAppUpdateConfigImplUseCase } from './application/usecases/set-app-update-config-impl.usecase';
import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { SetProjectsImplUseCase } from './application/usecases/set-projects-impl.usecase';
import { GetProjectsImplUseCase } from './application/usecases/get-projects-impl.usecase';
import { DataLoaderBitbucketCommitsImplUseCase } from './application/usecases/data-loader-bitbucket-commits-impl.usecase';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CommitConsumerQueue } from './infrastructure/queue/bitbucket-commits-consumer.queue';

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
        MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
        MongooseModule.forFeature([
            { name: 'projects', schema: ProjectSchema },
            { name: 'app_configurations', schema: AppUpdateConfigSchema },
            { name: 'squads', schema: SquadSchema }
        ]),
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'bitbucket_commits_exchange',
                    type: 'topic',
                },
                {
                    name: 'dead_letter_bitbucket_commits_exchange',
                    type: 'topic',
                }
            ],
            uri: process.env.RABBITMQ_CONNECTION_STRING,
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: true }
        }),
        UtilsModule,
        HttpModule,
    ],
    controllers: [AppController],
    providers: [
        MetricsDataLoaderScheduler,
        CommitConsumerQueue,
        { provide: 'HealthUseCase', useClass: HealthImplUseCase },
        {
            provide: 'AppConfigurationRepository',
            useClass: AppConfigurationRepository,
        },
        {
            provide: 'GetAppLastUpdateUseCase',
            useClass: GetAppUpdateConfigImplUseCase,
        },
        {
            provide: 'SetAppLastUpdateUseCase',
            useClass: SetAppUpdateConfigImplUseCase,
        },
        {
            provide: 'BitbucketGateway',
            useClass: BitbucketImplGateway,
        },
        {
            provide: 'DataLoaderBitbucketProjectsUseCase',
            useClass: DataLoaderBitbucketProjectsImplUseCase,
        },
        {
            provide: 'SquadRepository',
            useClass: SquadRepository
        },
        {
            provide: 'GetSquadsUseCase',
            useClass: GetSquadsImplUseCase
        },
        {
            provide: 'ProjectRepository',
            useClass: ProjectRepository
        },
        {
            provide: 'SetProjectsUseCase',
            useClass: SetProjectsImplUseCase
        },
        {
            provide: 'GetProjectsUseCase',
            useClass: GetProjectsImplUseCase
        },
        {
            provide: 'DataLoaderBitbucketCommitsUseCase',
            useClass: DataLoaderBitbucketCommitsImplUseCase
        },
    ],
})
export class AppModule {}
