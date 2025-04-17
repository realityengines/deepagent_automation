const {When} = require('@cucumber/cucumber');
const { DashboardPage } = require('../../pages/dashboard.page');

let dashboardPage;

When('I click the deep Agent option', { timeout: 10000 }, async function () {
    dashboardPage = new DashboardPage(this.page);
    await dashboardPage.clickRouteDropdown();
});