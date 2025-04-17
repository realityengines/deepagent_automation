class DashboardPage {
  constructor(page) {
    this.page = page;
    this.routeDropdown = page.locator('[data-icon="angle-down"]');
  }
  async clickRouteDropdown() {
    await this.routeDropdown.click();
  }
}
module.exports = { DashboardPage };
