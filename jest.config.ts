module.exports = {
  rootDir: './', 
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coverageReporters: ['lcov', 'text-summary'],
  modulePathIgnorePatterns: ['<rootDir>/dist/']
};
