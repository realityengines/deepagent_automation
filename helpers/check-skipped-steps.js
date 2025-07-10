import fs from 'fs';

/**
 * This script checks the Cucumber report for any skipped or pending steps
 * and exits with a non-zero code if any are found.
 */

const reportPath = 'reports/cucumber-report.json';

try {
  if (!fs.existsSync(reportPath)) {
    console.error(`Report file not found: ${reportPath}`);
    process.exit(1);
  }

  const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  
  let hasSkippedOrPending = false;
  let skippedSteps = [];
  
  // Check for skipped or pending steps
  if (Array.isArray(reportData)) {
    for (const feature of reportData) {
      if (feature.elements) {
        for (const element of feature.elements) {
          if (element.steps) {
            for (const step of element.steps) {
              if (step.result && (step.result.status === 'skipped' || step.result.status === 'pending')) {
                hasSkippedOrPending = true;
                skippedSteps.push({
                  feature: feature.name,
                  scenario: element.name,
                  step: step.name,
                  status: step.result.status
                });
              }
            }
          }
        }
      }
    }
  }

  if (hasSkippedOrPending) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️ WARNING: Skipped or pending steps found:');
    skippedSteps.forEach((step, index) => {
      console.log(`${index + 1}. Feature: ${step.feature}`);
      console.log(`   Scenario: ${step.scenario}`);
      console.log(`   Step: ${step.name}`);
      console.log(`   Status: ${step.status}`);
      console.log('---');
    });
    console.log('\x1b[31m%s\x1b[0m', '❌ Test run should be considered FAILED due to skipped/pending steps');
    process.exit(1);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ No skipped or pending steps found');
    process.exit(0);
  }
} catch (error) {
  console.error('Error checking for skipped steps:', error);
  process.exit(1);
}