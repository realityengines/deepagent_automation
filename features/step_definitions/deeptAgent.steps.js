const { Given, When, Then } = require("@cucumber/cucumber");
const { DeepAgentPage } = require("../../pages/deepAgent.page");
let deepAgentPage;

Given("I click the check out from the welcome window", async function () {
  deepAgentPage = new DeepAgentPage(this.page);
  await deepAgentPage.clickCheckoutButton();
});

When(
  "I search the prompt {string} with follow-up query {string}",
  async function (promatSearch, follow_up_query) {
    await deepAgentPage.enterPromapt(promatSearch);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.maximumLimitEach();
  }
);

Then(
  "I should see a prompt that tests factual recall and accuracy of the response",
  async function () {}
);

Then("the response time should not exceed {int} minutes", async function (int) {
  return "pending";
});

Then("the compute points should not exceed 50k", async function () {});
