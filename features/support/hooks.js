import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Set default timeout to 12 minutes (720000 milliseconds) for all steps
setDefaultTimeout(720000);

// Ensure the reports directory exists
BeforeAll(async function () {
  try {
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