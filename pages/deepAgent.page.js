import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { expect } from "chai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class DeepAgentPage {
  constructor(page) {
    this.page = page;
    this.chekoutButton = page.locator(
      '//button[contains(text(), "Check it out")]'
    );
    this.searchPromaptTextArea = page.locator('textarea[dir*="auto"]');
    this.sendButton = page.locator('button [data-icon*="paper-plane"]');
    this.maxLimitTask = page.locator(
      "[class*='space-y-2 flex flex-col items-center']"
    );
    this.stopButton = page.locator('[class*="animate-spin"]');
    this.specifyTextField = page.locator(
      'textarea[placeholder*="Specify any updates"]'
    );
    this.statusOftask = page.locator('//div[contains(text(), "Completed")]');
    this.computePoint = page.locator('div[class*="underline cursor-pointer"]');
    this.downloadPath = path.join(__dirname, "../downloadfile");
    this.fileDownlaod = page.locator(
      '[class*="svg-inline--fa fa-file text-bwleftblue"]+span'
    );
    this.viewFile = page.locator('[class*="file-magnifying-glass"]');
    this.fileBrowserDownlaod = page.locator(
      '[role="dialog"] [data-icon*="download"]'
    );

    this.selectOptionDropDown = page.locator('button[role*="combobox"]');
    this.AllSampleTaskDefault = page
      .locator('button[role*="combobox"] + select option')
      .first();

    this.browserPopup = page.locator(
      '[data-state="open"] [data-icon*="xmark"]'
    );
    // search
    this.searchToolstask = page.locator(
      '//div[@dir="auto"] //span[contains(text(), "Searching")]'
    );
    // source link
    this.sourceName = page.locator('article div[class*="flex items-center"]');
    //source data
    this.sourceFetchData = page.locator(
      'section[class*="w-full group"] div[class*="first-letter:uppercase"]'
    );

    this.ResponseSearchedText = page.locator(
      '//div[contains(@class,"prose dark:prose-invert markdown")]/div/following::p'
    );

    this.monoTextpropamt = page.locator('//*[contains(@class,"font-mono")]');

    this.sampleTaskDeafaultElement = page.locator(
      '[class*="flex flex-col items-start self-stretch"]'
    );

    this.SampleTaskText = page.locator(
      '[class*="flex flex-col items-start self-stretch"] div[class*="font-normal flex items-center"]'
    );
    this.sampleTaskDialogePopup = page.locator('[role*="dialog"]');

    this.cancelButton = page.locator(
      '//div[@role="dialog"]//button[contains(text(),"Cancel")]'
    );
    this.tryItButton = page.locator(
      '//div[@role="dialog"]//button[contains(text(),"Try it")]'
    );

    this.newConversionButton = page.locator('[class*="pen-to-square"]');

    this.folderIcon = page.locator('[data-state="open"] [data-icon*="folder"]');

    this.zipIcon = page.locator('[data-icon*="download"]+span');

    this.systemcommands = page.locator('[class*="break-words break-word"]');

    this.submitButton = page.locator('button[type*="submit"]');

    this.dropDown = page.locator("[role*='combobox']");

    // this.CreatedChatBotlink = page.locator("a[href*='https://apps.']");
    this.CreatedChatBotlink = page.locator("(//a[contains(@href, 'apps.abacus.ai')])[1]");
    this.previewWebPage = page.locator("[data-icon*='globe-pointer']");
    this.dataBase = page.locator("[data-icon*='database']");
    this.previewButton = page.locator("[data-icon='play']");
    this.datBaseVisible = page.locator("//span[text()='Export CSV']");

    this.agentTitle = page.locator("#complex_agent__title");

    this.deployOption = page.locator(
      "//span[contains(@class, 'whitespace-nowrap')  and contains(text(), 'Deploy')]"
    );
    this.deploymentName = page.locator("input[class*='flex-1 text-darkcolor']");

    this.deploymentUrl = page.locator("//*[text()='Deployed URL:']//following-sibling::div/a");

    this.deployButton = page.locator(
      "//button[contains(@class, 'inline-flex') and contains(@class, 'bg-bwleftblue') and contains(text(), 'Deploy')]"
    );
    this.deploysucessmessage = page.locator(
      "//div[contains(text(), 'Deployment successful')]"
    );

    this.deployLink = page.locator(
      "//span[contains(text(),'Deployed URL')]/..//a"
    );
    this.analyticsLink = page.locator(
      "//*[contains(@class,'flex items-center')]//following::*[contains(text(), 'Analytics')]"
    );
    this.calculator = page.locator(
      "//*[contains(@class,'flex items-center')]//following::*[contains(text(), 'Calculator')]"
    );
    this.calender = page.locator(
      "//*[contains(@class,'flex items-center')]//following::*[contains(text(), 'Calendar')]"
    );
    this.setting = page.locator(
      "//*[contains(@class,'flex items-center')]//following::*[contains(text(), 'Settings')]"
    );

    // downalod button from agent computer

    this.flexTypeFile = page.locator("[id*='rc'] [role='combobox'] span");

    this.fileTypeOptions = page.locator("[role='option']");

    this.computerFileDownloadOption = page.locator(
      "[id*='rc:'] [data-icon*='download']"
    );
    this.spinLoadForFile = page.locator("[class*='block pointer']");

    this.pdfFileIcon = page.locator("[data-icon*='file-pdf']");
    this.pptxFileIcon = page.locator("[data-icon*='file-powerpoint']");
    this.arrowsRotate = page.locator("[class*='fa-spin']");

    this.chatImage = page.locator("[class='recharts-layer recharts-pie']");

    // video gerneration
    this.videoGenerationPreview = page.locator(
      "(//span[contains(text(), 'Preview Video')])[1]"
    );
    this.videoGenerationLink = page.locator(
      "a[href*='https://cdn.abacus.ai/video']"
    );
    this.videoGenerationDownload = page.locator(
      "[data-icon*='arrow-down-to-line']"
    );

    this.htmlCode = page.locator("(//span[.='html'])[1]");

    //  Perform the registration process-
    this.signUpButton = page.locator("(//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sign up')])[1]");
    this.nameField = page.locator("//*[@id='fullName' or (@id='name') or contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'full name')]");
    this.emailField = page.locator("//*[translate(@id, 'EMAIL', 'email') = 'email' or contains(translate(@placeholder, 'EMAIL', 'email'), 'email')]");
    this.passwordField = page.locator("(//*[@type='password'])[1]");
    this.confirmPasswordField = page.locator("(//*[@type='password'])[2]");

    this.createAccountButton = page.locator("[type='submit']");

    this.dropDownForDB = page.locator("//span[contains(text(),'Table')]//following::button[@role='combobox']");
    this.refreshButton = page.locator(
      "[class*='center border-b'] svg[data-icon='arrows-rotate']"
    );

    this.userAdded = page.locator("//*[text()='testuser@gmail.com']");


    //Daemons locators
    this.taskMenu=page.locator("(//*[@aria-haspopup='menu'])[1]");
    this.taskOptions=page.locator("[role='menuitem']")
    this.testTask=page.locator("//*[text()='Test Task']");
    this.browser=page.locator("//*[text()='Browser']");
    this.successStatus = page.locator("[data-icon='thumbs-up']");
    this.newSession= page.locator("[data-icon='pen-to-square']");
    this.taskButton= page.locator("//*[text()='Tasks']");
    this.reservationTask= page.locator("//*[contains(text(),'View Results')]");
    this.browserUse= page.locator("//*[text()='Browser']")
    this.gmailTool= page.locator("//*[contains(text(),'gmail_tool')]")
    this.twitterMCPTool= page.locator("//*[text()='twitter-mcp_post_tweet output']");


    // new locators
    this.dropdownOptions = page.locator('[role*="option"]');
    this.rowPresent= page.locator("(//*[@role='row'])[1]");

    this.elapsedTime = 0;
  }

  async clickCheckoutButton() {
    // await this.chekoutButton.waitFor({ state: "visible" });
    // await this.chekoutButton.click();
    await this.chekoutButton.waitFor({ state: "visible", timeout: 10000 });
    const isEnabled = await this.chekoutButton.isEnabled();
    if (!isEnabled) {
      throw new Error("Checkout button is visible but not enabled");
    }
    await this.chekoutButton.click();
  }

  async enterPromapt(promat_user_search) {
    await this.searchPromaptTextArea.fill(promat_user_search);
  }

  async enterPromaptQuery(follow_up_query) {
    await this.specifyTextField.click();
    await this.specifyTextField.fill(follow_up_query);
  }

  async clickSendButton() {
    await this.sendButton.waitFor({ state: "visible" });
    await this.sendButton.click();
  }

  async selectTheElementFromDropDown(label) {
    await this.submitButton.waitFor({ state: "visible" });
    await this.dropDown.waitFor({ state: "visible" });
    try {
      await this.dropDown.click();
      await this.page.waitForTimeout(2000);
      const selectElement = this.page.locator("select");
      // Ensure select is visible and attached before selecting
      await selectElement.waitFor({ state: "visible" });
      await selectElement.selectOption({ label: label });
      const selected = await selectElement.inputValue();
      await this.page.keyboard.press("Enter");
      console.log("Selected value:", selected);
      await this.page.waitForTimeout(1000);
      await this.submitButton.click();
    } catch (error) {
      console.error("Dropdown selection failed:", error);
    }
  }

  async waitforStopButtonInvisble() {
    const startTime = Date.now();
    const maxWaitTime = 30000000; // 50 minutes in milliseconds
    const checkInterval = 10000; // Check every 10 seconds
    let isVisible = true;
    // let elapsedTime = 0;
    while (isVisible && Date.now() - startTime < maxWaitTime) {
      try {
        // Check if the button is visible with a short timeout
        isVisible = await this.stopButton.isVisible({ timeout: 1000 });
        if (!isVisible) {
          // Button is no longer visible, exit the loop
          this.elapsedTime = Date.now() - startTime;
          break;
        }
        // Log status every 30 seconds for debugging
        this.elapsedTime = Date.now() - startTime;
        if (this.elapsedTime % 30000 < checkInterval) {
          console.log(
            `Stop button still visible after ${Math.floor(
              this.elapsedTime / 1000
            )} seconds. Continuing to wait...`
          );
        }
        // Wait for the check interval before checking again
        await this.page.waitForTimeout(checkInterval);
      } catch (error) {
        // If error occurs (like element not found), assume button is not visible
        console.log(`Error checking stop button visibility: ${error.message}`);
        isVisible = false;
        this.elapsedTime = Date.now() - startTime;
        break;
      }
    }
    // Final verification that button is hidden
    try {
      await this.stopButton.waitFor({ state: "hidden", timeout: 5000 });
    } catch (error) {
      console.log(`Final verification failed: ${error.message}`);
    }
    // Convert elapsedTime to seconds
    const elapsedTimeInSeconds = this.elapsedTime / 1000;
    console.log(
      `Stop button became invisible after ${elapsedTimeInSeconds} seconds`
    );
    return elapsedTimeInSeconds; // Return elapsed time in seconds for JSON report
  }

  async getStatusOfTask(expectedStatus) {
    try {
      // Wait for any matching status elements to be visible
      await this.statusOftask
        .first()
        .waitFor({ state: "visible", timeout: 5000 });

      // Get count of status elements
      const count = await this.statusOftask.count();

      console.log("\n=== Task Status Details ===");
      console.log(`Expected Status: ${expectedStatus}`);
      console.log(`Number of status elements found: ${count}`);

      // Check all status elements
      for (let i = 0; i < count; i++) {
        const actualStatus = await this.statusOftask.nth(i).textContent();
        console.log(`Status ${i + 1}: ${actualStatus.trim()}`);

        // Return true if any status matches expected
        if (actualStatus.trim() === expectedStatus) {
          console.log(`Match found at element ${i + 1}`);
          console.log("====\n");
          return true;
        }
      }

      console.log("No matching status found");
      console.log("====\n");
      return false;
    } catch (error) {
      console.error("\n=== Task Status Error ===");
      console.error(`Expected Status: ${expectedStatus}`);
      console.error("Actual Status: Not Found");
      console.error(`Error Message: ${error.message}`);
      console.error("====\n");
      return false;
    }
  }

  async getComputePoint() {
    try {
      // Wait for at least one compute point element to be visible with increased timeout
      await this.computePoint
        .first()
        .waitFor({ state: "visible", timeout: 10000 })
        .catch((error) => {
          console.warn(
            "Warning: Compute point element not immediately visible, continuing anyway"
          );
        });

      // Get the count of compute point elements
      const count = await this.computePoint.count();
      console.log(`Found ${count} compute point elements`);

      // If no elements found, return 0
      if (count === 0) {
        console.warn("No compute point elements found");
        return 0;
      }
     
    await this.computePoint.first().scrollIntoViewIfNeeded();
    console.log("Scrolled to first compute point element");


      // Sum up all compute points from all elements
      let totalPoints = 0;
      for (let i = 0; i < count; i++) {
        const pointsText = await this.computePoint.nth(i).textContent();
        console.log(`Element ${i + 1} text: "${pointsText}"`);

        // Extract the number using regex to be more robust
        const pointsMatch = pointsText.match(/(\d[\d,]*)/);

        if (pointsMatch && pointsMatch[1]) {
          // Remove commas and convert to number
          const points = parseInt(pointsMatch[1].replace(/,/g, ""), 10);

          if (!isNaN(points)) {
            totalPoints += points;
            console.log(
              `Added ${points} points from element ${
                i + 1
              }, running total: ${totalPoints}`
            );
          } else {
            console.warn(
              `Could not parse points from element ${i + 1}: "${pointsText}"`
            );
          }
        } else {
          console.warn(`No number found in element ${i + 1}: "${pointsText}"`);
        }
      }

      console.log(`Total compute points (sum of all elements): ${totalPoints}`);
      return totalPoints;
    } catch (error) {
      console.error("Error in getComputePoint:", error.message);
      console.error(error.stack);
      // Return a default value instead of 0 to make it clear there was an error
      return -1;
    }
  }

  async downloadFile() {
    try {
      // First check if any download buttons exist at all
      const downloadButtonCount = await this.fileDownlaod.count();
      console.log(`Found ${downloadButtonCount} download buttons`);

      if (downloadButtonCount === 0) {
        console.log("No download buttons found - skipping download");
        return false;
      }

      // Create download directory if it doesn't exist
      await fs.mkdir(this.downloadPath, { recursive: true });

      // Try clicking the last button first (most common case)
      const lastIndex = downloadButtonCount - 1;
      console.log(
        `First attempting last download button (${
          lastIndex + 1
        } of ${downloadButtonCount})`
      );

      try {
        // Make sure button is in viewport
        await this.fileDownlaod.nth(lastIndex).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000); // Longer delay after scrolling

        // Set up download promise
        const downloadPromise = Promise.race([
          this.page.waitForEvent("download", { timeout: 30000 }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Download timeout")), 30000)
          ),
        ]);

        // Click with force option to ensure click happens
        console.log(`Clicking last download button (${lastIndex + 1})`);
        await this.fileDownlaod
          .nth(lastIndex)
          .click({ force: true, timeout: 10000 });

        // Now wait for the download
        const download = await downloadPromise.catch((error) => {
          console.error(`Download failed for last button:`, error.message);
          return null;
        });

        if (download) {
          // Get the suggested filename
          const suggestedFileName = download.suggestedFilename();
          if (suggestedFileName) {
            // Create the full path for download
            const downloadPath = path.join(
              this.downloadPath,
              suggestedFileName
            );

            // Save the file with timeout
            await Promise.race([
              download.saveAs(downloadPath),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Save timeout")), 30000)
              ),
            ]);

            console.log(
              `File downloaded successfully to: ${downloadPath} from last button`
            );
            return true; // Success with last button
          }
        }
      } catch (lastButtonError) {
        console.error(
          "Error with last button, will try all buttons:",
          lastButtonError.message
        );
      }

      // If last button didn't work, try all buttons from first to last
      for (let i = 0; i < downloadButtonCount; i++) {
        try {
          console.log(
            `Attempting to download file from button ${
              i + 1
            } of ${downloadButtonCount}`
          );

          // Make sure button is in viewport
          await this.fileDownlaod.nth(i).scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(1000); // Longer delay after scrolling

          // Set up download promise
          const downloadPromise = Promise.race([
            this.page.waitForEvent("download", { timeout: 30000 }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Download timeout")), 30000)
            ),
          ]);

          // Click with force option to ensure click happens
          console.log(`Clicking download button ${i + 1}`);
          await this.fileDownlaod.nth(i).click({ force: true, timeout: 10000 });

          // Now wait for the download
          const download = await downloadPromise.catch((error) => {
            console.error(
              `Download failed for button ${i + 1}:`,
              error.message
            );
            return null;
          });

          if (!download) {
            console.log(
              `No download triggered from button ${
                i + 1
              }, trying next if available`
            );
            continue;
          }

          // Get the suggested filename
          const suggestedFileName = download.suggestedFilename();
          if (!suggestedFileName) {
            console.error(
              `No filename suggested for download from button ${i + 1}`
            );
            continue;
          }

          // Create the full path for download
          const downloadPath = path.join(this.downloadPath, suggestedFileName);

          // Save the file with timeout
          await Promise.race([
            download.saveAs(downloadPath),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Save timeout")), 30000)
            ),
          ]);

          console.log(
            `File downloaded successfully to: ${downloadPath} from button ${
              i + 1
            }`
          );
          return true; // Return true on first successful download
        } catch (buttonError) {
          console.error(
            `Error processing download button ${i + 1}:`,
            buttonError.message
          );
          // Continue to next button
        }
      }

      console.log("All download attempts failed");
      return false;
    } catch (error) {
      console.error("Error in downloadFile:", error.message);
      // Log additional details for debugging
      console.error("Error details:", {
        type: error.name,
        stack: error.stack,
      });
      return false;
    }
  }

  async downloadFilesFromViewer() {
    try {
      await this.viewFile.first().waitFor({ state: "visible", timeout: 3000 });
      const viewFileCount = await this.viewFile.count();
      console.log(`Found ${viewFileCount} view file buttons`);

      if (viewFileCount === 0) {
        console.log(
          "No view file buttons found - skipping file viewer downloads"
        );
        return false;
      }

      // Try to click the last view file button (most recent one)
      const lastIndex = viewFileCount - 1;
      console.log(`Attempting to click view file button at index ${lastIndex}`);

      try {
        // Make sure button is in viewport
        await this.viewFile.nth(lastIndex).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);

        // Click with force option and increased timeout
        await this.viewFile
          .nth(lastIndex)
          .click({ force: true, timeout: 10000 });

        // Wait for dialog to appear
        await this.page.waitForTimeout(2000);
      } catch (clickError) {
        console.error(`Error clicking view file button: ${clickError.message}`);
        return false;
      }

      // Check if download buttons are visible with a short timeout
      let isDownloadButtonVisible = false;
      try {
        const browserDownloadCount = await this.fileBrowserDownlaod.count();
        console.log(`Found ${browserDownloadCount} browser download buttons`);
        isDownloadButtonVisible = browserDownloadCount > 0;
      } catch (error) {
        console.log(
          "Download buttons not visible - trying folder icon workflow"
        );
        isDownloadButtonVisible = false;
      }

      if (!isDownloadButtonVisible) {
        // Check for folder icons
        const folderIconsCount = await this.folderIcon.count();
        console.log(`Found ${folderIconsCount} folder icons`);

        if (folderIconsCount > 0) {
          try {
            // Click first folder icon
            await this.folderIcon.first().click();
            await this.page.waitForTimeout(2000);

            // Try to find and click zip icon
            const zipIconCount = await this.zipIcon.count();
            console.log(`Found ${zipIconCount} zip icons`);

            if (zipIconCount > 0) {
              await this.zipIcon.first().click();

              // Wait for download to start
              const download = await Promise.race([
                this.page.waitForEvent("download", { timeout: 10000 }),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Download timeout")), 10000)
                ),
              ]);

              const fileName = await download.suggestedFilename();
              const filePath = path.join(this.downloadPath, fileName);
              await download.saveAs(filePath);
              console.log(`Zip file downloaded to: ${filePath}`);
              return true;
            } else {
              console.log("No zip icons found after clicking folder");
            }
          } catch (folderError) {
            console.error(
              "Error in folder icon workflow:",
              folderError.message
            );
          }
        }
        return false;
      }

      // If we have download buttons, try to download each file
      const totalFiles = await this.fileBrowserDownlaod.count();
      console.log(`Found ${totalFiles} files to download`);

      let downloadSuccess = false;
      for (let i = 0; i < totalFiles; i++) {
        try {
          // Setup download promise
          const downloadPromise = Promise.race([
            this.page.waitForEvent("download", { timeout: 10000 }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Download timeout")), 10000)
            ),
          ]);

          // Make sure button is in viewport
          await this.fileBrowserDownlaod.nth(i).scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);

          // Click the download button
          console.log(`Clicking download button ${i + 1} of ${totalFiles}`);
          await this.fileBrowserDownlaod.nth(i).click({ force: true });

          // Wait for download to start with timeout
          const download = await downloadPromise.catch((error) => {
            console.error(
              `Download event failed for file ${i + 1}:`,
              error.message
            );
            return null;
          });

          if (!download) {
            console.log(`No download triggered for file ${i + 1}, continuing`);
            continue;
          }

          // Get filename and save file
          const fileName = download.suggestedFilename();
          if (!fileName) {
            console.error(`No filename suggested for file ${i + 1}`);
            continue;
          }

          const filePath = path.join(this.downloadPath, fileName);
          await download.saveAs(filePath);
          console.log(`File ${i + 1} downloaded to: ${filePath}`);
          downloadSuccess = true;

          // Small delay between downloads
          await this.page.waitForTimeout(1000);
        } catch (error) {
          console.error(`Error downloading file ${i + 1}:`, error.message);
          continue; // Skip to next file if one fails
        }
      }

      return downloadSuccess;
    } catch (error) {
      console.error("Error in downloadFilesFromViewer:", error.message);
      return false;
    }
  }

  async closeBrowserPopup() {
    try {
      const popupCount = await this.browserPopup.count();
      console.log(`Found ${popupCount} browser popups`);

      if (popupCount > 0) {
        console.log("Attempting to close browser popup");
        await this.browserPopup.first().click({ force: true, timeout: 5000 });
        console.log("Browser popup closed successfully");
        return true;
      } else {
        console.log("No browser popup found to close");
        return false;
      }
    } catch (error) {
      console.error("Error closing browser popup:", error.message);
      // Don't throw an error, just return false
      return false;
    }
  }

  async searchAndFetchAllResults() {
    try {
      const searchStartTime = new Date().getTime();
      await this.page.waitForSelector(
        'div[class*="flex"] div[class*="text-base font-medium"]',
        { state: "visible" }
      );

      let searchedName = "";

      // Get all matching elements
      const elements = await this.page.$$(
        'div[class*="flex"] div[class*="text-base font-medium"]'
      );

      if (elements.length > 0) {
        searchedName = await elements[0].textContent();
        searchedName = searchedName?.trim() || "";
        console.log(`Found searched name: ${searchedName}`);
      }

      if (!searchedName) {
        throw new Error("No valid searched name found");
      }

      const sanitizedFileName = searchedName
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();

      const jsonFilePath = path.join(
        __dirname,
        "../jsonReport",
        `${sanitizedFileName}.json`
      );

      const searchResults = [];

      // Check if search task elements are visible with a shorter timeout
      let hasSearchTasks = false;
      try {
        await this.searchToolstask
          .first()
          .waitFor({ state: "visible", timeout: 3000 });
        hasSearchTasks = true;
      } catch (error) {
        console.log("No searching field tasks found");
        hasSearchTasks = false;
      }

      if (!hasSearchTasks) {
        // Handle case when no search tasks are present
        const sources = [];
        const responses = [];

        // Try to get direct source content if available
        try {
          const sourceNameCount = await this.sourceName.count();
          const sourceFetchDataCount = await this.sourceFetchData.count();
          const maxCount = Math.max(sourceNameCount, sourceFetchDataCount);

          for (let j = 0; j < maxCount; j++) {
            let sourceNameText = null;
            let contentText = null;

            try {
              sourceNameText = await this.sourceName.nth(j).textContent();
              contentText = await this.sourceFetchData.nth(j).textContent();

              sources.push({
                sourceId: j + 1,
                sourceName: sourceNameText?.trim(),
                content: contentText?.trim(),
              });
            } catch (err) {
              console.error(`Error processing source ${j + 1}:`, err.message);
            }
          }
        } catch (err) {
          console.log("No direct sources found");
        }

        // Try to get response text if available
        try {
          await this.ResponseSearchedText.first().waitFor({
            state: "visible",
            timeout: 5000,
          });
          const responseCount = await this.ResponseSearchedText.count();

          for (let k = 0; k < responseCount; k++) {
            try {
              const responseText = await this.ResponseSearchedText.nth(
                k
              ).textContent();
              responses.push({
                paragraphId: k + 1,
                content: responseText.trim(),
              });
            } catch (err) {
              console.error(
                `Error capturing response text for paragraph ${k + 1}:`,
                err.message
              );
            }
          }
        } catch (err) {
          console.log("No response text found");
        }

        let reasonText = "";
        try {
          await this.monoTextpropamt.waitFor({
            state: "visible",
            timeout: 5000,
          });
          reasonText = await this.monoTextpropamt.textContent();
          console.log("Found reasoning text:", reasonText);
        } catch (err) {
          console.log("No reasoning text found from monoTextpropamt");
        }

        searchResults.push({
          searchNumber: 1,
          timestamp: new Date(),
          totalSources: sources.length,
          sources: sources,
          responses: {
            totalParagraphs: responses.length,
            captureDate: new Date(),
            paragraphs: responses,
          },
        });
      } else {
        const searchButtonCount = await this.searchToolstask.count();
        console.log(`Found ${searchButtonCount} search buttons`);
        console.log(`Using searched name for file: ${searchedName}`);

        for (let i = 0; i < searchButtonCount; i++) {
          await this.searchToolstask.nth(i).click();
          console.log(`Clicked search button ${i + 1}`);
          await this.page.waitForTimeout(2000);

          const sourceNameCount = await this.sourceName.count();
          const sourceFetchDataCount = await this.sourceFetchData.count();
          const maxCount = Math.max(sourceNameCount, sourceFetchDataCount);
          const sources = [];

          for (let j = 0; j < maxCount; j++) {
            let sourceNameText = null;
            let contentText = null;

            if (j < sourceNameCount) {
              try {
                sourceNameText = await this.sourceName.nth(j).textContent();
                sourceNameText = sourceNameText ? sourceNameText.trim() : null;
              } catch (err) {
                console.error(
                  `Error getting source name for index ${j}:`,
                  err.message
                );
              }
            }

            if (j < sourceFetchDataCount) {
              try {
                contentText = await this.sourceFetchData.nth(j).textContent();
                contentText = contentText ? contentText.trim() : null;
              } catch (err) {
                console.error(
                  `Error getting content for index ${j}:`,
                  err.message
                );
              }
            }

            if (sourceNameText !== null || contentText !== null) {
              sources.push({
                sourceId: j + 1,
                sourceName: sourceNameText,
                content: contentText,
              });
            }
          }
          searchResults.push({
            searchNumber: i + 1,
            timestamp: new Date(),
            totalSources: sources.length,
            sources: sources,
          });

          console.log(
            `Processed ${sources.length} sources for search ${i + 1}`
          );

          await this.ResponseSearchedText.first().waitFor({ state: "visible" });
          const responseCount = await this.ResponseSearchedText.count();
          const responses = [];

          for (let k = 0; k < responseCount; k++) {
            try {
              const responseText = await this.ResponseSearchedText.nth(
                k
              ).textContent();
              responses.push({
                paragraphId: k + 1,
                content: responseText.trim(),
              });
            } catch (err) {
              console.error(
                `Error capturing response text for paragraph ${k + 1}:`,
                err.message
              );
            }
          }

          searchResults[i].responses = {
            totalParagraphs: responseCount,
            captureDate: new Date(),
            paragraphs: responses,
          };
        }
      }

      // await this.waitforStopButtonInvisble();

      // Create directory if it doesn't exist
      await fs.mkdir(path.join(__dirname, "../jsonReport"), {
        recursive: true,
      });

      // Prepare response array - FIXED: Remove duplicates by using a Set
      const responseArray = [];
      const uniqueResponses = new Set();

      searchResults.forEach((result) => {
        if (result.responses && result.responses.paragraphs) {
          result.responses.paragraphs.forEach((paragraph) => {
            // Only add unique content
            if (!uniqueResponses.has(paragraph.content)) {
              uniqueResponses.add(paragraph.content);
              responseArray.push(paragraph.content);
            }
          });
        }
      });

      // Prepare search array - FIXED: Remove duplicates by using a Set
      const searchArray = [];
      const uniqueSearches = new Set();

      searchResults.forEach((result) => {
        if (result.sources) {
          result.sources.forEach((source) => {
            if (source.content && !uniqueSearches.has(source.content)) {
              uniqueSearches.add(source.content);
              searchArray.push(source.content);
            }
          });
        }
      });
      const commandsArray = [];
      let promptSearch = {};
      let followUpQuery = {};
      try {
        await this.systemcommands.first().waitFor({
          state: "visible",
          timeout: 5000,
        });

        const commandsCount = await this.systemcommands.count();
        console.log(`Found ${commandsCount} system commands`);

        // Assuming first command is system prompt and second is user prompt
        if (commandsCount >= 1) {
          try {
            const firstCommand = await this.systemcommands.nth(0).textContent();
            if (firstCommand && firstCommand.trim()) {
              commandsArray.push(firstCommand.trim());
              promptSearch = firstCommand.trim();
            }
          } catch (err) {
            console.error(`Error capturing first command:`, err.message);
          }
        }

        if (commandsCount >= 2) {
          try {
            const secondCommand = await this.systemcommands
              .nth(1)
              .textContent();
            if (secondCommand && secondCommand.trim()) {
              commandsArray.push(secondCommand.trim());
              followUpQuery = secondCommand.trim();
            }
          } catch (err) {
            console.error(`Error capturing second command:`, err.message);
          }
        }

        // Add any remaining commands to the commandsArray
        for (let i = 2; i < commandsCount; i++) {
          try {
            const commandText = await this.systemcommands.nth(i).textContent();
            if (commandText && commandText.trim()) {
              commandsArray.push(commandText.trim());
            }
          } catch (err) {
            console.error(`Error capturing command ${i + 1}:`, err.message);
          }
        }
      } catch (err) {
        console.log("No system commands found");
      }

      // Get the total compute points
      let totalCreditPoints = 0;
      try {
        // Get the count of compute point elements
        const count = await this.computePoint.count();
        console.log(`Found ${count} compute point elements`);

        // Sum up all compute points from all elements
        for (let i = 0; i < count; i++) {
          const pointsText = await this.computePoint.nth(i).textContent();
          console.log(`Element ${i + 1} text: "${pointsText}"`);

          // Extract the number using regex to be more robust
          const pointsMatch = pointsText.match(/(\d[\d,]*)/);

          if (pointsMatch && pointsMatch[1]) {
            // Remove commas and convert to number
            const points = parseInt(pointsMatch[1].replace(/,/g, ""), 10);

            if (!isNaN(points)) {
              totalCreditPoints += points;
              console.log(
                `Added ${points} points from element ${
                  i + 1
                }, running total: ${totalCreditPoints}`
              );
            }
          }
        }
        console.log(
          `Total compute points (sum of all elements): ${totalCreditPoints}`
        );
      } catch (error) {
        console.error("Error calculating total compute points:", error.message);
      }

      // Format the report data as requested
      const reportData = {
        taskDescription: searchedName,
        date: new Date(),
        totalCreditPoints: totalCreditPoints,
        timetaken: `${Number(this.elapsedTime.toFixed(2))} sec`,
        conversationURL: await this.getConvoURL(),
        response: responseArray,
        search: searchArray,
        promptSearch: promptSearch,
        followUpQuery: followUpQuery,
      };

      // Create the file name
      const fileName = `SerachDeepAgentjsonReport.json`;
      const filePath = path.join(__dirname, "../jsonReport", fileName);

      // Read existing file if it exists
      let existingData = [];
      try {
        const existingContent = await fs.readFile(filePath, "utf8");
        existingData = JSON.parse(existingContent);
        if (!Array.isArray(existingData)) {
          existingData = [existingData];
        }
      } catch (error) {
        // File doesn't exist or is invalid, start with empty array
        console.log("Creating new report file");
      }

      // Add new report to existing data
      existingData.push(reportData);

      // Write the updated data back to the file
      await fs.writeFile(
        filePath,
        JSON.stringify(existingData, null, 2),
        "utf8"
      );

      console.log(`All search results and responses saved to: ${filePath}`);
      console.log(`Conversation URL: ${await this.getConvoURL()}`);
      return reportData;
    } catch (error) {
      console.error("Error in searchAndFetchAllResults:", error.message);
      throw error;
    }
  }

  async openSampelTaskWindow() {
    try {
      const elements = await this.sampleTaskDeafaultElement.all();
      for (let i = 1; i < elements.length; i++) {
        await elements[i].click();
        break; // Break after clicking first element
      }
    } catch (error) {
      console.error("Error in openSampelTaskWindow:", error.message);
    }
  }

  async clickOnSampleTaskDefault(taskName) {
    const elements = await this.page
      .locator(
        '[class*="flex flex-col items-start self-stretch"] div[class*="font-normal flex items-center"]'
      )
      .all();

    console.log(`Found ${elements.length} sample task elements`);
    for (const element of elements) {
      const text = await element.textContent();
      console.log(`Checking task text: ${text}`);

      if (text.toLowerCase().includes(taskName.toLowerCase())) {
        console.log(`Found matching task: ${taskName}`);
        await element.click();
        await this.page.waitForTimeout(1000);
        return;
      }
    }
    throw new Error(
      `Sample task "${taskName}" not found in the list of available tasks`
    );
  }

  async isDsipalyedTaskDialogePopup() {
    try {
      const isVisible = await this.sampleTaskDialogePopup.isVisible();
      console.log(`Task dialog popup visibility status: ${isVisible}`);
      return isVisible;
    } catch (error) {
      console.error(
        "Error checking task dialog popup visibility:",
        error.message
      );
      return false;
    }
  }

  async isDsipalyedCancelButton() {
    try {
      const isVisible = await this.cancelButton.isVisible();
      console.log(`Task Cancel button  visibility status: ${isVisible}`);
      return isVisible;
    } catch (error) {
      console.error("Error checking Cancel button visibility:", error.message);
      return false;
    }
  }

  async isDsipalyedtryItButton() {
    try {
      const isVisible = await this.tryItButton.isVisible();
      console.log(`Task Try it button visibility status: ${isVisible}`);
      return isVisible;
    } catch (error) {
      console.error(
        "Error checking task Try it button visibility:",
        error.message
      );
      return false;
    }
  }
  async clickOncancelButton() {
    await this.cancelButton.click();
  }

  async clickOnTryItButton() {
    await this.tryItButton.click();
  }

  async AllSampleTaskDefault(
    promat_user_search,
    expectedStatus,
    computePointLimit
  ) {
    const totalElements = await this.sampleTaskDeafaultElement.count();
    console.log(`Processing ${totalElements} sample tasks`);

    for (let i = 0; i < totalElements; i++) {
      try {
        console.log(`Processing task ${i + 1} of ${totalElements}`);

        // Click on sample task and try it
        await this.sampleTaskDeafaultElement.nth(i).click();
        await this.page.waitForTimeout(5000);
        await this.clickOnTryItButton();
        await this.page.waitForTimeout(5000);
        await this.waitforStopButtonInvisble();
        // Handle prompt text
        await this.enterPromapt(promat_user_search);
        await this.clickSendButton();
        await this.waitforStopButtonInvisble();

        // Verify task status
        const statusResult = await this.getStatusOfTask(expectedStatus);
        if (!statusResult) {
          console.warn(`Task ${i + 1}: Status verification failed`);
        }

        // Check compute points
        const points = await this.getComputePoint();
        if (points > computePointLimit) {
          console.warn(
            `Task ${
              i + 1
            }: Compute points ${points} exceeded limit of ${computePointLimit}`
          );
        }

        // Handle file operations
        await this.downloadFile();
        await this.downloadFilesFromViewer();
        await this.closeBrowserPopup();
        await this.searchAndFetchAllResults();
        // Wait 10 seconds after search completion
        await this.page.waitForTimeout(3000);
        await this.newConversionButton.click();
        if (i < totalElements - 1) {
          console.log(`Waiting 10 seconds before processing next task...`);
          await this.page.waitForTimeout(2000);
        }
      } catch (error) {
        console.error(`Error processing task ${i + 1}:`, error.message);
        // Still wait 10 seconds before continuing to next task even if there's an error
        if (i < totalElements - 1) {
          console.log(`Waiting 10 seconds before attempting next task...`);
          await this.page.waitForTimeout(2000);
        }
        continue;
      }
    }
  }

  async getConvoURL() {
    try {
      const currentUrl = await this.page.url();
      // Log in a consistent format that can be parsed later
      console.log(`Conversation URL: ${currentUrl}`);
      return currentUrl;
    } catch (error) {
      console.error("Error getting conversation URL:", error.message);
      throw error;
    }
  }

  async getConvoId() {
    try {
      const currentUrl = await this.page.url();
      await fs.mkdir(path.join(__dirname, "../urlData"), { recursive: true });
      const filePath = path.join(__dirname, "../urlData/conversation_urls.txt");
      const timestamp = new Date().toISOString();
      const urlData = `${timestamp}\nConversation URL: ${currentUrl}\n\n`;
      await fs.appendFile(filePath, urlData, "utf8");
      console.log(`URL data saved to: ${filePath}`);
      console.log(`Conversation URL: ${currentUrl}`);
      return currentUrl;
    } catch (error) {
      console.error("Error saving conversation URL:", error.message);
      throw error;
    }
  }

  async clickOnChatBotLink() {
    await this.CreatedChatBotlink.click();
  }

  async clickOnDeployLink() {
    await this.previewButton.click();
    await this.deployLink.waitFor({ state: "visible", timeout: 10000 });
    await this.deployLink.click({ force: true, timeout: 10000 });
  }

  // prevoius code for downalod by dropdown
  // async downloadComputeAgentFile() {
  //   await fs.mkdir(this.downloadPath, { recursive: true });

  //   const fileTypes = ["PDF", "PPTX"];

  //   for (const type of fileTypes) {
  //     await this.flexTypeFile.click();
  //     await this.page.waitForTimeout(1000);

  //     const optionCount = await this.fileTypeOptions.count();
  //     for (let i = 0; i < optionCount; i++) {
  //       const option = this.fileTypeOptions.nth(i);
  //       const text = await option.innerText();
  //       if (text.includes(type)) {
  //         const isSelected =
  //           (await option.getAttribute("data-state")) === "checked";
  //         if (!isSelected) {
  //           await option.click();
  //           await this.page.waitForTimeout(1000);
  //         }
  //         break;
  //       }
  //     }

  //     await this.computerFileDownloadOption.waitFor({ state: "visible" });
  //     const downloadPromise = this.page.waitForEvent("download", {
  //       timeout: 200000,
  //     });
  //     await this.computerFileDownloadOption.click();
  //     await this.waitforStopButtonInvisble();
  //     await this.spinLoadForFile.waitFor({ state: "hidden", timeout: 90000 });
  //     const download = await downloadPromise;
  //     const suggestedFileName = await download.suggestedFilename();
  //     const fullPath = path.join(this.downloadPath, suggestedFileName);
  //     await download.saveAs(fullPath);
  //   }
  //   await this.page.waitForTimeout(6000);
  // }

  async downloadComputeAgentFile() {
    await fs.mkdir(this.downloadPath, { recursive: true });

    // Download PDF
    await this.downalodFileicon(); // Wait for spinner
    await this.waitForFileIconAfterLoading(this.pdfFileIcon, "PDF");
    await this.triggerDownload(this.pdfFileIcon, "PDF");

    // Download PPTX
    await this.downalodFileicon(); // Wait again for spinner
    await this.waitForFileIconAfterLoading(this.pptxFileIcon, "PPTX");
    await this.triggerDownload(this.pptxFileIcon, "PPTX");

    await this.page.waitForTimeout(6000);
  }

  async waitForFileIconAfterLoading(fileIcon, fileType = "File") {
    // Step 1: Wait after spinner (already done in downalodFileicon)
    console.log(`⏳ Waiting for ${fileType} icon to be visible...`);
    try {
      await fileIcon.waitFor({ state: "visible", timeout: 480000 }); // 8 min timeout
      console.log(`✅ ${fileType} icon is now visible.`);
    } catch (err) {
      console.error(`❌ ${fileType} icon did not appear within timeout.`);
      throw err;
    }
  }

  async triggerDownload(icon, label = "File") {
    console.log(`Clicking ${label} download icon...`);
    await this.page.waitForTimeout(2000);

    let download;
    try {
      await icon.waitFor({ state: "visible", timeout: 20000 });
      const downloadPromise = this.page.waitForEvent("download", {
        timeout: 300000,
      }); // 5 mins max

      await icon.click(); // Trigger the download

      download = await downloadPromise;
    } catch (err) {
      console.error(`❌ ${label} Download was not triggered after click.`);
      throw err;
    }

    const fileName = await download.suggestedFilename();
    const fullPath = path.join(this.downloadPath, fileName);
    await download.saveAs(fullPath);
    console.log(`✅ ${label} downloaded: ${fileName}`);
  }

  async downalodFileicon() {
    const maxWaitTime = 360000; // 6 minutes in milliseconds
    const checkInterval = 10000; // Check every 10 seconds
    const startTime = Date.now();
    let isVisible = true;
    let elapsedTimeDuration = 0;

    while (isVisible && Date.now() - startTime < maxWaitTime) {
      try {
        isVisible = await this.spinLoadForFile.isVisible({ timeout: 10000 });
        elapsedTimeDuration = Date.now() - startTime;

        if (!isVisible) {
          break; // spinner is gone
        }
        if (elapsedTimeDuration % 10000 < checkInterval) {
          console.log(
            `⏳ Spinner still visible after ${Math.floor(
              elapsedTimeDuration / 1000
            )} seconds. Waiting...`
          );
        }

        await this.page.waitForTimeout(checkInterval);
      } catch (error) {
        isVisible = false;
        elapsedTimeDuration = Date.now() - startTime;
        break;
      }
    }
    try {
      await this.spinLoadForFile.waitFor({ state: "hidden", timeout: 5000 });
    } catch (error) {
      console.log(`Final spinner hidden check failed: ${error.message}`);
    }

    const elapsedSeconds = Math.floor(elapsedTimeDuration / 1000);
    console.log(`✅ Spinner disappeared after ${elapsedSeconds} seconds`);
    return elapsedTimeDuration;
  }
  async verifyNumberOfSlides() {}

  async verifyDownloadedFilesPptxandPdf() {
    const texts = await this.page
      .locator("p[class*='text-ellipsis']")
      .allTextContents();
    let hasPPTX = false;
    let hasPDF = false;

    for (const text of texts) {
      if (text.includes(".pptx")) hasPPTX = true;
      if (text.includes(".pdf")) hasPDF = true;
    }

    if (hasPPTX && hasPDF) return true;
    if (!hasPPTX) throw new Error("PPTX file not found.");
    if (!hasPDF) throw new Error("PDF file not found.");
    await this.page.waitForTimeout(2000);
  }

  async verifyVideoGeneration() {
    const previewVisible = await this.videoGenerationPreview.isVisible();
    if (!previewVisible) return;
    // const linkVisible = await this.videoGenerationLink.isVisible();
    // if (!linkVisible) return;
    await fs.mkdir(this.downloadPath, { recursive: true });
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.videoGenerationDownload.click(),
    ]);
    const suggestedFileName = download.suggestedFilename();
    const filePath = path.join(this.downloadPath, suggestedFileName);
    await download.saveAs(filePath);
  }

  async performSignUp(attachFn) {
    const signupReport = [];
    try {
      signupReport.push("=== SIGNUP EXECUTION RESULTS ===");
      signupReport.push(`Signup started at: ${new Date().toISOString()}`);
  
      await this.page.waitForTimeout(1000);
      signupReport.push("Step 1: Clicked 'Sign Up' button");
      await this.signUpButton.click();
  
      signupReport.push("Step 2: Filled in name");
      await this.nameField.fill("Test User");
  
      signupReport.push("Step 3: Filled in email");
      await this.emailField.fill("testuser@gmail.com");
  
      signupReport.push("Step 4: Filled in password");
      await this.passwordField.fill("Password@123");
  
      signupReport.push("Step 5: Confirmed password");
      await this.confirmPasswordField.fill("Password@123");
  
      await this.page.waitForTimeout(500);
      signupReport.push("Step 6: Clicked 'Create Account'");
      await this.createAccountButton.click();
      await this.page.waitForTimeout(3000);
  
      signupReport.push("✅ Signup completed successfully.");
  
      // ✅ Only call attach if it was passed
      if (attachFn) {
        await attachFn(signupReport.join("\n"), "text/plain");
      }
  
    } catch (err) {
      signupReport.push(`❌ Signup failed: ${err.message}`);
      if (attachFn) {
        await attachFn(signupReport.join("\n"), "text/plain");
      }
      throw err;
    }
  }

  async verifyDataBase(possibleTableNames) {
    await this.dataBase.click();
    await this.dropDownForDB.click();
    await this.page.waitForTimeout(3000);
    for (const tableName of possibleTableNames) {
      const option = this.page.getByRole("option", { name: tableName });
      if (await option.isVisible()) {
        await option.click();
        break;
      }
    }
    await this.page.waitForTimeout(3000);
    await this.refreshButton.click();
    await this.page.waitForTimeout(3000);
    await this.userAdded.isVisible();
  }


  async checkSuccessStatusPeriodically() {
    const startTime = Date.now();
    const maxWaitTime = 1200000; // 20 minutes
    const checkInterval = 10000; // 10 seconds
    while (Date.now() - startTime < maxWaitTime) {
        try {
            const count = await this.successStatus.count();
            if (count > 0) {
                let allVisible = true;
                for (let i = 0; i < count; i++) {
                    const element = this.successStatus.nth(i);
                    const isVisible = await element.isVisible();
                    if (!isVisible) {
                        allVisible = false;
                        break;
                    }
                }
                if (allVisible) {
                    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                    console.log(`:white_check_mark: All ${count} success status elements are visible after ${elapsedTime} seconds.`);
                    return {
                        isVisible: true,
                        totalElements: count,
                        elapsedTime: elapsedTime
                    };
                } else {
                    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                    console.log(`Not all success status elements are visible yet after ${elapsedTime} seconds.`);
                }
            } else {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                console.log(`:information_source: No success status elements found after ${elapsedTime} seconds.`);
            }
        } catch (error) {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            console.log(`:x: Error while checking success status after ${elapsedTime} seconds:`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(":alarm_clock: Timeout reached. Not all success status elements became visible.");
    return {
        isVisible: false,
        elapsedTime: elapsedTime
    };
}
  async testTaks()
  {
    await this.taskMenu.click();
    await this.page.waitForTimeout(2000);
    await this.taskOptions.click();
    await this.page.waitForTimeout(2000);
    await this.testTask.click();
  }
  async verifyBrowserCreation()
  {
   await this.page.waitForTimeout(5000);
    const isBrowserUseVisible = await this.browserUse.first().isVisible();
   const isGmailToolVisible = await this.gmailTool.first().isVisible();
   if (isBrowserUseVisible) {
     const count = await this.browserUse.count();
     expect(count).to.be.greaterThan(0);
     for(let i = 0; i < count; i++) {
       const element = await this.browserUse.nth(i);
       const isVisible = await element.isVisible();
       expect(isVisible).to.be.true;
       await element.click();
     }
   }
   else if(isGmailToolVisible)
   {
     const count = await this.gmailTool.count();
     expect(count).to.be.greaterThan(0);
     for(let i = 0; i < count; i++) {
       const element = await this.gmailTool.nth(i);
       const isVisible = await element.isVisible();
       expect(isVisible).to.be.true;
       await element.click();
   }
  }
  }
  async checkTwitterMCP()
{
  await this.page.waitForTimeout(2000);
  const count=await this.twitterMCPTool.count();
  expect(count).to.be.greaterThan(0);
  for(let i=0; i<count; i++)
  {
    const element=await this.twitterMCPTool.nth(i)
    const isVisible = await element.isVisible();
    expect(isVisible).to.be.true;
    await element.click();
  }
}
  async checkTaskStatus()
{
  await this.page.waitForTimeout(3000);
  console.log('Checking task status...');
  await this.newSession.click();
  await this.page.waitForTimeout(3000);
  await this.taskButton.click();
  await this.page.waitForTimeout(3000);
  const count = await this.reservationTask.count();
  expect(count).to.be.greaterThan(0);
  for (let i = 0; i < count; i++)
  {
    console.log(`Processing reservation task ${i + 1} of ${count}`);
    const element=await this.reservationTask.nth(i).isVisible();
    expect(element).to.be.true;
  }
}

async verifyDataSeeding()
{
  await this.dataBase.click();
  await this.page.waitForTimeout(2000);
  await this.dropDown.click();
  await this.page.waitForTimeout(3000);

  const allOptions=await this.dropdownOptions.count();

  for (let i = 0; i < allOptions; i++) 
  {

    await this.dropdownOptions.nth(i).click();

    await this.page.waitForTimeout(1000);

    await this.rowPresent.isVisible();
    await this.dropDown.click();
  }

}
}
