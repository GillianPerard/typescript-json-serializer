module.exports = {
    coverageReporters: ['text', 'lcov'],
    coveragePathIgnorePatterns: ['examples'],
    reporters: ['default', 'jest-junit'],
    roots: ['spec'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
};
