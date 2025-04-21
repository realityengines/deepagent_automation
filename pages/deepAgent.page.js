import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current file path for ES modules
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
      '[role="dialog"] [data-icon*="download"] '
    );

    this.browserPopup = page.locator('[data-icon*="xmark"]');
    // search
    this.searchToolstask = page.locator(
      '//div[@dir="auto"] //span[contains(text(), "Searching")]'
    );
    // source link
    this.sourceName = page.locator('div [class*="group-hover:underline"]');
    //source data
    this.sourceFetchData = page.locator(
      'section[class*="w-full group"] div[class*="first-letter:uppercase"]'
    );

    this.ResponseSearchedText = page.locator(
      '//div[@class=" prose dark:prose-invert markdown  "]/div/following::p'
    );
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
    await this.stopButton.waitFor({
      state: "hidden",
      timeout: 720000, // 12 minutes
    });
    await this.stopButton.waitFor({ state: "hidden" });
  }

  async getStatusOfTask(expectedStatus) {
    try {
      // Wait for any matching status elements to be visible
      await this.statusOftask
        .first()
        .waitFor({ state: "visible", timeout: 10000 });

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
      // Delete existing download directory if it exists
      try {
        await fs.rm(this.downloadPath, { recursive: true, force: true });
        console.log(
          `Cleaned up existing download directory: ${this.downloadPath}`
        );
      } catch (err) {
        // Ignore error if directory doesn't exist
        if (err.code !== "ENOENT") {
          console.error("Error cleaning up download directory:", err.message);
        }
      }

      // Create fresh download directory
      await fs.mkdir(this.downloadPath, { recursive: true });

      // Create a download promise
      const downloadPromise = this.page.waitForEvent("download");

      // Click the download button
      await this.fileDownlaod.click();

      // Wait for the download to start
      const download = await downloadPromise;

      // Get the suggested filename
      const suggestedFileName = download.suggestedFilename();

      // Create the full path for download
      const downloadPath = path.join(this.downloadPath, suggestedFileName);

      // Check if file already exists and delete it
      try {
        await fs.unlink(downloadPath);
        console.log(`Deleted existing file: ${downloadPath}`);
      } catch (err) {
        // Ignore error if file doesn't exist
        if (err.code !== "ENOENT") {
          console.error("Error deleting existing file:", err.message);
        }
      }

      // Save the file to specified location
      await download.saveAs(downloadPath);

      console.log(`File downloaded successfully to: ${downloadPath}`);
      return true;
    } catch (error) {
      console.error("Error downloading file:", error.message);
      return false;
    }
  }

  async downloadFilesFromViewer() {
    try {
      await this.viewFile.waitFor({ state: "visible" });
      await this.viewFile.click();

      // Wait for download buttons in dialog to be visible
      await this.fileBrowserDownlaod.first().waitFor({ state: "visible" });

      // Get total number of files to download
      const totalFiles = await this.fileBrowserDownlaod.count();
      console.log(`Found ${totalFiles} files to download`);

      // Download each file
      for (let i = 0; i < totalFiles; i++) {
        // Setup download promise
        const downloadPromise = this.page.waitForEvent("download");

        // Click the download button
        await this.fileBrowserDownlaod.nth(i).click();

        // Wait for download to start
        const download = await downloadPromise;

        // Get filename and save file
        const fileName = download.suggestedFilename();
        const filePath = path.join(this.downloadPath, fileName);
        await download.saveAs(filePath);
        console.log(`File ${i + 1} downloaded to: ${filePath}`);

        // Small delay between downloads
        await this.page.waitForTimeout(1000);
      }

      return true;
    } catch (error) {
      console.error("Error in downloadFilesFromViewer:", error.message);
      return false;
    }
  }

  async closeBrowserPopup() {
    await this.browserPopup.click();
  }

  // fetch source
  async searchAndFetchAllResults() {
    try {
      const jsonFilePath = path.join(
        __dirname,
        "../jsonReader/searchResults.json"
      );

      try {
        await fs.unlink(jsonFilePath);
        console.log("Existing JSON file deleted successfully");
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Error deleting existing JSON file:", err);
        }
      }

      const searchResults = [];
      await this.searchToolstask.first().waitFor({ state: "visible" });
      const searchButtonCount = await this.searchToolstask.count();
      console.log(`Found ${searchButtonCount} search buttons`);

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

        console.log(`Processed ${sources.length} sources for search ${i + 1}`);
      }

      const jsonData = {
        totalSearches: searchButtonCount,
        collectionDate: new Date().toISOString(),
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

      console.log(`All search results saved to: ${jsonFilePath}`);
      return jsonData;
    } catch (error) {
      console.error("Error in searchAndFetchAllResults:", error.message);
      throw error;
    }
  }

  async captureAndStoreResponseValue() {
    try {
      const jsonFilePath = path.join(
        __dirname,
        "../jsonReader/ResponseTextSearchedResult.json"
      );

      // Delete existing JSON file if it exists
      try {
        await fs.unlink(jsonFilePath);
        console.log("Existing response text JSON file deleted successfully");
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Error deleting existing response JSON file:", err);
        }
      }

      // Wait for response text elements to be visible
      await this.ResponseSearchedText.first().waitFor({ state: "visible" });

      // Get count of response paragraphs
      const responseCount = await this.ResponseSearchedText.count();
      console.log(`Found ${responseCount} response paragraphs`);

      // Array to store all response paragraphs
      const responses = [];

      // Capture text from each paragraph
      for (let i = 0; i < responseCount; i++) {
        try {
          const responseText = await this.ResponseSearchedText.nth(
            i
          ).textContent();
          responses.push({
            paragraphId: i + 1,
            content: responseText.trim(),
          });
        } catch (err) {
          console.error(
            `Error capturing response text for paragraph ${i + 1}:`,
            err.message
          );
        }
      }

      const jsonData = {
        totalParagraphs: responseCount,
        captureDate: new Date().toISOString(),
        responses: responses,
      };

      // Ensure directory exists
      await fs.mkdir(path.join(__dirname, "../jsonReader"), {
        recursive: true,
      });

      // Write to JSON file
      await fs.writeFile(
        jsonFilePath,
        JSON.stringify(jsonData, null, 2),
        "utf8"
      );

      console.log(`Response text saved to: ${jsonFilePath}`);
      return jsonData;
    } catch (error) {
      console.error(
        "Error in captureAndStorecaptureAndStoreResponseValue:",
        error.message
      );
      throw error;
    }
  }
}
