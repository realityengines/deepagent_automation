import { When } from "@cucumber/cucumber";
import { DashboardPage } from "../../pages/dashboard.page.js";

let dashboardPage;

When("I click the deep Agent option", { timeout: 10000 }, async function () {
  dashboardPage = new DashboardPage(this.page);
  await dashboardPage.clickOnDeepAgent();

  // Handle new tab opening
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page"),
  ]);
  await newPage.waitForLoadState();
  this.page = newPage; // Switch context to new tab
  await this.page.waitForTimeout(2000); // Wait for 2 seconds
});
