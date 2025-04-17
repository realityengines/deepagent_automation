const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const playwright = require('playwright');
const config = require('../../config/config');

class BrowserType extends World {
  async init() {
    try {
      if (config.executionMode === 'lambda') {
        // LambdaTest configuration
        const capabilities = {
          'browserName': 'Chrome',
          'browserVersion': 'latest',
          'LT:Options': {
            'platform': config.lambdaTest.platformName,
            'build': config.lambdaTest.buildName,
            'name': 'Playwright Test',
            'user': config.lambdaTest.username,
            'accessKey': config.lambdaTest.accessKey,
            'network': true,
            'video': true,
            'console': true,
            'tunnel': config.lambdaTest.tunnel,
            'timeout': 90000  // Increased timeout for LambdaTest
          },
        };

        this.browser = await playwright.chromium.connect({
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`,
          timeout: 90000
        });

        this.context = await this.browser.newContext({
          viewport: { width: 1920, height: 1080 }
        });
      } else {
        // Local execution
        this.browser = await chromium.launch({
          headless: config.browser.headless,
          slowMo: config.browser.slowMo
        });
        this.context = await this.browser.newContext({
          viewport: { width: 1920, height: 1080 },
          timeout: config.browser.timeout
        });
      }
      this.page = await this.context.newPage();
      
      // Set default navigation timeout
      await this.page.setDefaultNavigationTimeout(90000);
      await this.page.setDefaultTimeout(90000);
      
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  async takeScreenshot(path) {
    if (this.page) {
      try {
        return await this.page.screenshot({
          path: path,
          fullPage: true
        });
      } catch (error) {
        console.error('Failed to take screenshot:', error);
        return null;
      }
    }
    return null;
  }
}

setWorldConstructor(BrowserType);