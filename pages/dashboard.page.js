export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.llmListDropDown = page.locator("[data-icon*='angle-down']");
    this.searchLLm = page.locator("input[placeholder*='Search Bot']");
    this.routeLlm = page.locator(
      "//div[@role='dialog']//b[contains(text(),'RouteLLM')]"
    );
    this.deepAgentTextName = page.locator(
      '//div[contains(@class,"justify-center")]//div[contains(text(), "DeepAgent")]'
    );
    this.SkipButton=page.locator("//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'skip')]");
  }

  async clickOnSkipButton() {
    await this.SkipButton.click();
}

  async clickOnDeepAgent() {
    await this.page.getByRole('button', { name: 'DeepAgent' }).click();
    // await this.deepAgentTextName.click();
  }
}
