import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
    this.downloadPath = path.join(__dirname, "../downlaodFile");
    this.fileDownlaod = page.locator(
      '[class*="svg-inline--fa fa-file text-bwleftblue"]'
    );
    this.viewFile = page.locator('[class*="file-magnifying-glass"]');
    this.fileBrowserDownlaod = page.locator(
      '[role="dialog"] [data-icon*="download"]'
    );

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
  }

  async clickCheckoutButton() {
    await this.chekoutButton.waitFor({ state: "visible" });
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

  async waitforStopButtonInvisble() {
    const startTime = Date.now();
    await this.stopButton.waitFor({
      state: "hidden",
      timeout: 1800000, // 30 minutes
    });
    await this.stopButton.waitFor({ state: "hidden" });
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    return executionTime; //
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
    await this.computePoint.waitFor({ state: "visible" });
    const pointsText = await this.computePoint.textContent();
    const points = parseInt(
      pointsText.replace("Compute Points Used:", "").trim()
    );
    return points;
  }

  async downloadFile() {
    try {
      let isDownloadButtonVisible = false;
      try {
        isDownloadButtonVisible = await this.fileDownlaod.isVisible({
          timeout: 5000,
        });
      } catch (visibilityError) {
        console.log("Download button not present in DOM - skipping download");
        return false;
      }

      if (!isDownloadButtonVisible) {
        console.log(
          "Download button exists but not visible - skipping download"
        );
        return false;
      }

      // Create download directory if it doesn't exist
      await fs.mkdir(this.downloadPath, { recursive: true });

      const downloadPromise = Promise.race([
        this.page.waitForEvent("download"),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Download timeout")), 30000)
        ),
      ]);

      await this.fileDownlaod.click();
      const download = await downloadPromise.catch((error) => {
        console.error("Download failed:", error.message);
        return null;
      });

      if (!download) {
        return false;
      }

      // Get the suggested filename
      const suggestedFileName = download.suggestedFilename();
      if (!suggestedFileName) {
        console.error("No filename suggested for download");
        return false;
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

      console.log(`File downloaded successfully to: ${downloadPath}`);
      return true;
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
      // First check if view file button exists and is visible
      const isViewFileVisible = await this.viewFile.isVisible({
        timeout: 5000,
      });
      if (!isViewFileVisible) {
        console.log(
          "View file button not visible - skipping file viewer downloads"
        );
        return false;
      }

      await this.viewFile.click();

      // Check if download buttons are visible with a short timeout
      let isDownloadButtonVisible = false;
      try {
        await this.fileBrowserDownlaod.first().waitFor({
          state: "visible",
          timeout: 5000,
        });
        isDownloadButtonVisible = true;
      } catch (error) {
        console.log(
          "Download buttons not visible - trying folder icon workflow"
        );

        // Check for folder icons
        const folderIconsCount = await this.folderIcon.count();
        if (folderIconsCount > 0) {
          // Click first folder icon
          await this.folderIcon.first().click();
          await this.page.waitForTimeout(1000);

          // Try to find and click zip icon
          try {
            await this.zipIcon.waitFor({ state: "visible", timeout: 5000 });
            await this.zipIcon.click();

            // Wait for download to start
            const download = await this.page.waitForEvent("download", {
              timeout: 3000,
            });
            const fileName = download.suggestedFilename();
            const filePath = path.join(this.downloadPath, fileName);
            await download.saveAs(filePath);
            console.log(`Zip file downloaded to: ${filePath}`);
            return true;
          } catch (zipError) {
            console.error("Error clicking zip icon:", zipError.message);
            return false;
          }
        }
        return false;
      }

      if (isDownloadButtonVisible) {
        // Get total number of files to download
        const totalFiles = await this.fileBrowserDownlaod.count();
        console.log(`Found ${totalFiles} files to download`);

        // Download each file
        for (let i = 0; i < totalFiles; i++) {
          try {
            // Setup download promise
            const downloadPromise = this.page.waitForEvent("download");

            // Click the download button
            await this.fileBrowserDownlaod.nth(i).click();

            // Wait for download to start with timeout
            const download = await downloadPromise;

            // Get filename and save file
            const fileName = download.suggestedFilename();
            const filePath = path.join(this.downloadPath, fileName);
            await download.saveAs(filePath);
            console.log(`File ${i + 1} downloaded to: ${filePath}`);

            // Small delay between downloads
            await this.page.waitForTimeout(1000);
          } catch (error) {
            console.error(`Error downloading file ${i + 1}:`, error.message);
            continue; // Skip to next file if one fails
          }
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error in downloadFilesFromViewer:", error.message);
      return false;
    }
  }

  async closeBrowserPopup() {
    await this.browserPopup.click();
  }

  async searchAndFetchAllResults() {
    try {
      const searchStartTime = new Date().getTime();
      await this.page.waitForSelector(
        'div[class*="flex"] div[class*="text-base font-medium"]',
        { state: "visible" }
      );

      const stopButtonStartTime = new Date().getTime();
      await this.waitforStopButtonInvisble();
      const stopButtonEndTime = new Date().getTime();
      const processingTime = stopButtonEndTime - stopButtonStartTime;

      const searchEndTime = new Date().getTime();
      const totalExecutionTime = searchEndTime - searchStartTime;

      let computePointsUsed = 0;
      try {
        await this.computePoint.waitFor({ state: "visible", timeout: 5000 });
        const pointsText = await this.computePoint.textContent();
        computePointsUsed = parseInt(
          pointsText.replace("Compute Points Used:", "").trim()
        );
      } catch (error) {
        console.log("Could not fetch compute points:", error.message);
      }

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
        "../jsonReader",
        `${sanitizedFileName}.json`
      );

      const searchResults = [];

      // Check if search task elements are visible with a shorter timeout
      let hasSearchTasks = false;
      try {
        await this.searchToolstask
          .first()
          .waitFor({ state: "visible", timeout: 5000 });
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

        //new changes
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

        if (!hasSearchTasks) {
          // Handle case when no search tasks are present
          const sources = [];
          const responses = [];
        } //ended

        searchResults.push({
          searchNumber: 1,
          timestamp: new Date().toISOString(),
          totalSources: sources.length,
          sources: sources,
          responses: {
            totalParagraphs: responses.length,
            captureDate: new Date().toISOString(),
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
            timestamp: new Date().toISOString(),
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
            captureDate: new Date().toISOString(),
            paragraphs: responses,
          };
        }
      }

      await this.waitforStopButtonInvisble();

      const jsonData = {
        searchedName: searchedName,
        Date: new Date().toISOString(),
        computePointsUsed: computePointsUsed,
        totalExecutionTimeMs: totalExecutionTime,
        processingTimeMs: processingTime,
        startTime: Math.floor(searchStartTime / 1000),
        endTime: Math.floor(searchEndTime / 1000),
        formattedStartTime: new Date(searchStartTime).toLocaleString(),
        formattedEndTime: new Date(searchEndTime).toLocaleString(),
        totalSearches: searchResults.length,
        searchResults: searchResults,
      };

      await fs.mkdir(path.join(__dirname, "../jsonReader"), {
        recursive: true,
      });
      await fs.writeFile(
        jsonFilePath,
        JSON.stringify(jsonData, null, 2),
        "utf8"
      );

      console.log(`All search results and responses saved to: ${jsonFilePath}`);
      return jsonData;
    } catch (error) {
      console.error("Error in searchAndFetchAllResults:", error.message);
      throw error;
    }
  }

  async openSampelTaskWindow() {
    try {
      const elements = await this.sampleTaskDeafaultElement.all();
      for (let i = 0; i < elements.length; i++) {
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

      if (text.includes(taskName)) {
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
}
