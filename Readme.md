# Test Automation Project

This project contains automated tests using Playwright and Cucumber.js.

## Prerequisites

Before running the tests, make sure you have the following installed:
- Node.js (latest LTS version)
- npm (comes with Node.js)
- Cucumber (latest version)

## Installation

1. Install project dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Install Cucumber 
 ```bash
   npm install @cucumber/cucumber@latest 
   npm install --save-dev multiple-cucumber-html-reporter  
   
```

4. Running Tests in Different Environments:

   You can run tests in different environments by setting the TEST_ENV variable:

   ```bash
   # Basic syntax:
   $env:TEST_ENV="<environment_name>"  # Set environment
   npm run test                        # Run all tests
   npm run test:tag "<tag_name>"       # Run specific tagged tests

   # Run tests with environment in one line:
   $env:TEST_ENV="<environment_name>"; npm run test:tag "<tag_name>"

   # Run default test
   npm run test

   # Examples for different environments
   $env:TEST_ENV="preprod"; npm run test
   $env:TEST_ENV="staging"; npm run test:tag "tag_name"
   ```
   
   ```     
## Running Tests

## To clean 
  npm run clean
  
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

3. Run parallel tests:
 $env:TEST_ENV="ENV Name"; npx cucumber-js --tags "@smoke or @regression" --parallel 4
## Additional Commands

- To generate test report:
```bash
npm run report
```

## After completing all code, evaluate the LLM performance:

```bash
node llm-judge/simpleJudge.js
```
