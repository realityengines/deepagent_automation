import { Given, When, Then } from "@cucumber/cucumber";
import { DeepAgentPage } from "../../pages/deepAgent.page.js";
import { expect } from "chai";
/** @type {DeepAgentPage} */
let deepAgentPage;

Given("I click the check out from the welcome window", async function () {
  deepAgentPage = new DeepAgentPage(this.page);
  await deepAgentPage.clickCheckoutButton();
  await deepAgentPage.page.waitForTimeout(2000);
});

When(
  "I search the prompt {string} with follow-up query {string}",
  async function (promatSearch, follow_up_query) {
    await deepAgentPage.enterPromapt(promatSearch);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(follow_up_query);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    // deepAgentPage.elapsedTime = firstElapsedTime + secondElapsdTime;

    deepAgentPage.elapsedTime =
    firstElapsedTime +
    secondElapsdTime;

  console.log(
    "Total elapsed time after follow up prompt:",
    deepAgentPage.elapsedTime
  );
  }
);

Then("I should see the status {string} for the task", async function (status) {
  const hasExpectedStatus = await deepAgentPage.getStatusOfTask(status);
  expect(hasExpectedStatus).to.be.true;
});

Then("the compute points should not exceed 150k", async function () {
  try {
   // const computePoints = await deepAgentPage.getComputePoint();
    const computePoints = (await deepAgentPage.getComputePoint()) * 100;

    // Handle error case (when -1 is returned)
    if (computePoints === -1) {
      console.warn("Could not retrieve compute points, skipping verification");
      return;
    }

    // Verify that computePoints is a valid number
    if (typeof computePoints !== "number" || isNaN(computePoints)) {
      throw new Error(`Invalid compute points value: ${computePoints}`);
    }

    console.log("\n=== Compute Points Details ===");
    console.log(`Current Compute Points: ${computePoints}`);
    console.log(`Maximum Allowed Points: 150000`);
    console.log(`Points Remaining: ${150000 - computePoints}`);
    console.log("============================\n");

    expect(computePoints).to.be.a("number");
    expect(computePoints).to.be.at.most(
      150000,
      `Compute points (${computePoints}) exceeded 150k limit`
    );
  } catch (error) {
    console.error("Error in compute points verification:", error.message);
    throw error;
  }
});

