const config = require('../config/config');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[type="password"]');
    this.loginButton = page.locator('[type="submit"]');
    this.dashboardElement = page.locator('a[href*="chatllm"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl);
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  getDashboardElement() {
    return this.dashboardElement;
  }

}

module.exports = { LoginPage };