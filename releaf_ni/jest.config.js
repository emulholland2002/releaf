const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

// config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/tests/utils/singleton.ts'],
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  clearMocks: true,
  preset: 'ts-jest',
}

// createJestConfig is exported to ensure the Next.js config which is async is loaded
module.exports = createJestConfig(customJestConfig)