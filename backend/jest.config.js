/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    collectCoverage: true,
    coverageThreshold: {
        global: {
            lines: 70,
        },
    },
    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ['./src/**/*.(t|j)s', './src/**/**/*.(t|j)s', './src/*.(t|j)s'],
    coveragePathIgnorePatterns: ['/node_modules/', 'src/auth/__test__/'],
};
