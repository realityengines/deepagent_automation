import { setWorldConstructor, World } from "@cucumber/cucumber";
import { chromium } from "playwright";
import playwright from "playwright";
import config from "../../configs/config.js";

class BrowserType extends World {
  async init() {
    try {
      if (config.executionMode === "lambda") {
        // LambdaTest configuration
        const capabilities = {
          browserName: "Chrome",
          browserVersion: "latest",
          "LT:Options": {
            platform: config.lambdaTest.platformName,
            build: config.lambdaTest.buildName,
            name: "Deep Agent Test",
            user: config.lambdaTest.username,
            accessKey: config.lambdaTest.accessKey,
            network: false,
            video: true,
            console: true,
            tunnel: config.lambdaTest.tunnel,
            timeout: 30000000,
            idleTimeout:30000000,
            sessionTimeout:30000000,
            queueTimeout: 900
      
          },
        };

        this.browser = await playwright.chromium.connect({
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify(capabilities)
          )}`,
          timeout: 30000000, // 50 minutes connection timeout
        });

        this.context = await this.browser.newContext({
          viewport: { width: 1900, height: 1000 },
          timeout: 30000000, // 40 minutes context timeout
        });
      } else {
        // Local execution
        this.browser = await chromium.launch({
          headless: config.browser.headless,
          slowMo: config.browser.slowMo,
          args: ['--start-maximized']
        });
        this.context = await this.browser.newContext({
          // viewport: { width: 1800, height: 900 },
          viewport: null,
          timeout: config.browser.timeout,
        });
      }
      this.page = await this.context.newPage();

      // Increase default navigation and page timeouts for LambdaTest
      if (config.executionMode === "lambda") {
        await this.page.setDefaultNavigationTimeout(30000000); // 0 minutes
        await this.page.setDefaultTimeout(30000000); // 50 minutes
      } else {
        await this.page.setDefaultNavigationTimeout(30000000);
        await this.page.setDefaultTimeout(30000000);
      }
    } catch (error) {
      console.error("Failed to initialize browser:", error);
      throw error;
    }
  }

  async takeScreenshot(path) {
    if (this.page) {
      try {
        return await this.page.screenshot({
          path: path,
          fullPage: true,
        });
      } catch (error) {
        console.error("Failed to take screenshot:", error);
        return null;
      }
    }
    return null;
  }




async cleanup() {
  try {
      if (this.page) {
          try {
              await this.page.close().catch(err => console.log('Page close error:', err));
          } catch (error) {
              console.log('Ignoring page close error:', error);
          }
      }
      if (this.context) {
          try {
              await this.context.close().catch(err => console.log('Context close error:', err));
          } catch (error) {
              console.log('Ignoring context close error:', error);
          }
      }
      if (this.browser) {
          try {
              await this.browser.close().catch(err => console.log('Browser close error:', err));
          } catch (error) {
              console.log('Ignoring browser close error:', error);
          }
      }
  } catch (error) {
      console.error("Error during cleanup:", error);
  }
}
}

setWorldConstructor(BrowserType);
