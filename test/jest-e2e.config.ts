import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./e2e'],
    testMatch: ['/**/*.e2e-spec.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFilesAfterEnv: ['./config/e2e/jest-e2e-setup.ts'],
    globalSetup: './config/e2e/jest-e2e-global-setup.ts',
    globalTeardown: './config/e2e/jest-e2e-global-teardown.ts',
};

export default jestConfig