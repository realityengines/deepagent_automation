import { Given, When, Then } from "@cucumber/cucumber";
import { DeepAgentPage } from "../../pages/deepAgent.page.js";
import { expect } from "chai";
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
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(follow_up_query);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.waitforStopButtonInvisble();


  }
);

// @yuvraj this one not implemented
Then(
  "I should see a prompt that tests factual recall and accuracy of the response",
  async function () {
 //Need to think about quality matches — how can I verify them once the search is completed?"
  }
);

Then('I should see the status {string} for the task', async function (status) {
    const hasExpectedStatus = await deepAgentPage.getStatusOfTask(status);
    expect(hasExpectedStatus).to.be.true;
});

Then("the compute points should not exceed 50k", async function () {
  try {
    const computePoints = await deepAgentPage.getComputePoint();
    
    // Verify that computePoints is a number
    if (typeof computePoints !== 'number' || isNaN(computePoints)) {
      throw new Error(`Invalid compute points value: ${computePoints}`);
    }

    console.log("\n=== Compute Points Details ===");
    console.log(`Current Compute Points: ${computePoints}`);
    console.log(`Maximum Allowed Points: 50,000`);
    console.log(`Points Remaining: ${50000 - computePoints}`);
    console.log("============================\n");
    
    expect(computePoints).to.be.a('number');
    expect(computePoints).to.be.at.most(50000, 'Compute points exceeded 50k limit');
  } catch (error) {
    console.error("Error in compute points verification:", error.message);
    throw error;
  }
});
