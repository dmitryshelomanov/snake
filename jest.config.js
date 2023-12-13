export default {
  moduleFileExtensions: ['js', 'ts', 'json', 'tsx'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  clearMocks: true,
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    config: '<rootDir>/__mocks__/config.js',
  },
}
