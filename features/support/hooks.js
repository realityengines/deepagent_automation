import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, BeforeStep, AfterStep } from '@cucumber/cucumber';
import fs from 'fs';
import { cleanupDirectories } from '../../utils/cleanup.js';
// Set default timeout to 50 minutes (30000000 milliseconds) for all steps
setDefaultTimeout(30000000);

// Ensure the reports directory exists
BeforeAll(async function () {
  try {
    cleanupDirectories();
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }
    // Ensure we have write permissions
    fs.accessSync('reports', fs.constants.W_OK);
  } catch (error) {
    console.error('Error creating/accessing reports directory:', error);
    throw error;
  }
});

// Initialize the browser before each scenario
Before(async function (scenario) {
  try {
    await this.init();
    // Initialize conversation URL storage
    this.conversationUrl = null;
    // Store the scenario information for later use
    this.currentScenario = scenario;
    const scenarioName = scenario?.pickle?.name || 'Unknown Scenario';
    this.startTime = Date.now(); // Record start time
    console.log(`Starting scenario: ${scenarioName}`);
  } catch (error) {
    console.error('Error in Before hook:', error);
    throw error;
  }
});

// Log step before execution
BeforeStep(function ({ pickleStep }) {
  // Only log the step text without additional formatting
  console.log(`${pickleStep.text}`);
});

// Log step after execution with detailed error information
AfterStep(function ({ pickleStep, result }) {
  // We'll only log failures here, pass steps silently
  if (result.status !== 'PASSED') {
    console.log(`    × failed`);

    // Display detailed error information if available
    if (result.exception) {
      console.log(`      Error: ${result.exception.message}`);

      // If it's a Playwright error, try to extract more details
      if (result.exception.stack) {
        const stackLines = result.exception.stack.split('\n');

        // Look for locator information in the error message
        if (result.exception.message.includes('locator')) {
          const locatorMatch = result.exception.message.match(/locator\('([^']+)'\)/);
          if (locatorMatch) {
            console.log(`\n      Locator: locator('${locatorMatch[1]}')`);
          }
        }

        // Show expected vs received if available
        if (result.exception.message.includes('Expected:') && result.exception.message.includes('Received:')) {
          const expectedMatch = result.exception.message.match(/Expected: ([^\n]+)/);
          const receivedMatch = result.exception.message.match(/Received: ([^\n]+)/);

          if (expectedMatch) {
            console.log(`      Expected: ${expectedMatch[1]}`);
          }
          if (receivedMatch) {
            console.log(`      Received: ${receivedMatch[1]}`);
          }
        }

        // Show call log if it's a timeout error
        if (result.exception.message.includes('Call log:')) {
          const callLogMatch = result.exception.message.match(/Call log:([\s\S]*)/);
          if (callLogMatch) {
            console.log(`      Call log:`);
            const callLogLines = callLogMatch[1].trim().split('\n');
            callLogLines.forEach(line => {
              if (line.trim()) {
                console.log(`        ${line.trim()}`);
              }
            });
          }
        }

        // Show the location where the error occurred
        const locationLine = stackLines.find(line =>
          line.includes('.js:') && !line.includes('node_modules')
        );
        if (locationLine) {
          console.log(`\n          at ${locationLine.trim()}`);
        }
      }
    }
    console.log(''); // Add empty line for readability
  }
});

// Cleanup after each scenario
After(async function ({ result, pickle }) {
  try {
    // Get scenario name from pickle directly
    const scenarioName = pickle?.name || 'Unknown Scenario';
    const executionTime = Date.now() - this.startTime; // Calculate execution time
    
    // Capture conversation URL if available
    if (this.page) {
      try {
        const url = await this.page.url();
        if (url && (url.includes('conversation') || url.includes('chatllm'))) {
          this.conversationUrl = url;
          console.log(`Captured conversation URL: ${url}`);
        }
      } catch (urlError) {
        console.error('Failed to capture conversation URL:', urlError);
      }
    }
    
    // Handle failed or skipped scenarios
    if (result.status === 'FAILED' || result.status === 'SKIPPED' || result.status === 'PENDING') {
      // If status is SKIPPED or PENDING, force it to be treated as a failure
      if (result.status === 'SKIPPED' || result.status === 'PENDING') {
        console.log(`STEP ${result.status} DETECTED - TREATING AS FAILURE`);
        // Force the test to fail
        result.status = 'FAILED';
      }

      console.log('❌ TEST FAILURE DETECTED');

      // Show detailed error information if available
      if (result.exception) {
        console.log(`\nFAILED: ${scenarioName}`);
        console.log(`Error Details: ${result.exception.message}`);

        // Show stack trace if available (first few lines for context)
        if (result.exception.stack) {
          const stackLines = result.exception.stack.split('\n').slice(0, 5);
          console.log('\nStack trace:');
          stackLines.forEach(line => {
            if (line.trim()) {
              console.log(`  ${line.trim()}`);
            }
          });
        }
      }
      
      // Display conversation URL prominently in console
      if (this.conversationUrl) {
        console.log(`❌ CONVERSATION URL: ${this.conversationUrl}`);
        // Attach URL to the report with enhanced formatting
        await this.attach(`
=== FAILURE DETAILS ===
Conversation URL: ${this.conversationUrl}
Scenario: ${scenarioName}
Status: FAILED
Timestamp: ${new Date().toISOString()}
========================
        `, 'text/plain');
      } else {
        console.log('No conversation URL captured');
        await this.attach(`
=== FAILURE DETAILS ===
Conversation URL: Not Available
Scenario: ${scenarioName}
Status: FAILED
Timestamp: ${new Date().toISOString()}
Note: URL could not be captured
========================
        `, 'text/plain');
      }
      
      // Take screenshot if scenario fails
      if (this.page) {
        try {
          const screenshotPath = `reports/failure-${Date.now()}.png`;
          const screenshot = await this.takeScreenshot(screenshotPath);
          if (screenshot) {
            await this.attach(screenshot, 'image/png');
            console.log(`❌ Screenshot saved: ${screenshotPath}`);
          }
        } catch (screenshotError) {
          console.error('Failed to take failure screenshot:', screenshotError);
        }
      }
      
      // Only color the X symbol in red, keep the rest of the text white
      console.log(`\x1b[31m❌\x1b[0m Scenario failed: ${scenarioName} (${result.status}) - ${executionTime}ms`);
    } else {
      // For successful tests, only color the checkmark in green
      if (this.conversationUrl) {
        await this.attach(`Conversation URL: ${this.conversationUrl}`, 'text/plain');
        // Only the checkmark is green, rest is default color
        console.log(`\x1b[92m✅\x1b[0m Test passed - Conversation URL: ${this.conversationUrl}`);
      }
      // Only the checkmark is green, rest is default color
      console.log(`\x1b[92m✅\x1b[0m Scenario completed: ${scenarioName} (passed) - ${executionTime}ms`);
    }
    
  } catch (error) {
    console.error('Error in After hook:', error);
  } finally {
    await this.cleanup();
  }
});