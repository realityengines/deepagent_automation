import { When } from "@cucumber/cucumber";
import { DashboardPage } from "../../pages/dashboard.page.js";

let dashboardPage;

When("I click the deep Agent option", { timeout: 10000 }, async function () {
  dashboardPage = new DashboardPage(this.page);
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page"), // Wait for new tab
    dashboardPage.clickOnDeepAgent(),         // Trigger the click
  ]);

  await newPage.waitForLoadState(); // Wait until the new page is fully loaded
  this.page = newPage;  
  await this.page.waitForTimeout(2000);           
});

