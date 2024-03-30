import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: [
        '<rootDir>/test/unit/**/*.spec.ts',
        '<rootDir>/test/integration/**/*.spec.ts',
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/coverage/',
        '/src/i18n/',
        '/src/application/dtos/',
        '/src/application/gateways/',
        '/src/domain/enums/',
        '/src/domain/repositories/',
        '/src/utils/enums/',
    ],
    setupFilesAfterEnv: ['./test/config/jest-setup.ts'],
    globalSetup: './test/config/jest-global-setup.ts',
    globalTeardown: './test/config/jest-global-teardown.ts',
};

export default jestConfig