const { When } = require("@cucumber/cucumber");
const { DashboardPage } = require("../../pages/dashboard.page");

let dashboardPage;

When("I click the deep Agent option", { timeout: 10000 }, async function () {
  dashboardPage = new DashboardPage(this.page);
  await dashboardPage.clickRouteDropdown();
  await dashboardPage.page.waitForTimeout(3000);
  await dashboardPage.clickRouteDropdown();
  dashboardPage.clickOnDeeAgent();

  // Handle new tab opening
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page"),
  ]);
  await newPage.waitForLoadState();
  this.page = newPage; // Switch context to new tab
});
