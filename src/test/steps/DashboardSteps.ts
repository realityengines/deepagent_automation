import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from '@playwright/test';
import { pageFixture } from "../hooks/pageFixture";

Given('the user enters username {string} and password {string}', async function (username,password) {
    await pageFixture.loginpage.enterUsername(username);
    await pageFixture.loginpage.enterPassword(password)
    await pageFixture.loginpage.clickLoginButton()
});


When('I click the deep Agent option', async function () {

    await pageFixture.dashboardpage.clickRouteDropdown()
    await pageFixture.page.waitForTimeout(30000)
    
})