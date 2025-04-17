# Test Automation Project

This project contains automated tests using Playwright and Cucumber.js.

## Prerequisites

Before running the tests, make sure you have the following installed:
- Node.js (latest LTS version)
- npm (comes with Node.js)

## Installation

1. Install project dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run All Tests
To run all test scenarios:
```bash
npm run test
```

### Run Tests by Tag
You can run specific test scenarios using tags in two ways:

1. Using npm script:
```bash
npm run test:tag "@your-tag"
npm run test:tag "@DeepAgent"
```

2. Using Cucumber directly:
```bash
npx cucumber-js --tags "@your-tag"
```

Example:
```bash
npm run test:tag "@smoke"
```

## Additional Commands

- To generate test report:
```bash
npm run report
```

For more information about the project and its features, please refer to the documentation.