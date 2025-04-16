import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from '@playwright/test';
import { pageFixture } from "../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2);

Given('User navigate to the application', async function () {
    await pageFixture.loginpage.userOnLoginPage();
});


Given('User enter username as {string}', async function (username) {
    await pageFixture.loginpage.enterUsername(username);
});

Given('User enter password as {string}', async function (password) {
    await pageFixture.loginpage.enterPassword(password);
});

When('User click on the login button', async function () {
    await pageFixture.loginpage.clickLoginButton();
});

