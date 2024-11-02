/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',                  // Use ts-jest preset for TypeScript support
  testEnvironment: 'node',             // Use Node environment for backend tests
  transform: {
    '^.+\\.tsx?$': 'ts-jest',          // Use ts-jest for TypeScript files
  },
  moduleFileExtensions: ['ts', 'js'],  // Allow Jest to resolve .ts and .js files
};
