import 'reflect-metadata';
import { jest } from '@jest/globals';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { loadConfig } from '../../src/app.module';

// Execute after GlobalSetup and Before all tests
beforeAll(async () => {
    const app = await Test.createTestingModule({
        imports: [ConfigModule.forRoot(loadConfig())],
    }).compile();

    const configService = app.get(ConfigService);
    console.log(
        `-- ENVIRONMENT: ${configService.get<string>('ENVIRONMENT')?.toLocaleUpperCase()}`,
    );

    // mocks
    jest.spyOn(console, 'error').mockReturnValue();
});