import dotenv from 'dotenv';
import pkg from 'multiple-cucumber-html-reporter';
import fs from 'fs';
const { generate } = pkg;
dotenv.config();

// Ensure reports directory exists
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
}

// Check if there were any failures in the cucumber-report.json
let hasFailures = false;
let hasSkippedOrPending = false;
try {
    const reportPath = 'reports/cucumber-report.json';
    if (fs.existsSync(reportPath)) {
        const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        // Check for failures, skipped, or pending steps
        if (Array.isArray(reportData)) {
            for (const feature of reportData) {
                if (feature.elements) {
                    for (const element of feature.elements) {
                        if (element.steps) {
                            for (const step of element.steps) {
                                if (step.result) {
                                    if (step.result.status === 'failed') {
                                        hasFailures = true;
                                    } else if (step.result.status === 'skipped' || step.result.status === 'pending') {
                                        hasSkippedOrPending = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} catch (error) {
    console.error('Error checking for failures in report:', error);
}

// Get current date and time
const currentDate = new Date();
const dateTimeString = currentDate.toLocaleString();

// Add status to build name
const statusIndicator = hasFailures || hasSkippedOrPending ? '❌ FAILED' : '✅ PASSED';

try {
    generate({
        jsonDir: 'reports',
        reportPath: 'test-reports', // Changed from 'reports/html' to 'test-reports'
        displayDuration: true,
        hideMetadata: false,
        buildName: `${process.env.BUILD_NAME || 'Test Run'}:- ${process.env.TEST_ENV || 'prod'} [${statusIndicator}]`,
        metadata: {
            browser: {
                name: process.env.BROWSER_NAME || 'Chrome',
                version: process.env.BROWSER_VERSION || 'latest'
            },
            device: process.env.EXECUTION_MODE || 'Local test machine',
            platform: {
                name: process.env.PLATFORM_NAME || 'Windows',
                version: '11'
            }
        },
        customData: {
            title: 'Execution Info',
            data: [
                { label: 'Build', value: `${process.env.BUILD_NAME || 'N/A'} :- ${process.env.TEST_ENV || 'prod'}` },
                { label: 'Execution Mode', value: process.env.EXECUTION_MODE || 'Local' },
                { label: 'Execution Date & Time', value: dateTimeString },
                { label: 'Status', value: hasFailures || hasSkippedOrPending ? 'FAILED' : 'PASSED' }
            ]
        }
    });
    console.log('Cucumber HTML report generated successfully');
    
    // Set exit code based on test results
    if (hasFailures || hasSkippedOrPending) {
        console.log('\x1b[31m%s\x1b[0m', '⚠️ Tests failed or had skipped/pending steps. Setting exit code to 1.');
        process.exitCode = 1;
    } else {
        console.log('\x1b[32m%s\x1b[0m', '✅ All tests passed successfully!');
    }
} catch (error) {
    console.error('Error generating Cucumber HTML report:', error);
    // Ensure the process exits with an error code
    process.exitCode = 1;
}