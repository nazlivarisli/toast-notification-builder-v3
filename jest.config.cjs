module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|js)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(nanoid)/)',
  ],
  moduleFileExtensions: ['vue', 'ts', 'js'],
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}