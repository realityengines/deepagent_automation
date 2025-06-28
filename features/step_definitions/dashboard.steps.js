import { When, Then } from "@cucumber/cucumber";
import { DashboardPage } from "../../pages/dashboard.page.js";

let dashboardPage;

When("I click the deep Agent option", { timeout: 50000 }, async function () {
  dashboardPage = new DashboardPage(this.page);
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page"),
    dashboardPage.clickOnDeepAgent(),
  ]);

  await newPage.waitForLoadState();
  this.page = newPage;
  await this.page.waitForTimeout(2000);
});

Then("I select the default LLM {string}", async function (llmRoute) {
  dashboardPage = new DashboardPage(this.page);
  await dashboardPage.llmListDropDown.waitFor({ state: "visible" });
  await dashboardPage.llmListDropDown.click();
  await dashboardPage.page.waitForTimeout(2000);
  await dashboardPage.searchLLm.fill(llmRoute);
  await dashboardPage.page.waitForTimeout(2000);
  await dashboardPage.routeLlm.click();
  await dashboardPage.page.waitForTimeout(2000);
});
