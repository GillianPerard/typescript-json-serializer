module.exports = {
    coverageReporters: ['text', 'lcov'],
    reporters: ['default', 'jest-junit'],
    roots: ['spec'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
};