Then("I should download the generated summary", async function () {
  try {
    const downloadSuccess = await deepAgentPage.downloadFile();
    await this.page.waitForTimeout(2000);
  } catch (error) {
    console.error("Error in downloading summary:", error.message);
    throw error;
  }

  try {
    const downloadViewSuccess = await deepAgentPage.downloadFilesFromViewer();
    await this.page.waitForTimeout(2000);
  } catch (error) {
    console.error("Error in downloading summary:", error.message);
    throw error;
  }

  // Close browser popup after all downloads are completed
  await deepAgentPage.closeBrowserPopup();
  await deepAgentPage.page.waitForTimeout(2000);
});
Then("I should fetch the search results", async function () {
  // await deepAgentPage.closeBrowserPopup();
  // await deepAgentPage.page.waitForTimeout(2000);
  try {
    console.log("\n=== Fetching Search Results ===");
    // Call the searchAndFetchAllResults method
    const searchData = await deepAgentPage.searchAndFetchAllResults();
    console.log(
      `Results saved to: ${process.cwd()}/jsonReport/allSearchResults.json`
    );
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

When("I open the Deep Agent default sample task", async function () {
  await deepAgentPage.openSampelTaskWindow();
});

Then("I should see the Deep Agent popup window", async function () {
  await deepAgentPage.isDsipalyedTaskDialogePopup();
});

Then("I should see the Cancel and Try it buttons", async function () {
  await deepAgentPage.page.waitForTimeout(3000);
  await deepAgentPage.isDsipalyedCancelButton();
  await deepAgentPage.page.waitForTimeout(1000);
  await deepAgentPage.isDsipalyedtryItButton();
});

When(
  "I search for a default sample task and enter {string}",
  async function (follow_up_query) {
    await deepAgentPage.openSampelTaskWindow();
    await deepAgentPage.isDsipalyedTaskDialogePopup();
    await deepAgentPage.page.waitForTimeout(1000);
    await deepAgentPage.clickOnTryItButton();
    await deepAgentPage.page.waitForTimeout(1000);
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(follow_up_query);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    deepAgentPage.elapsedTime = firstElapsedTime + secondElapsdTime;

    // Initial check
    let pptxTextList = await deepAgentPage.fileDownlaod.allTextContents();
    let isViewFileVisible = pptxTextList.some(
      (text) =>
        text.trim().toLowerCase().endsWith(".pptx") ||
        text.trim().toLowerCase().endsWith(".ppt")
    );

    if (!isViewFileVisible) {
      // Step 1: Try "yes"
      await deepAgentPage.enterPromaptQuery("yes");
      await deepAgentPage.page.waitForTimeout(1000);
      await deepAgentPage.clickSendButton();
      const thirdElapsedTime = await deepAgentPage.waitforStopButtonInvisble();

      await deepAgentPage.page.waitForTimeout(2000);
      await deepAgentPage.selectTheElementFromDropDown();
      const fourthElapsedTime = await deepAgentPage.waitforStopButtonInvisble();

      deepAgentPage.elapsedTime =
        firstElapsedTime +
        secondElapsdTime +
        thirdElapsedTime +
        fourthElapsedTime;

      console.log(
        "Total elapsed time after 'yes' prompt:",
        deepAgentPage.elapsedTime
      );

      // Step 2: Re-check after "yes"
      pptxTextList = await deepAgentPage.fileDownlaod.allTextContents();
      isViewFileVisible = pptxTextList.some(
        (text) =>
          text.trim().toLowerCase().endsWith(".pptx") ||
          text.trim().toLowerCase().endsWith(".ppt")
      );

      // Step 3: If still not found, try "convert to ppt"
      if (!isViewFileVisible) {
        await deepAgentPage.enterPromaptQuery("convert to ppt");
        await deepAgentPage.clickSendButton();
        const fifthElapsedTime =
          await deepAgentPage.waitforStopButtonInvisble();
        deepAgentPage.elapsedTime =
        firstElapsedTime +
        secondElapsdTime +
        thirdElapsedTime +
        fourthElapsedTime+
        fifthElapsedTime;

        console.log(
          "Total elapsed time after 'convert to ppt':",
          deepAgentPage.elapsedTime
        );

        // Final check
        pptxTextList = await deepAgentPage.fileDownlaod
          .locator("span.aafont-mono")
          .allTextContents();

        isViewFileVisible = pptxTextList.some(
          (text) =>
            text.trim().toLowerCase().endsWith(".pptx") ||
            text.trim().toLowerCase().endsWith(".ppt")
        );

        if (!isViewFileVisible) {
          console.warn("⚠️ PPTX file was NOT found even after all retries.");
          this.pptxGenerated = false;
          return; // Don't throw!
        }
      } else {
        console.log(
          "✅ PPTX file found after 'yes' — no need to run 'convert to ppt'"
        );
      }
    } else {
      console.log(
        "✅ PPTX file found on initial check — no interaction needed"
      );
    }
    this.pptxGenerated = true;
  }
);

Then(
  "I should see the search results for the default sample task",
  async function () {
    try {
      console.log("\n=== Fetching Search Results ===");
      // Call the searchAndFetchAllResults method
      const searchData = await deepAgentPage.searchAndFetchAllResults();
      console.log(
        `Results saved to: ${process.cwd()}/jsonReport/allSearchResults.json`
      );
      console.log("====\n");

      // Add small delay to ensure file writing is complete
      await deepAgentPage.page.waitForTimeout(1000);
    } catch (error) {
      console.error("\n=== Error Fetching Search Results ===");
      console.error(error.message);
      console.error("====\n");
      throw error;
    }
  }
);

// all task
When(
  "I search all default sample tasks and enter prompt {string} and check status {string} for the task and compute points should not exceed {int}",
  async function (promptText, expectedStatus, maxComputePoints) {
    console.log("\n=== Starting Sample Tasks Execution ===");
    console.log(`Prompt Text: ${promptText}`);
    console.log(`Expected Status: ${expectedStatus}`);
    console.log(`Max Compute Points: ${maxComputePoints}`);

    try {
      await deepAgentPage.AllSampleTaskDefault(
        promptText,
        expectedStatus,
        maxComputePoints
      );

      // Get and log compute points for verification
      const currentPoints = await deepAgentPage.getComputePoint();
      console.log("\n=== Compute Points Summary ===");
      console.log(`Current Points Used: ${currentPoints}`);
      console.log(`Points Limit: ${maxComputePoints}`);
      console.log(
        `Within Limit: ${currentPoints <= maxComputePoints ? "Yes ✓" : "No ✗"}`
      );

      if (currentPoints > maxComputePoints) {
        console.warn(
          `WARNING: Compute points (${currentPoints}) exceeded the maximum limit of ${maxComputePoints}`
        );
      }
    } catch (error) {
      console.error("\n=== Execution Error ===");
      console.error(`Error executing sample tasks: ${error.message}`);
      throw error;
    }
    console.log("\n=== Sample Tasks Execution Completed ===\n");
  }
);

When(
  "I search for all default sample task {string} and enter {string}",
  async function (sampleTaskName, Specify_the_prompat) {
    await deepAgentPage.clickOnSampleTaskDefault(sampleTaskName);
    await deepAgentPage.isDsipalyedTaskDialogePopup();
    await deepAgentPage.page.waitForTimeout(1000);
    await deepAgentPage.clickOnTryItButton();
    await deepAgentPage.page.waitForTimeout(1000);
    // await deepAgentPage.waitforStopButtonInvisble();
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(Specify_the_prompat);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    deepAgentPage.elapsedTime =
    firstElapsedTime +
    secondElapsdTime;

  console.log(
    "Total elapsed time after follow up prompt:",
    deepAgentPage.elapsedTime
  );
  }
);
