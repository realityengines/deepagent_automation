import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import fs from 'fs';
import { cleanupDirectories } from '../../utils/cleanup.js';
// Set default timeout to 30 minutes (1800000 milliseconds) for all steps
setDefaultTimeout(1800000);

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
Before(async function () {
  try {
    await this.init();
  } catch (error) {
    console.error('Error in Before hook:', error);
    throw error;
  }
});

// Cleanup after each scenario
After(async function ({ result }) {
  try {
    // Capture conversation URL if available
    if (this.page) {
      try {
        const url = await this.page.url();
        if (url && url.includes('conversation')) {
          // Attach URL to the report in a format that can be parsed later
          await this.attach(`Conversation URL: ${url}`, 'text/plain');
          console.log(`Attached conversation URL to report: ${url}`);
        }
      } catch (urlError) {
        console.error('Failed to capture conversation URL:', urlError);
      }
    }
    
    // Take screenshot if scenario fails
    if (result.status === 'FAILED' && this.page) {
      try {
        const screenshotPath = `reports/failure-${Date.now()}.png`;
        const screenshot = await this.takeScreenshot(screenshotPath);
        if (screenshot) {
          await this.attach(screenshot, 'image/png');
        }
      } catch (screenshotError) {
        console.error('Failed to take failure screenshot:', screenshotError);
      }
    }
  } catch (error) {
    console.error('Error in After hook:', error);
  } finally {
    await this.cleanup();
  }
});