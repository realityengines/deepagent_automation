import reporter from 'cucumber-html-reporter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine environment
const isLambda = process.env.EXECUTION_MODE === 'lambda';
console.log('Current execution mode:', process.env.EXECUTION_MODE);

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: !isLambda,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': isLambda ? 'Lambda' : 'Local',
    'Browser': process.env.BROWSER_TYPE || 'Chromium',
    'Headless Mode': isLambda ? 'Yes' : 'No',
    'Execution Mode': process.env.EXECUTION_MODE || 'local'
  }
};

try {
  reporter.generate(options);
  console.log('Report generated successfully');
} catch (err) {
  console.error('Error generating report:', err);
}

// Remove duplicate call
// reporter.generate(options);