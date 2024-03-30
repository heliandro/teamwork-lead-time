import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { loadConfig } from '../../../src/app.module';

// Execute after GlobalSetup and Before all tests
beforeAll(async () => {
    const app = await Test.createTestingModule({
        imports: [ConfigModule.forRoot(loadConfig())],
    }).compile();

    const configService = app.get(ConfigService);
    console.log(
        `-- ENVIRONMENT: ${configService.get<string>('ENVIRONMENT')?.toLocaleUpperCase()}`,
    );
});