module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/reportWebVitals.js",
    "!src/setupTests.js"
  ],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.css$": "<rootDir>/styleMock.js",
    "\\.scss$": "identity-obj-proxy",
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "\\.stories\\.jsx?$",
    "/src/stories/",
    "/src/utils/"
  ],
  moduleDirectories: [
    "node_modules",
    "src"
  ],
};