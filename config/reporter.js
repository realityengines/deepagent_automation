import reporter from 'cucumber-html-reporter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dirname } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Determine environment
const isLambda = process.env.EXECUTION_MODE === 'lambda';
console.log('Current execution mode:', process.env.EXECUTION_MODE);

// Ensure reports directory exists
const reportsDir = path.join(dirname(__dirname), 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

const options = {
    theme: 'bootstrap',
    jsonFile: path.join(reportsDir, 'cucumber-report.json'),
    output: path.join(reportsDir, 'cucumber-report.html'),
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: !isLambda,
    metadata: {
        'App Version': '1.0.0',
        'Test Environment': process.env.TEST_ENV || 'local',
        'Browser': process.env.BROWSER_TYPE || 'Chromium',
        'Headless Mode': isLambda ? 'Yes' : 'No',
        'Execution Mode': process.env.EXECUTION_MODE || 'local'
    }
};

function generateTestSummary(jsonData) {
    const summary = {
        passed: 0,
        failed: 0,
        skipped: 0,
        undefined: 0,
        retries: 0,
        total: 0,
        duration: 0,
        failedScenarios: []
    };

    jsonData.forEach(feature => {
        feature.elements.forEach(scenario => {
            if (scenario.type === 'scenario') {
                summary.total++;
                let scenarioStatus = 'passed';
                let retryCount = 0;

                scenario.steps.forEach(step => {
                    const status = step.result.status;
                    if (status === 'failed') {
                        scenarioStatus = 'failed';
                        summary.failedScenarios.push({
                            feature: feature.name,
                            scenario: scenario.name,
                            error: step.result.error_message,
                            location: `${feature.uri}:${scenario.line}`
                        });
                    } else if (status === 'undefined') {
                        scenarioStatus = 'undefined';
                    } else if (status === 'skipped' && scenarioStatus === 'passed') {
                        scenarioStatus = 'skipped';
                    }

                    // Add duration
                    if (step.result.duration) {
                        summary.duration += step.result.duration;
                    }
                });

                // Count retries if available in the metadata
                if (scenario.retries) {
                    retryCount = scenario.retries;
                }

                summary[scenarioStatus]++;
                summary.retries += retryCount;
            }
        });
    });

    // Convert duration to seconds
    summary.duration = Math.round(summary.duration / 1000000000);
    return summary;
}

function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}

function generateSummaryReport(summary) {
    return `
🧪 Test Results Summary
═══════════════════════
Status         Count
───────────────────────
✅ Passed:     ${summary.passed}
❌ Failed:     ${summary.failed}
⚠️ Skipped:    ${summary.skipped}
❓ Undefined:  ${summary.undefined}
🔄 Retries:    ${summary.retries}
───────────────────────
🏁 Total:      ${summary.total}
⏱️ Duration:    ${formatDuration(summary.duration)}

${summary.failed > 0 ? `
❌ Failed Scenarios:
═══════════════════
${summary.failedScenarios.map(failure => `
🔍 Feature:  ${failure.feature}
   Scenario: ${failure.scenario}
   Location: ${failure.location}
   Error: ${failure.error}
`).join('\n')}` : ''}
`;
}

try {
    // Read the JSON report
    const jsonReport = JSON.parse(fs.readFileSync(options.jsonFile, 'utf8'));
    
    // Generate summary
    const summary = generateTestSummary(jsonReport);
    
    // Save detailed summary to JSON
    const summaryPath = path.join(reportsDir, 'test-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    // Generate and save text summary
    const textSummary = generateSummaryReport(summary);
    const textSummaryPath = path.join(reportsDir, 'test-summary.txt');
    fs.writeFileSync(textSummaryPath, textSummary);
    
    // Print summary to console
    console.log(textSummary);
    
    // Generate HTML report
    reporter.generate(options);
    
    console.log(`
Reports generated successfully:
- HTML Report: ${options.output}
- JSON Summary: ${summaryPath}
- Text Summary: ${textSummaryPath}
`);
} catch (err) {
    console.error('Error generating reports:', err);
    process.exit(1);
}