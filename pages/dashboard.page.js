class DashboardPage {
  constructor(page) {
    this.page = page;
    this.routeDropdown = page.locator('[data-icon="angle-down"]');
    this.deepAgentTextName=page.locator('[class*="cursor-pointe"]  div[class*="font-medium"]');
    
  }
  async clickRouteDropdown() {
    await this.routeDropdown.click();
  }

  async clickOnDeeAgent() {
    await this.deepAgentTextName.click();
  }
}
module.exports = { DashboardPage };
