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
import GetAllSquadsImplUseCase from './application/usecases/get-all-squads-impl.usecase';
import { SquadSchema } from './domain/schemas/squad.schema';
import { GetAppUpdateConfigImplUseCase } from './application/usecases/get-app-update-config-impl.usecase';
import { DataLoaderBitbucketProjectsImplUseCase } from './application/usecases/data-loader-bitbucket-projects-impl.usecase';
import { ModifyAppUpdateConfigImplUseCase } from './application/usecases/modify-app-update-config-impl.usecase';
import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { RegisterProjectsImplUseCase } from './application/usecases/register-projects-impl.usecase';
import { ListProjectsImplUseCase } from './application/usecases/list-projects-impl.usecase';
import { DataLoaderBitbucketCommitsImplUseCase } from './application/usecases/data-loader-bitbucket-commits-impl.usecase';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CommitConsumerQueue } from './infrastructure/queue/bitbucket-commits-consumer.queue';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommitSchema } from './domain/schemas/commit.schema';
import { CommitRepository } from './infrastructure/repositories/commit.repository';
import { DataLoaderBitbucketCommitsExtraInfoImplUseCase } from './application/usecases/data-loader-bitbucket-commits-extrainfo-impl.usecase';
import { ListCommitsFromProjectImplUseCase } from './application/usecases/list-commits-from-project-impl.usecase';
import { JiraImplGateway } from './infrastructure/gateways/jira-impl.gateway';
import { FetchCommitExtraInfoFromBitbucketImplUseCase } from './application/usecases/fetch-commit-extrainfo-from-bitbucket-impl.usecase';
import { FetchCommitsFromBitbucketImplUseCase } from './application/usecases/fetch-commits-from-bitbucket-impl.usecase';
import { LeadTimeController } from './infrastructure/controllers/lead-time.controller';
import { CalculateLeadTimeImplUseCase } from './application/usecases/calculate-lead-time-impl.usecase';

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
            { name: 'app_configurations', schema: AppUpdateConfigSchema },
            { name: 'squads', schema: SquadSchema },
            { name: 'projects', schema: ProjectSchema },
            { name: 'commits', schema: CommitSchema }
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
                },
                {
                    name: 'bitbucket_commit_extrainfo_exchange',
                    type: 'topic',
                }
            ],
            uri: process.env.RABBITMQ_CONNECTION_STRING,
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: true }
        }),
        UtilsModule,
        HttpModule,
        CacheModule.register({
            ttl: 3600,
            max: 2000,
            isGlobal: true,
        }),
    ],
    controllers: [AppController, LeadTimeController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        MetricsDataLoaderScheduler,
        CommitConsumerQueue,
        { provide: 'HealthUseCase', useClass: HealthImplUseCase },
        {
            provide: 'AppConfigurationRepository',
            useClass: AppConfigurationRepository,
        },
        {
            provide: 'GetAppUpdateConfigUseCase',
            useClass: GetAppUpdateConfigImplUseCase,
        },
        {
            provide: 'ModifyAppUpdateConfigUseCase',
            useClass: ModifyAppUpdateConfigImplUseCase,
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
            provide: 'GetAllSquadsUseCase',
            useClass: GetAllSquadsImplUseCase
        },
        {
            provide: 'ProjectRepository',
            useClass: ProjectRepository
        },
        {
            provide: 'RegisterProjectsUseCase',
            useClass: RegisterProjectsImplUseCase
        },
        {
            provide: 'ListProjectsUseCase',
            useClass: ListProjectsImplUseCase
        },
        {
            provide: 'DataLoaderBitbucketCommitsUseCase',
            useClass: DataLoaderBitbucketCommitsImplUseCase
        },
        {
            provide: 'CommitRepository',
            useClass: CommitRepository
        },
        {
            provide: 'DataLoaderBitbucketCommitsExtraInfoUseCase',
            useClass: DataLoaderBitbucketCommitsExtraInfoImplUseCase
        },
        {
            provide: 'ListCommitsFromProjectUseCase',
            useClass: ListCommitsFromProjectImplUseCase
        },
        {
            provide: 'JiraGateway',
            useClass: JiraImplGateway
        },
        {
            provide: 'FetchCommitExtraInfoFromBitbucketUseCase',
            useClass: FetchCommitExtraInfoFromBitbucketImplUseCase
        },
        {
            provide: 'FetchCommitsFromBitbucketUseCase',
            useClass: FetchCommitsFromBitbucketImplUseCase
        },
        {
            provide: 'CalculateLeadTimeUseCase',
            useClass: CalculateLeadTimeImplUseCase
        }
    ],
})
export class AppModule {}
