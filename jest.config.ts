import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.tsx?$': ['esbuild-jest', { sourcemap: true }],
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '\\.(tsx)$',
  ],
  moduleNameMapper: {
    '^@ab/di-container$': '<rootDir>/src/lib/di-container/index',
  },
};

export default config;
