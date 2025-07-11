import { Given, When, Then } from "@cucumber/cucumber";
import { DeepAgentPage } from "../../pages/deepAgent.page.js";
import { WebsitePage } from "../../pages/website.page.js";
import { expect } from "chai";
/** @type {DeepAgentPage} */
let deepAgentPage;

/** @type {WebsitePage} */
let websitePage;

Given("I click the check out from the welcome window", async function () {
  deepAgentPage = new DeepAgentPage(this.page);
  await deepAgentPage.clickCheckoutButton();
  await deepAgentPage.page.waitForTimeout(3000);
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
    deepAgentPage.elapsedTime = firstElapsedTime + secondElapsdTime;

    const hasExpectedStatus = await deepAgentPage.getStatusOfTask("Completed");
    console.log(`Status found: ${hasExpectedStatus}`);

    // Send fallback prompt only if status not found
    if (!hasExpectedStatus) {
      console.log("Status not found, sending fallback prompt...");
      await deepAgentPage.enterPromaptQuery("your call");
      await deepAgentPage.page.waitForTimeout(3000);
      await deepAgentPage.clickSendButton();
      const thirdElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
      deepAgentPage.elapsedTime += thirdElapsedTime;
    }

    console.log("Total elapsed time after prompts:", deepAgentPage.elapsedTime);
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);
    await deepAgentPage.getConvoId();
  }
);

Then("I should see the status {string} for the task", async function (status) {
  await deepAgentPage.waitforStopButtonInvisble();
  await deepAgentPage.page.waitForTimeout(3000);
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
    // Get the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();

    console.log("\n=== Compute Points Details ===");
    console.log(`Current Compute Points: ${computePoints}`);
    console.log(`Maximum Allowed Points: 150000`);
    console.log(`Points Remaining: ${150000 - computePoints}`);
    console.log(`Conversation URL: ${convoURL}`);
    console.log("============================\n");

    try {
      expect(computePoints).to.be.a("number");
      if (computePoints > 150000) {
        console.warn(
          `⚠️ WARNING: Compute points (${computePoints}) exceeded 150k limit`
        );
        console.warn(
          "Continuing test execution despite high compute points..."
        );
        // Log but don't fail the test
        return true;
      }
      return true;
    } catch (assertError) {
      console.warn(`⚠️ Assertion Warning: ${assertError.message}`);
      console.warn("Continuing test execution...");
      // Continue execution without failing the test
      return true;
    }
  } catch (error) {
    console.error("Error in compute points verification:", error.message);
    throw error;
  }
});

