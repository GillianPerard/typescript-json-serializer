module.exports = {
    coverageReporters: ['text', 'lcov'],
    coveragePathIgnorePatterns: ['examples', '/node_modules/'],
    coverageProvider: 'v8',
    reporters: ['default', 'jest-junit'],
    roots: ['spec'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
};
