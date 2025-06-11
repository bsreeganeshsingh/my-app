module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/reportWebVitals.js",
    "!src/setupTests.js"
  ],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom"
};