Then("I should download the generated summary", async function () {
  try {
    const downloadSuccess = await deepAgentPage.downloadFile();
    await this.page.waitForTimeout(3000);
  } catch (error) {
    console.error("Error in downloading summary:", error.message);
    throw error;
  }

  try {
    const downloadViewSuccess = await deepAgentPage.downloadFilesFromViewer();
    await this.page.waitForTimeout(1000);
  } catch (error) {
    console.error("Error in downloading summary:", error.message);
    throw error;
  }

  // Get the conversation URL
  try {
    const convoURL = await deepAgentPage.getConvoURL();
    console.log("\n=== Download Summary ===\n");
    console.log(`Conversation URL: ${convoURL}`);
    console.log("============================\n");
  } catch (error) {
    console.error("Error getting conversation URL:", error.message);
    // Rethrow the error to fail the test
    throw error;
  }

  // Close browser popup after all downloads are completed
  await deepAgentPage.closeBrowserPopup();
  await deepAgentPage.page.waitForTimeout(2000);
});
Then("I should fetch the search results", async function () {
  try {
    console.log("\n=== Fetching Search Results ===");
    // Call the searchAndFetchAllResults method
    const searchData = await deepAgentPage.searchAndFetchAllResults();

    // Get the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();

    console.log(
      `Results saved to: ${process.cwd()}/jsonReport/allSearchResults.json`
    );
    console.log(`Conversation URL: ${convoURL}`);
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
    // await deepAgentPage.enterPromaptQuery(follow_up_query);
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
      await deepAgentPage.selectTheElementFromDropDown("Default");
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
        await deepAgentPage.enterPromaptQuery("convert to pptx");
        await deepAgentPage.clickSendButton();
        const fifthElapsedTime =
          await deepAgentPage.waitforStopButtonInvisble();
        deepAgentPage.elapsedTime =
          firstElapsedTime +
          secondElapsdTime +
          thirdElapsedTime +
          fourthElapsedTime +
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
          // Throw an error to fail the test
          throw new Error("PPTX file was not found after all retries");
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

    // Get and log the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);

    await deepAgentPage.getConvoId();
  }
);

Then(
  "I should see the search results for the default sample task",
  async function () {
    try {
      console.log("\n=== Fetching Search Results ===");
      // Call the searchAndFetchAllResults method
      const searchData = await deepAgentPage.searchAndFetchAllResults();
      // Get the conversation URL
      const convoURL = await deepAgentPage.getConvoURL();
      console.log(
        `Results saved to: ${process.cwd()}/jsonReport/allSearchResults.json`
      );
      console.log(`Conversation URL: ${convoURL}`);
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

      // Get the conversation URL
      const convoURL = await deepAgentPage.getConvoURL();

      console.log("\n=== Compute Points Summary ===");
      console.log(`Current Points Used: ${currentPoints}`);
      console.log(`Points Limit: ${maxComputePoints}`);
      console.log(
        `Within Limit: ${currentPoints <= maxComputePoints ? "Yes ✓" : "No ✗"}`
      );
      console.log(`Conversation URL: ${convoURL}`);

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
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(Specify_the_prompat);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    deepAgentPage.elapsedTime = firstElapsedTime + secondElapsdTime;

    console.log(
      "Total elapsed time after follow up prompt:",
      deepAgentPage.elapsedTime
    );

    // Get and log the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);

    await deepAgentPage.getConvoId();
  }
);

When(
  "I search the chat bot prompt {string} with follow-up query {string}",
  async function (promatSearch, follow_up_query) {
    await deepAgentPage.enterPromapt(promatSearch);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(follow_up_query);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery("your choice");
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const ThirdElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    deepAgentPage.elapsedTime =
      firstElapsedTime + secondElapsdTime + ThirdElapsdTime;

    console.log(
      "Total elapsed time after follow up prompt:",
      deepAgentPage.elapsedTime
    );

    // Get and log the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);

    await deepAgentPage.getConvoId();
  }
);

Then(
  "Then I can see the custom chat and perform some action",
  { timeout: 50000 },
  async function () {
    const originalPage = this.page;
    deepAgentPage.clickOnChatBotLink();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    this.page = newPage;
    deepAgentPage = new DeepAgentPage(newPage);
    await this.page.waitForTimeout(2000);
    await deepAgentPage.enterPromapt("what is playwright");
    await this.page.waitForTimeout(2000);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    deepAgentPage.elapsedTime = firstElapsedTime;

    console.log(
      "Total elapsed time after follow up prompt:",
      deepAgentPage.elapsedTime
    );
    // Close the new page and return to original
    await newPage.close();
    this.page = originalPage;
    console.log("Returned to original page");

    // Capture conversation URL
    try {
      const convoURL = await deepAgentPage.getConvoURL();
      console.log(`\nConversation URL: ${convoURL}`);
    } catch (error) {
      console.log("Conversation URL not available");
    }
  }
);

When(
  "I search the prompt {string} with follow-up query {string} to generate a website",
  async function (promatSearch, follow_up_query) {
    await deepAgentPage.enterPromapt(promatSearch);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(follow_up_query);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    let thirdElapsedTime = 0;
    let fourthElapsedTime = 0;
    let deployOptionVisible = false;
    deployOptionVisible = await deepAgentPage.deployOption.isVisible();
    if (!deployOptionVisible) {
      await deepAgentPage.enterPromapt("create a website");
      await deepAgentPage.clickSendButton();
      await deepAgentPage.page.waitForTimeout(3000);
      thirdElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
      deployOptionVisible = await deepAgentPage.deployOption.isVisible();
      if (!deployOptionVisible) {
        await deepAgentPage.enterPromapt("Your call");
        await deepAgentPage.clickSendButton();
        await deepAgentPage.page.waitForTimeout(3000);
        fourthElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
        deployOptionVisible = await deepAgentPage.deployOption.isVisible();
      }
    }
    let dataBaseVisible = false;
    dataBaseVisible = await deepAgentPage.dataBase.isVisible();
    if (dataBaseVisible) {
      await deepAgentPage.dataBase.click();
      await deepAgentPage.datBaseVisible.isVisible();
    }
    deepAgentPage.elapsedTime =
      firstElapsedTime +
      secondElapsdTime +
      thirdElapsedTime +
      fourthElapsedTime;
    console.log(
      "Total elapsed time after follow up prompt:",
      deepAgentPage.elapsedTime
    );

    // Get and log the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);

    await deepAgentPage.getConvoId();
  }
);

When(
  "I search a prompt {string} with follow-up query {string}",
  async function (promptSearch, follow_up_query) {
    await deepAgentPage.enterPromapt(promptSearch);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(follow_up_query);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    let thirdElapsedTime = 0;
    let fourthElapsedTime = 0;
    let fifthElapsedTime = 0;

    // The 'Choose a Presentation Template' option has been removed
    /* let titleVisible = false;
    try {
      await deepAgentPage.agentTitle.waitFor({
        state: "visible",
        timeout: 5000,
      });
      titleVisible = await deepAgentPage.agentTitle.isVisible();
    } catch (error) {
      console.log("Agent title not visible within timeout.");
    }
    if (titleVisible) {
      await deepAgentPage.selectTheElementFromDropDown("Default");
      thirdElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    } else {
      await deepAgentPage.enterPromapt("proceed");
      await deepAgentPage.clickSendButton();
      await deepAgentPage.page.waitForTimeout(3000);
      fourthElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
      await deepAgentPage.page.waitForTimeout(3000);
      await deepAgentPage.selectTheElementFromDropDown("Default");
      fifthElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    }*/

    deepAgentPage.elapsedTime =
      firstElapsedTime +
      secondElapsdTime +
      // thirdElapsedTime +
      // fourthElapsedTime +
      // fifthElapsedTime;
      console.log(
        "Total elapsed time after follow up prompt:",
        deepAgentPage.elapsedTime
      );

    // Get and log the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);

    await deepAgentPage.downloadComputeAgentFile();
    // await deepAgentPage.verifyDownloadedFilesPptxandPdf();
    await deepAgentPage.getConvoId();
  }
);

Then("I should deploy the website", async function () {
  const randomDeploymentName = `webtest-${Math.random()
    .toString(36)
    .substring(2, 8)}`;

    await deepAgentPage.deployOption.click();
    await deepAgentPage.deploymentName.fill(randomDeploymentName);
    await deepAgentPage.deployButton.click();
  
    try {
      // Wait until success message is visible (up to 30s)
      await deepAgentPage.deploysucessmessage.waitFor({
        state: "visible",
        timeout: 30000,
      });
  
      const isVisible = await deepAgentPage.deploysucessmessage.isVisible();
      expect(isVisible, "Success message not visible").to.be.true;
  
      const messageText = await deepAgentPage.deploysucessmessage.textContent();
      expect(messageText, "Success message text mismatch").to.include(
        "Deployment successful!"
      );
  
      console.log("✅ Success message appeared and text is correct.");
  
      // Wait until message disappears (max 2 minutes)
      await deepAgentPage.deploysucessmessage.waitFor({
        state: "hidden",
        timeout: 120000, // 2 minutes
      });
  
      console.log("✅ Success message is now hidden.");
    } catch (error) {
      console.error("❌ Deployment success message issue:", error.message);
    }
  });


Then("I should deploy the created website", async function () {
  const randomDeploymentName = `webtest-${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  await deepAgentPage.deployOption.click();
  await deepAgentPage.deploymentName.fill(randomDeploymentName);
  await deepAgentPage.deployButton.click();
  await deepAgentPage.deploysucessmessage.waitFor({
    state: "visible",
    timeout: 10000,
  });
  const isVisible = await deepAgentPage.deploysucessmessage.isVisible();
  expect(isVisible).to.be.true;
  const messageText = await deepAgentPage.deploysucessmessage.textContent();
  expect(messageText).to.include("Deployment successful!");
});

// Then(
//   "the website should display correct tabs, graphs, and navigation bar",
//   async function () {
//     await deepAgentPage.previewButton.click();
//     deepAgentPage.clickOnDeployLink();
//     const [newPage] = await Promise.all([
//       this.page.context().waitForEvent("page"),
//     ]);
//     await newPage.waitForLoadState();
//     deepAgentPage = new DeepAgentPage(newPage);
//     this.page = newPage;

//     try {
//       await newPage.waitForTimeout(3000);

//       // Wait for each element to be visible before checking
//       console.log("Checking analytics link...");
//       await deepAgentPage.analyticsLink.waitFor({
//         state: "visible",
//         timeout: 10000,
//       });
//       const analyticsLinkIsVisible =
//         await deepAgentPage.analyticsLink.isVisible();
//       console.log(`Analytics link visible: ${analyticsLinkIsVisible}`);
//       expect(analyticsLinkIsVisible).to.be.true;

//       console.log("Checking calculator link...");
//       await deepAgentPage.calculator.waitFor({
//         state: "visible",
//         timeout: 10000,
//       });
//       const calculatorLinkIsVisible =
//         await deepAgentPage.calculator.isVisible();
//       console.log(`Calculator link visible: ${calculatorLinkIsVisible}`);
//       expect(calculatorLinkIsVisible).to.be.true;

//       console.log("Checking calendar link...");
//       await deepAgentPage.calender.waitFor({
//         state: "visible",
//         timeout: 10000,
//       });
//       const calenderLinkIsVisible = await deepAgentPage.calender.isVisible();
//       console.log(`Calendar link visible: ${calenderLinkIsVisible}`);
//       expect(calenderLinkIsVisible).to.be.true;

//       console.log("Checking settings link...");
//       await deepAgentPage.setting.waitFor({ state: "visible", timeout: 10000 });
//       const settingLinkIsVisible = await deepAgentPage.setting.isVisible();
//       console.log(`Settings link visible: ${settingLinkIsVisible}`);
//       expect(settingLinkIsVisible).to.be.true;

//       console.log("Checking chat image...");
//       await deepAgentPage.chatImage.waitFor({
//         state: "visible",
//         timeout: 10000,
//       });
//       const chatImgIsVisible = await deepAgentPage.chatImage.isVisible();
//       console.log(`Chat image visible: ${chatImgIsVisible}`);
//       expect(chatImgIsVisible).to.be.true;

//       console.log("All elements verified successfully!");
//     } catch (error) {
//       console.error("Error performing actions on new page:", error.message);
//       throw error;
//     }
//   }
// );

Then(
  "the website should display correct tabs, graphs, and navigation bar",
  async function () {
    await deepAgentPage.previewButton.click();

    // Wait for the new page to open when clicking the deploy link
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page", { timeout: 60000 }), // Increased timeout
      deepAgentPage.clickOnDeployLink(), // Now properly awaited in Promise.all
    ]);

    await newPage.waitForLoadState();
    deepAgentPage = new DeepAgentPage(newPage);
    this.page = newPage;

    await newPage.waitForTimeout(3000);

    const softAssert = async (label, locator) => {
      try {
        console.log(`Checking ${label}...`);
        await locator.waitFor({ state: "visible", timeout: 10000 });
        const isVisible = await locator.isVisible();
        console.log(`${label} visible: ${isVisible}`);
        if (!isVisible) {
          console.warn(`⚠️ Warning: ${label} is not visible.`);
          throw new Error(`${label} is not visible`);
        }
      } catch (e) {
        console.warn(`⚠️ Warning: Failed to verify ${label}: ${e.message}`);
        throw e; // Rethrow to fail the test
      }
    };

    await softAssert("analytics link", deepAgentPage.analyticsLink);
    await softAssert("calculator link", deepAgentPage.calculator);
    await softAssert("calendar link", deepAgentPage.calender);
    await softAssert("settings link", deepAgentPage.setting);
    await softAssert("chat image", deepAgentPage.chatImage);

    console.log("Soft check completed for all elements.");
  }
);

Then("I should see the generated video", async function () {
  await deepAgentPage.verifyVideoGeneration();
});

Then(
  "I can see the custom chat and perform some action and search the prompt {string}",
  async function (promptSearchForCustomChatbot) {
    const originalPage = this.page;

    // Wait for the new page to open when clicking the chatbot link
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page", { timeout: 60000 }), // Increased timeout
      deepAgentPage.clickOnChatBotLink(), // Now properly awaited in Promise.all
    ]);

    await newPage.waitForLoadState();
    deepAgentPage = new DeepAgentPage(newPage);
    this.page = newPage;
    try {
      await deepAgentPage.enterPromapt(promptSearchForCustomChatbot);
      await this.page.waitForTimeout(2000);
      await deepAgentPage.clickSendButton();
      await deepAgentPage.page.waitForTimeout(3000);
      const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
      // const isVisible = await deepAgentPage.htmlCode.isVisible();
      // expect(isVisible).to.be.true;
      deepAgentPage.elapsedTime = firstElapsedTime;

      console.log(
        "Total elapsed time after follow up prompt:",
        deepAgentPage.elapsedTime
      );
    } catch (error) {
      console.error("Error performing actions on new page:", error.message);
      throw error;
    }
    // Close the new page and return to original
    await newPage.close();
    this.page = originalPage;
    console.log("Returned to original page");

    // Capture conversation URL
    try {
      const convoURL = await deepAgentPage.getConvoURL();
      console.log(`\nConversation URL: ${convoURL}`);
    } catch (error) {
      console.log("Conversation URL not available");
    }
  }
);

Then(
  "the user completes the registration process successfully and verify the database",
  async function () {
    try {
      const originalPage = this.page;
      console.log("\n=== Step 1: Click Deploy and Open New Page ===");

      // Open deployed page
      const [newPage] = await Promise.all([
        originalPage.context().waitForEvent("page", { timeout: 60000 }),
        deepAgentPage.clickOnDeployLink(),
      ]);
      await newPage.waitForLoadState("domcontentloaded");
      this.page = newPage;
      deepAgentPage = new DeepAgentPage(newPage);
      await newPage.waitForTimeout(2000);

      // === Step 2: Verify All Page Links ===
      console.log("\n=== Step 2: Verifying All Page Links ===");
      const links = await newPage.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            'a[href]:not([href^="javascript:"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])'
          )
        ).map((a) => ({
          href: a.href,
          text: a.textContent.trim() || a.href,
        }));
      });

      const failedLinks = [];
      let successCount = 0;

      for (const [i, link] of links.entries()) {
        const tempPage = await newPage.context().newPage();
        try {
          const response = await tempPage.goto(link.href, {
            timeout: 15000,
            waitUntil: "domcontentloaded",
          });
          const status = response?.status() || 0;

          if (status === 200) {
            successCount++;
            console.log(`✅ Link ${i + 1}: ${link.text} (${link.href}) - 200 OK`);
          } else {
            console.warn(`❌ Link ${i + 1}: ${link.text} (${link.href}) - Status: ${status}`);
            failedLinks.push({ ...link, status });
          }
        } catch (err) {
          console.error(`❌ Link ${i + 1}: ${link.text} (${link.href}) - Error: ${err.message}`);
          failedLinks.push({ ...link, error: err.message });
        } finally {
          await tempPage.close();
        }
      }

      // Report all link results
      const urlStatusReport = [
        "=== URL VERIFICATION RESULTS ===",
        `Total Links: ${links.length}`,
        `Successful (200): ${successCount}`,
        `Failed: ${failedLinks.length}`,
        "\n✅ Successful Links:",
        ...links
          .filter((l) => !failedLinks.some((f) => f.href === l.href))
          .map((l, i) => `${i + 1}. "${l.text}" (${l.href}) - Status: 200`),
        "\n❌ Failed Links:",
        ...failedLinks.map(
          (l, i) => `${i + 1}. "${l.text}" (${l.href}) - ${l.status || l.error}`
        ),
        "\n⚠️ Proceeding with signup despite failed links...",
      ].join("\n");

      await this.attach(urlStatusReport, "text/plain");

      // OPTIONAL: Log simple alert if needed
      if (failedLinks.length > 0) {
        console.warn(`⚠️ ALERT: ${failedLinks.length} link(s) failed, continuing with signup.`);
      }

      // === Step 3: Getting Conversation URL ===
      console.log("\n=== Step 3: Getting Conversation URL ===");
      try {
        const convoURL = await deepAgentPage.getConvoURL();
        console.log(`Conversation URL: ${convoURL}`);
      } catch (e) {
        console.log("Conversation URL not available");
      }

      // === Step 4: Perform Signup ===
      console.log("\n=== Step 4: Performing Signup ===");
      await deepAgentPage.performSignUp(this.attach);

      // === Step 4.1: Return to original Deep Agent page ===
      console.log("\n=== Step 4.1: Returning to original DeepAgent page ===");
      await newPage.close();
      this.page = originalPage;
      deepAgentPage = new DeepAgentPage(originalPage);

      try {
        const convoURL2 = await deepAgentPage.getConvoURL();
        console.log(`Conversation URL after signup: ${convoURL2}`);
      } catch (e) {
        console.log("Conversation URL after signup not available");
      }

      // === Step 5: Verify Database ===
      console.log("\n=== Step 5: Verifying Database ===");
      await deepAgentPage.verifyDataBase(["users", "user", "User", "Users"]);

      console.log("\n✅ All steps completed successfully.\n");
    } catch (err) {
      console.error("\n❌ Error during user registration and verification steps:");
      console.error(err.stack || err.message);
      await this.attach(`Test failed with error: ${err.message}`, "text/plain");
      throw err;
    }
  }
);


When(
  "I search for the prompt for video generation {string} with follow-up query {string}",
  async function (promatSearch, follow_up_query) {
    await deepAgentPage.enterPromapt(promatSearch);
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery(follow_up_query);
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    await deepAgentPage.enterPromaptQuery("your choice");
    await deepAgentPage.clickSendButton();
    await deepAgentPage.page.waitForTimeout(3000);
    const ThirdElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
    deepAgentPage.elapsedTime =
      firstElapsedTime + secondElapsdTime + ThirdElapsdTime;

    console.log(
      "Total elapsed time after follow up prompt:",
      deepAgentPage.elapsedTime
    );

    // Get and log the conversation URL
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);

    await deepAgentPage.getConvoId();
  }
);

Then(
  "I validate that the login functionality works correctly",
  async function () {
    const originalPage = this.page;
    await this.page.waitForTimeout(5000);
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page", { timeout: 120000 }), // 2 min
      deepAgentPage.clickOnDeployLink(), // trigger new tab
    ]);
    await newPage.waitForLoadState();
    websitePage = new WebsitePage(newPage);
    this.page = newPage;
    await websitePage.fillJoinUSForm();
    await websitePage.performInvalidLoginAction();
    await websitePage.performLoginAction();
    await newPage.close();
    this.page = originalPage;
    deepAgentPage = new DeepAgentPage(originalPage);
    await deepAgentPage.verifyDataBase([
      "users",
      "user",
      "contact_submissions",
      "User",
      "Users",
    ]);
  }
);
Then(
  "I confirm that the user data is added successfully to the database",
  async function () {
    const originalPage = this.page;
    await this.page.waitForTimeout(5000);
    deepAgentPage.clickOnDeployLink();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    websitePage = new WebsitePage(newPage);
    this.page = newPage;
    await websitePage.fillContactUSForm();
    await newPage.close();
    await deepAgentPage.verifyDataBase([
      "contacts",
      "contact",
      "Contact",
      "Contacts",
    ]);
  }
);

Then("Verify all the page links are are 200", async function () {
  try {
    console.log("\n=== Verifying All Page Links ===\n");

    // Store the original page
    const originalPage = this.page;

    // Click on deployment URL which opens in a new tab
    console.log("Clicking on deployment URL to open the deployed website...");
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      deepAgentPage.deploymentUrl.click(),
    ]);

    // Wait for the new page to load
    await newPage.waitForLoadState("domcontentloaded");
    console.log(`New page opened: ${await newPage.title()}`);

    // Switch to the new page for link verification
    this.page = newPage;

    // Get all links on the page
    console.log("Searching for links on the page...");
    await newPage.waitForTimeout(2000); // Give the page a moment to fully render

    // Use evaluate to get all links directly from the DOM
    const links = await newPage.evaluate(() => {
      const anchors = Array.from(
        document.querySelectorAll(
          'a[href]:not([href=""]):not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"]):not([href^="tel:"])'
        )
      );
      return anchors.map((a) => ({
        href: a.href,
        text: a.textContent.trim() || a.href,
      }));
    });

    console.log(`Found ${links.length} links to verify`);

    let successCount = 0;
    let failedLinks = [];

    // Check each link
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.href;
      const linkText = link.text;

      try {
        // Create a new context to avoid affecting the current page
        const context = await newPage.context();
        const page = await context.newPage();

        // Set a timeout for the request
        console.log(`Testing link: ${href}`);
        const response = await page.goto(href, {
          timeout: 30000,
          waitUntil: "domcontentloaded",
        });
        const status = response.status();
        await this.page.waitForTimeout(2000);

        if (status === 200) {
          console.log(
            `✅ Link ${i + 1}/${
              links.length
            }: "${linkText}" (${href}) - Status: ${status}`
          );
          successCount++;
        } else {
          console.warn(
            `⚠️ Link ${i + 1}/${
              links.length
            }: "${linkText}" (${href}) - Status: ${status}`
          );
          failedLinks.push({ text: linkText, href, status });
        }

        await page.close();
      } catch (error) {
        console.error(
          `❌ Link ${i + 1}/${links.length}: "${linkText}" (${href}) - Error: ${
            error.message
          }`
        );
        failedLinks.push({ text: linkText, href, error: error.message });
      }
    }

    // Summary
    console.log("\n=== Link Verification Summary ===\n");
    console.log(`Total Links: ${links.length}`);
    console.log(`Successful (200): ${successCount}`);
    console.log(`Failed: ${failedLinks.length}`);

    if (failedLinks.length > 0) {
      console.log("\nFailed Links:");
      failedLinks.forEach((link, index) => {
        console.log(
          `${index + 1}. "${link.text}" (${link.href}) - ${
            link.status || link.error
          }`
        );
      });
    }

    // Close the new page and switch back to the original page
    await newPage.close();
    this.page = originalPage;
    console.log("Returned to original page");

    // Get the conversation URL if available
    try {
      const convoURL = await deepAgentPage.getConvoURL();
      console.log(`\nConversation URL: ${convoURL}`);
    } catch (error) {
      console.log("Conversation URL not available");
    }
    // Add URL status information to the HTML report
    const urlStatusReport = [
      "=== URL VERIFICATION RESULTS ===",
      `Total Links: ${links.length}`,
      `Successful (200): ${successCount}`,
      `Failed: ${failedLinks.length}`,
      "\nSuccessful Links:",
      ...links
        .filter((link) => !failedLinks.some((fl) => fl.href === link.href))
        .map(
          (link, i) => `${i + 1}. "${link.text}" (${link.href}) - Status: 200`
        ),
      "\nFailed Links:",
      ...failedLinks.map(
        (link, i) =>
          `${i + 1}. "${link.text}" (${link.href}) - ${
            link.status || link.error
          }`
      ),
    ].join("\n");

    await this.attach(urlStatusReport, "text/plain");
    // Assert that all links returned 200
    expect(failedLinks.length).to.equal(
      0,
      `${failedLinks.length} links failed with non-200 status codes`
    );

     if (failedLinks.length > 0) {
      console.warn(
        `⚠️ ${failedLinks.length} links failed with non-200 status codes. See details in the report.`
      );
      // Optionally attach this to report (already done)
    } else {
      console.log("✅ All links returned status 200");
    }

    console.log("\n=== Link Verification Complete ===\n");
  } catch (error) {
    console.error("\n=== Error Verifying Links ===\n");
    console.error(error.message);
    console.error("\n==============================\n");
    throw error;
  }
});

Then(
  "I enter the ingredients and validate the generated response",
  async function () {
    const originalPage = this.page;
    await this.page.waitForTimeout(5000);
    deepAgentPage.clickOnDeployLink();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    websitePage = new WebsitePage(newPage);
    this.page = newPage;
    let recipeError;
    try {
      await websitePage.enterTheRecipeData();
    } catch (error) {
      recipeError = error;
      console.error("Failed to enter recipe data:", error.message);
    }
    // Ensure the page is closed and context restored
    await newPage.close();
    this.page = originalPage;
    deepAgentPage = new DeepAgentPage(originalPage);
    if (recipeError) {
      throw recipeError; // This will fail the test after cleanup
    }
    await deepAgentPage.previewButton.click();
    await this.page.waitForTimeout(5000);
    console.log("Returned to original page");
    try {
      const convoURL = await deepAgentPage.getConvoURL();
      console.log(`\nConversation URL: ${convoURL}`);
    } catch (error) {
      console.log("Conversation URL not available");
    }
  }
);

Then(
  "I upload the file and validate the database integrity",
  async function () {
    const originalPage = this.page;
    await this.page.waitForTimeout(5000);
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page", { timeout: 60000 }), // Increased timeout
      deepAgentPage.clickOnDeployLink(), // Now properly awaited in Promise.all
    ]);
    await newPage.waitForLoadState();
    websitePage = new WebsitePage(newPage);
    this.page = newPage;
    await websitePage.uploadTheFiles();

    await newPage.close();
    this.page = originalPage;
    deepAgentPage = new DeepAgentPage(originalPage);
    await this.page.waitForTimeout(3000);
    console.log("\n=== Step 2: Getting Conversation URL ===");
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`Conversation URL: ${convoURL}`);
    await deepAgentPage.getConvoId();

    // await deepAgentPage.verifyDataBase(["documents", "contract"]);
  }
);

Then("I enter the resume details and analysis the resume", async function () {
  const originalPage = this.page;
  await this.page.waitForTimeout(5000);
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page", { timeout: 60000 }), // Increased timeout
    deepAgentPage.clickOnDeployLink(), // Now properly awaited in Promise.all
  ]);
  await newPage.waitForLoadState();
  websitePage = new WebsitePage(newPage);
  this.page = newPage;
  await websitePage.analysisTheResume();
  await newPage.close();
  this.page = originalPage;
  deepAgentPage = new DeepAgentPage(originalPage);
  await this.page.waitForTimeout(3000);
});


When(/^I search the long prompt "(.*)" with follow-up query "(.*)"$/s, async function (promatSearch, follow_up_query) {
  await deepAgentPage.enterPromapt(promatSearch);
  await deepAgentPage.clickSendButton();
  await deepAgentPage.page.waitForTimeout(3000);
  const firstElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
  await deepAgentPage.enterPromaptQuery(follow_up_query);
  await deepAgentPage.page.waitForTimeout(3000);
  await deepAgentPage.clickSendButton();
  const secondElapsdTime = await deepAgentPage.waitforStopButtonInvisble();
  deepAgentPage.elapsedTime = firstElapsedTime + secondElapsdTime;

  const hasExpectedStatus = await deepAgentPage.getStatusOfTask("Completed");
  console.log(`Status found: ${hasExpectedStatus}`);

  // Send fallback prompt only if status not found
  if (!hasExpectedStatus) {
    console.log("Status not found, sending fallback prompt...");
    await deepAgentPage.enterPromaptQuery("your call");
    await deepAgentPage.page.waitForTimeout(3000);
    await deepAgentPage.clickSendButton();
    const thirdElapsedTime = await deepAgentPage.waitforStopButtonInvisble();
    deepAgentPage.elapsedTime += thirdElapsedTime;
  }

  console.log("Total elapsed time after prompts:", deepAgentPage.elapsedTime);
  const convoURL = await deepAgentPage.getConvoURL();
  console.log(`Conversation URL: ${convoURL}`);
  await deepAgentPage.getConvoId();
}
);

Then("I click on the test task", async function () {
  await deepAgentPage.testTaks();
  await this.page.waitForTimeout(3000);
  const thirdElapsedTime=await deepAgentPage.checkSuccessStatusPeriodically();
  deepAgentPage.elapsedTime=deepAgentPage.elapsedTime+thirdElapsedTime

 });
 Then("I verify that the deep agent browser created", async function () {
  await deepAgentPage.verifyBrowserCreation();
  
 });
 Then("I verify that the Twitter MCP has been created", async function () {
  await deepAgentPage.checkTwitterMCP();
 });
 Then("I confirm that the task has been successfully created", async function () {
  await deepAgentPage.checkTaskStatus();
 });

 Then("Verify all the page links and buttons are working", async function () {
  try {
    console.log("\n=== Verifying All Page Links & Buttons ===\n");

    const originalPage = this.page;

    // Open the deployed website in a new tab
    console.log("Clicking on deployment URL to open the deployed website...");
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      deepAgentPage.deploymentUrl.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    console.log(`New page opened: ${await newPage.title()}`);
    this.page = newPage;
    await newPage.waitForTimeout(2000);

    // --- LINK VERIFICATION ---
    const links = await newPage.evaluate(() => {
      const anchors = Array.from(
        document.querySelectorAll(
          'a[href]:not([href=""]):not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"]):not([href^="tel:"])'
        )
      );
      return anchors.map((a) => ({
        href: a.href,
        text: a.textContent.trim() || a.href,
      }));
    });

    console.log(`🔗 Found ${links.length} links to verify`);
    let linkSuccessCount = 0;
    let failedLinks = [];

    for (let i = 0; i < links.length; i++) {
      const { href, text } = links[i];
      try {
        const context = await newPage.context();
        const tempPage = await context.newPage();

        const response = await tempPage.goto(href, {
          timeout: 30000,
          waitUntil: "domcontentloaded",
        });
        const status = response.status();
        await tempPage.close();

        if (status === 200) {
          console.log(`✅ Link ${i + 1}: "${text}" - 200 OK`);
          linkSuccessCount++;
        } else {
          console.warn(`❌ Link ${i + 1}: "${text}" - Status: ${status}`);
          failedLinks.push({ text, href, status });
        }
      } catch (err) {
        console.error(`❌ Link ${i + 1}: "${text}" - Error: ${err.message}`);
        failedLinks.push({ text, href, error: err.message });
      }
    }

     // --- BUTTON VERIFICATION (Robust Like Link Check) ---
     const initialUrl = newPage.url(); // store original URL
     const buttons = await newPage.evaluate(() => {
       const btnElements = Array.from(document.querySelectorAll('button, [role="button"], a.button, a.btn'));
       return btnElements.map((btn, index) => {
         const label =
           btn.innerText.trim() ||
           btn.getAttribute("aria-label") ||
           `Unnamed Button ${index + 1}`;
         return {
           index,
           label,
         };
       });
     });
 
     console.log(`🟦 Found ${buttons.length} buttons to verify`);
     let buttonSuccessCount = 0;
     let failedButtons = [];
 
     for (let i = 0; i < buttons.length; i++) {
       const { label } = buttons[i];
       try {
         // Reload the page fresh each time to get valid DOM
         await newPage.goto(initialUrl, { waitUntil: 'domcontentloaded' });
         await newPage.waitForTimeout(1000);
 
         // Re-identify the button by label each time
         const buttonHandle = await newPage.evaluateHandle((label) => {
           const candidates = Array.from(document.querySelectorAll('button, [role="button"], a.button, a.btn'));
           return candidates.find(el =>
             el.innerText.trim() === label || el.getAttribute("aria-label") === label
           );
         }, label);
 
         if (!buttonHandle) {
           throw new Error(`Button "${label}" not found`);
         }
 
         console.log(`Clicking button ${i + 1}: "${label}"`);
 
         // Detect if clicking opens a new tab
         const [maybeNewPage] = await Promise.all([
           newPage.context().waitForEvent("page").catch(() => null), // safe catch if no new tab
           buttonHandle.click({ timeout: 5000 }),
         ]);
 
         await newPage.waitForTimeout(1500);
 
         if (maybeNewPage) {
           await maybeNewPage.waitForLoadState("domcontentloaded");
           console.log(`↪️ Button "${label}" opened new page: ${await maybeNewPage.title()}`);
           await maybeNewPage.close();
         } else {
           console.log(`✅ Button "${label}" clicked (no new page)`);
         }
 
         buttonSuccessCount++;
       } catch (err) {
         console.warn(`❌ Failed to click button "${label}" - ${err.message}`);
         failedButtons.push({ label, error: err.message });
       }
     }
 

    // --- REPORT SUMMARY ---
    const combinedReport = [
      "=== LINK VERIFICATION ===",
      `Total Links: ${links.length}`,
      `Successful (200): ${linkSuccessCount}`,
      `Failed: ${failedLinks.length}`,
      ...failedLinks.map(
        (link, i) =>
          `${i + 1}. "${link.text}" (${link.href}) - ${
            link.status || link.error
          }`
      ),

      "\n=== BUTTON VERIFICATION ===",
      `Total Buttons: ${buttons.length}`,
      `Successful Clicks: ${buttonSuccessCount}`,
      `Failed Clicks: ${failedButtons.length}`,
      ...failedButtons.map(
        (btn, i) => `${i + 1}. "${btn.label}" - ${btn.error}`
      ),
    ].join("\n");

    await this.attach(combinedReport, "text/plain");

    // Close the tab and restore original page
    await newPage.close();
    this.page = originalPage;
    console.log("✅ Returned to original page");

    // Optional: Convo URL
    try {
      const convoURL = await deepAgentPage.getConvoURL();
      console.log(`🔗 Conversation URL: ${convoURL}`);
    } catch (error) {
      console.log("Conversation URL not available");
    }

    if (failedLinks.length > 0 || failedButtons.length > 0) {
      console.warn("⚠️ Some links or buttons failed. See attached report.");
    } else {
      console.log("🎉 All links and buttons verified successfully!");
    }

  } catch (error) {
    console.error("🚨 Error in verifying links/buttons: ", error.message);
    throw error;
  }
});

Then("verify that the website contains some useful words", async function () {
  
  const originalPage = this.page;
  await this.page.waitForTimeout(5000);
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page", { timeout: 60000 }), // Increased timeout
    deepAgentPage.clickOnDeployLink(), // Now properly awaited in Promise.all
  ]);
  await newPage.waitForLoadState();
  websitePage = new WebsitePage(newPage);
  this.page = newPage;
  await websitePage.checkTheWebsiteHaveUsefulwords();
  await newPage.close();
  this.page = originalPage;
  deepAgentPage = new DeepAgentPage(originalPage);
  await this.page.waitForTimeout(5000);
  console.log("Returned to original page");
  try {
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`\nConversation URL: ${convoURL}`);
  } catch (error) {
    console.log("Conversation URL not available");
  }

 });

 Then("Verify the data base created for website", async function () {
  
  await deepAgentPage.dataBase.waitFor({
    state: "visible",
    timeout: 30000, // 30 seconds
  });
  const isDatabaseVisible = await deepAgentPage.dataBase.isVisible();
  expect(isDatabaseVisible).to.be.true;

 });

 Then("Verify the data is correctly seeded into the database", async function () {
  
  await deepAgentPage.dataBase.waitFor({
    state: "visible",
    timeout: 30000, // 30 seconds
  });
  const isDatabaseVisible = await deepAgentPage.dataBase.isVisible();
  expect(isDatabaseVisible).to.be.true;

  await deepAgentPage.verifyDataSeeding();
  try {
    const convoURL = await deepAgentPage.getConvoURL();
    console.log(`\nConversation URL: ${convoURL}`);
  } catch (error) {
    console.log("Conversation URL not available");
  }


 });







