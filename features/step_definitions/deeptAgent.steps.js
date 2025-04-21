import { Given, When, Then } from "@cucumber/cucumber";
import { DeepAgentPage } from "../../pages/deepAgent.page.js";
import { expect } from "chai";
let deepAgentPage;

Given("I click the check out from the welcome window", async function () {
  deepAgentPage = new DeepAgentPage(this.page);
  await deepAgentPage.clickCheckoutButton();
  await deepAgentPage.page.waitForTimeout(1000);

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

Then("I should download the generated summary", async function () {
  try {
    const downloadSuccess = await deepAgentPage.downloadFile();
    expect(downloadSuccess).to.be.true, 'Failed to download the file';
    
    // Add wait to ensure download completes
    await this.page.waitForTimeout(2000);
  } catch (error) {
    console.error('Error in downloading summary:', error.message);
    throw error;
  }

  try {
    const downloadViewSuccess = await deepAgentPage.downloadFilesFromViewer();
    expect(downloadViewSuccess).to.be.true, 'Failed to download the file';
    
    // Add wait to ensure download completes
    await this.page.waitForTimeout(2000);
  } catch (error) {
    console.error('Error in downloading summary:', error.message);
    throw error;
  }


});
Then("I should fetch the search results", async function () {
  await deepAgentPage.closeBrowserPopup();
  await deepAgentPage.page.waitForTimeout(2000);
  try {
    console.log("\n=== Fetching Search Results ===");
    
    // Call the searchAndFetchAllResults method
    const searchData = await deepAgentPage.searchAndFetchAllResults();
    
    // Verify we got some results
    expect(searchData).to.exist;
    expect(searchData.totalSearches).to.be.greaterThan(0);
    
    console.log(`Total searches processed: ${searchData.totalSearches}`);
    console.log(`Results saved to: ${process.cwd()}/jsonReader/allSearchResults.json`);
    console.log("====\n");
    
    // Add small delay to ensure file writing is complete
    await deepAgentPage.page.waitForTimeout(1000);
    
  } catch (error) {
    console.error("\n=== Error Fetching Search Results ===");
    console.error(error.message);
    console.error("====\n");
    throw error;
  }
});

// c:\Users\Admin\Desktop\abacurview\deepagent_automation\steps\deepAgent.steps.js

// Then("I should store the response text in a JSON file", async function () {
//   try {
//       // Call the method to capture and store response text
//       const responseData = await this.deepAgentPage.captureAndStoreResponseValue();
      
//       // Verify the data was captured successfully
//       if (!responseData || !responseData.responses || responseData.responses.length === 0) {
//           throw new Error("No response text was captured");
//       }

//       console.log(`Successfully stored ${responseData.totalParagraphs} paragraphs of response text`);
//   } catch (error) {
//       console.error("Failed to store response text:", error.message);
//       throw error;
//   }
// });

// Update the Then step to use the global deepAgentPage if this.deepAgentPage is not available
Then("I should store the response text in a JSON file", async function () {
  try {
    // Use either this.deepAgentPage or the global deepAgentPage
    const pageInstance = this.deepAgentPage || deepAgentPage;
    
    if (!pageInstance) {
      throw new Error("DeepAgentPage instance not initialized");
    }

    const responseData = await pageInstance.captureAndStoreResponseValue();
    
    // Verify the data was captured successfully
    if (!responseData || !responseData.responses || responseData.responses.length === 0) {
      throw new Error("No response text was captured");
    }

    console.log(`Successfully stored ${responseData.totalParagraphs} paragraphs of response text`);
  } catch (error) {
    console.error("Failed to store response text:", error.message);
    throw error;
  }
});



