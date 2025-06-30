import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
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
Before(async function () {
  try {
    await this.init();
    // Initialize conversation URL storage
    this.conversationUrl = null;
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
        if (url && (url.includes('conversation') || url.includes('chatllm'))) {
          this.conversationUrl = url;
          console.log(`Captured conversation URL: ${url}`);
        }
      } catch (urlError) {
        console.error('Failed to capture conversation URL:', urlError);
      }
    }
    
    // Handle failed scenarios
    if (result.status === 'FAILED') {
      console.log('='.repeat(50));
      console.log('TEST FAILURE DETECTED');
      console.log('='.repeat(50));
      
      // Display conversation URL prominently in console
      if (this.conversationUrl) {
        console.log(`🔗 CONVERSATION URL: ${this.conversationUrl}`);
        // Attach URL to the report with enhanced formatting
        await this.attach(`
=== FAILURE DETAILS ===
Conversation URL: ${this.conversationUrl}
Scenario: ${this.pickle?.name || 'Unknown'}
Status: FAILED
Timestamp: ${new Date().toISOString()}
========================
        `, 'text/plain');
      } else {
        console.log('⚠️  No conversation URL captured');
        await this.attach(`
=== FAILURE DETAILS ===
Conversation URL: Not Available
Scenario: ${this.pickle?.name || 'Unknown'}
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
            console.log(`📸 Screenshot saved: ${screenshotPath}`);
          }
        } catch (screenshotError) {
          console.error('Failed to take failure screenshot:', screenshotError);
        }
      }
      
      console.log('='.repeat(50));
    } else {
      // For successful tests, still attach URL if available
      if (this.conversationUrl) {
        await this.attach(`Conversation URL: ${this.conversationUrl}`, 'text/plain');
        console.log(`✅ Test passed - Conversation URL: ${this.conversationUrl}`);
      }
    }
    
  } catch (error) {
    console.error('Error in After hook:', error);
  } finally {
    await this.cleanup();
  }
});