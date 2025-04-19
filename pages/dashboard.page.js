export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.deepAgentTextName = page.locator('//div[contains(text(), "DeepAgent")]');
  }

  async clickOnDeeAgent() {
    await this.deepAgentTextName.click();
  }
}