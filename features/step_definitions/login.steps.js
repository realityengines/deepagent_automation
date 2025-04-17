const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');

let loginPage;

Given('I am on the login page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('I enter valid username {string}', async function (username) {
  await loginPage.enterUsername(username);
});

When('I enter valid password {string}', async function (password) {
  await loginPage.enterPassword(password);
});

When('I enter invalid username {string}', async function (username) {
  await loginPage.enterUsername(username);
});

When('I enter invalid password {string}', async function (password) {
  await loginPage.enterPassword(password);
});

When('I click the login button', async function () {
  await loginPage.clickLoginButton();
});

Then('I should be logged in successfully', async function () {
  await expect(loginPage.getDashboardElement()).toBeVisible();
});

Then('I should see an error message', async function () {
  await expect(loginPage.getErrorMessage()).toBeVisible();
  const errorText = await loginPage.getErrorMessage().textContent();
  expect(errorText).toContain('Invalid credentials');
});

Given('the user enters username {string} and password {string}', async function (username, password) {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickLoginButton();
});