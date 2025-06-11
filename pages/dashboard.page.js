export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.llmListDropDown = page.locator("[data-icon*='angle-down']");
    this.searchLLm = page.locator("input[placeholder*='Search Bot']");
    this.routeLlm = page.locator(
      "//div[@role='dialog']//b[contains(text(),'RouteLLM')]"
    );
    this.deepAgentTextName = page.locator(
      '//div[contains(text(), "DeepAgent")]'
    );
  }

  async clickOnDeepAgent() {
    await this.deepAgentTextName.click();
  }
}
