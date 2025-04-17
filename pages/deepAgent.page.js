class DeepAgentPage {
  constructor(page) {
    this.page = page;
    this.chekoutButton = page.locator(
      '//button[contains(text(), "Check it out")]'
    );
    this.searchPromaptTextArea=page.locator('textarea[dir*="auto"]');
    this.sendButton = page.locator('button [data-icon*="paper-plane"]');
    this.stopButton=page.locator('[class*=" animate-spin-slow "]');
    this.maxLimitTask=page.locator("[class*='space-y-2 flex flex-col items-center']")

  }
  async clickCheckoutButton() {
    await this.chekoutButton.waitFor({ state: "visible" });
    await this.chekoutButton.click();
  }

  async enterPromapt(promat_user_search){
    await this.searchPromaptTextArea.fill(promat_user_search);
  }

  async clickSendButton() {
    await this.sendButton.waitFor({ state: "visible" });
    await this.sendButton.click();
}

async maximumLimitEach()
{
  await this.maxLimitTask.waitFor({ state: "visible" });
}
}


module.exports = { DeepAgentPage };

