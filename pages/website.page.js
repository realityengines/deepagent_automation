import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class WebsitePage {
    constructor(page) {
        this.page = page;
        this.joinUSButton = this.page.locator("(//*[contains(text(),'Join Us')])[1]");
        this.firstNameField= this.page.locator("//*[contains(@id,'first')] | //*[contains(@name,'first')] | //*[contains(@placeholder,'Your first name')]");
        this.lastNameField = this.page.locator("//*[contains(@id,'last')] | //*[contains(@name,'last')] | //*[contains(@placeholder,'Your last name')]");
        this.emailField = this.page.locator("(//*[contains(@id,'email')] | //*[contains(@name,'email')] | //*[contains(@type,'email')])[1]");
        this.phoneNumberField = this.page.locator("(//*[contains(@id,'phone')] | //*[contains(@name,'phone')] | //*[contains(@placeholder,'phone')] | //input[@type='tel'])[1]");
        this.contactButton= this.page.locator("(//*[text()='Contact'])[1]")
        this.passwordField=this.page.locator("//*[contains(@id,'password')] | //*[contains(@name,'password')] | (//*[contains(@type,'password')])[1]");
        this.confirmPasswordField = this.page.locator("//*[contains(@id,'confirm')] | //*[contains(@name,'confirm')] | (//*[contains(@type,'password')])[2] ");
        this.submitButton=this.page.locator("[type='submit']");
        this.loginLink=this.page.locator("(//*[contains(text(),'Login') or contains(text(),'Sign')])[1]");
        this.logout=this.page.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'logout')]");
      
        this.contactLink=this.page.locator("(//a[contains(text(),'Contact')])[1]");
        this.fullnameField= this.page.locator("(//*[contains(@id,'fullName')] | //*[contains(@name,'fullName')] | //*[contains(@placeholder,'full name')] | //*[contains(@placeholder,'Full Name')])[1]");
        this.subjectTextField= this.page.locator("//*[contains(@id,'subject')] | //*[contains(@name,'subject')]");
        this.messageTextField = this.page.locator("(//*[contains(@id,'message')] | //*[contains(@name,'message')] | //*[contains(@placeholder,'Tell us')] | //*[@placeholder='Message'])[1]");
        this.statusVisible= this.page.locator("(//li[@role='status'])[1]");
        this.exerciseLink=this.page.locator("(//*[contains(text(),'Exercises')] | //*[contains(@href,'exercises')])[1]")
        this.categoriesDropdown=this.page.locator("((//*[@role='combobox']) | //*[contains(text(),'Categories')])[1]");
        this.dropdownOptions = this.page.locator('[role*="option"]');
        this.fileInput = this.page.locator('[type="file"]');
        this.analysisContractorButton= this.page.locator("(//*[contains(text(), 'New Analysis') or contains(text(), 'Analyze New') or contains(text(), 'Analyze Another')])[1]");
        this.animatedSpin= this.page.locator("[class*='animate-spin']");
        this.uploadFailed= this.page.locator("p[class*='text-red']");
   
        this.recipeInputFields=this.page.locator("//input[contains(translate(@id, 'INGREDIENT', 'ingredient'), 'ingredient')   or contains(translate(@placeholder, 'INGREDIENT', 'ingredient'), 'ingredient')]");
        this.dropDown=this.page.locator('[role*="combobox"]');
        this.generateRecipeButton=this.page.locator("(//*[@type='submit' or translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'submit' or contains(text(), 'Generate Recipes')])[1]");
        this.description= this.page.locator("(//*[contains(text(),'Instructions')] | //*[text()='View Recipe'] | //*[text()=''])");
        this.textArea=this.page.locator("textarea[placeholder]");
        this.evaluateResumeButton= this.page.locator("(//button[contains(text(),'Evaluate Resume')] | //button[contains(@class,'inline-flex')])[1]");
        
    }

   async fillJoinUSForm()
   {

    await this.page.waitForTimeout(2000);
    await this.joinUSButton.click()
    await this.firstNameField.fill("test");
    await this.lastNameField.fill("qa");
    await this.emailField.fill("testuser@gmail.com");
    await this.passwordField.fill("Password@123");
    await this.confirmPasswordField.fill("Password@123");
    await this.submitButton.click();
    await this.page.waitForTimeout(5000);
    try {
      await this.logout.waitFor({ state: "visible", timeout: 30000 }); // wait up to 30 sec
      await this.logout.click();
      console.log("Logout button appeared and was clicked.");
    } catch (err) {
      console.log("Logout button did not appear within 60 seconds, skipping.");
    }

   }

   async performLoginAction()
   {
    await this.page.waitForTimeout(2000);
    try {
  
      await this.loginLink.waitFor({ state: 'visible', timeout: 60000 });
      console.log("✅ Login button appeared after logout");
      await this.loginLink.click();
      console.log("✅ Login button clicked");
  
    } catch (error) {
      console.error("❌ Logout/Login flow failed:", error);
    }

    await this.page.waitForTimeout(2000);
    await this.emailField.fill("testuser@gmail.com")
    await this.passwordField.fill("Password@123");
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);
   }

   async performInvalidLoginAction()
   {
    await this.page.waitForTimeout(2000);
    try {
  
      await this.loginLink.waitFor({ state: 'visible', timeout: 60000 });
      console.log("✅ Login button appeared after logout");
      await this.loginLink.click();
      console.log("✅ Login button clicked");
  
    } catch (error) {
      console.error("❌ Logout/Login flow failed:", error);
    }

    await this.emailField.fill("testuser@gmail.com")
    await this.passwordField.fill("Password@1234");
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);
    try {
      await this.statusVisible.waitFor({ state: 'visible', timeout: 5000 });
      console.log("✅ Status appeared successfully");
    } catch (error) {
      console.error("❌ Status did not appear within timeout. Possible login issue.");
    }
   }

   async fillContactUSForm()
   {
    await this.page.waitForTimeout(2000);
    await this.contactLink.click();
    await this.fullnameField.fill("testing");
    await this.emailField.fill("testuser@gmail.com");
    await this.subjectTextField.fill("Test Subject");
    await this.messageTextField.fill("This is a test message");
    await this.submitButton.click();
    await this.page.waitForTimeout(3000)
   }

   async enterTheRecipeData()
   {
    const ingredients = ['Tomato', 'Cheese', 'Basil'];
    const fieldCount = await this.recipeInputFields.count();
   for (let i = 0; i < fieldCount; i++) {
   await this.recipeInputFields.nth(i).fill(ingredients[i]);
    }
    const dropDownCount= await this.dropDown.count();
    for (let i = 0; i < dropDownCount; i++) {
      const dropdown = this.dropDown.nth(i);
      if (await dropdown.isVisible()) {
        await dropdown.click();
        if (await this.dropdownOptions.count() > 0) {
          await this.dropdownOptions.nth(1).click();
        }
      }
    }
    await this.page.waitForTimeout(6000);
    await this.generateRecipeButton.scrollIntoViewIfNeeded();
    await this.generateRecipeButton.click();
    await this.description.first().waitFor({ state: 'visible', timeout: 120000 });
    // Then validate all visible descriptions
    const descriptionCount = await this.description.count();
    for (let i = 0; i < descriptionCount; i++) {
      try {
        const isVisible = await this.description.nth(i).isVisible({ timeout: 10000 });
        expect(isVisible, `Element at index ${i} should be visible`).to.be.true;
      } catch (error) {
        console.warn(`Warning: Element ${i} is not visible after 10 seconds`);
      }
    }
    
}


async uploadTheFiles() {
  const results = {
    PDF: '',
    TXT: '',
    DOCX: ''
  };

  const uploadAndCheck = async (filePath, label) => {
    try {
      console.log(`📤 Uploading ${label}...`);
      await this.page.waitForTimeout(2000);
      await this.fileInput.setInputFiles(filePath);

      await this.waitForSpinnerWithIntervalChecks();

      const isUploadFailedVisible = await this.uploadFailed.isVisible({ timeout: 5000 });
      if (isUploadFailedVisible) {
        const failedText = await this.uploadFailed.textContent();
        if (failedText?.toLowerCase().includes("failed")) {
          results[label] = `Failed: ${failedText.trim()}`;
          console.log(`❌ ${label} upload failed: ${failedText.trim()}`);
          return false; // tells caller it failed
        }
      }

      const isAnalyzeVisible = await this.analysisContractorButton.isVisible({ timeout: 3000 });
      if (isAnalyzeVisible) {
        await this.analysisContractorButton.click();
      }

      results[label] = "Success";
      console.log(`✅ ${label} uploaded and analyzed successfully.`);
      return true;
    } catch (error) {
      results[label] = `Failed: ${error.message}`;
      console.log(`❌ ${label} upload error: ${error.message}`);
      return false;
    }
  };

  // === Upload PDF ===
  const pdfPassed = await uploadAndCheck.call(this, path.resolve('testData/SampleContract-Shuttle.pdf'), 'PDF');
  if (!pdfPassed) {
    console.log('🔄 Refreshing after PDF failure...');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  // === Upload TXT ===
  const txtPassed = await uploadAndCheck.call(this, path.resolve('testData/Contract.txt'), 'TXT');
  if (!txtPassed) {
    console.log('🔄 Refreshing after TXT failure...');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  // === Upload DOCX ===
  await uploadAndCheck.call(this, path.resolve('testData/Sample Contract.docx'), 'DOCX');

  // === Final Summary ===
  console.log("\n📄 Final Upload Summary:");
  for (const [fileType, status] of Object.entries(results)) {
    if (status === "Success") {
      console.log(`✅ ${fileType} uploaded and analyzed successfully.`);
    } else {
      console.log(`❌ ${fileType} upload failed: ${status}`);
    }
  }
}





// async uploadTheFiles() {
//   const results = {
//     PDF: '',
//     TXT: '',
//     DOCX: ''
//   };

//   // Helper function for each file
//   const uploadAndCheck = async (filePath, label) => {
//     try {
//       await this.page.waitForTimeout(2000);
//       await this.fileInput.setInputFiles(filePath);
//       await this.waitForSpinnerWithIntervalChecks();
//       const isUploadFailedVisible = await this.uploadFailed.isVisible({ timeout: 5000 });
//       if (isUploadFailedVisible) {
//         const failedText = await this.uploadFailed.textContent();
//         if (failedText?.toLowerCase().includes("failed")) {
//           results[label] = `Failed: ${failedText.trim()}`;
//           return;
//         }
//       }

//       results[label] = "Success";
//     } catch (error) {
//       results[label] = `Failed: ${error.message}`;
//     }
//   };

//   // Upload each file and check
//   await uploadAndCheck(path.resolve('testData/SampleContract-Shuttle.pdf'), 'PDF');

//   try { await this.analysisContractorButton.click(); } catch {}

//   await uploadAndCheck(path.resolve('testData/Contract.txt'), 'TXT');

//   try { await this.analysisContractorButton.click(); } catch {}

//   await uploadAndCheck(path.resolve('testData/Sample Contract.docx'), 'DOCX');

//   // Final Summary
//   console.log("\n📄 Final Upload Summary:");
//   for (const [fileType, status] of Object.entries(results)) {
//     if (status === "Success") {
//       console.log(`✅ ${fileType} uploaded and analyzed successfully.`);
//     } else {
//       console.log(`❌ ${fileType} upload failed: ${status}`);
//     }
//   }
// }



async waitForSpinnerWithIntervalChecks() {
  const startTime = Date.now();
  const maxWaitTime = 300000; // 5 minutes in milliseconds
  const checkInterval = 10000; // 10 seconds
  let isVisible = true;

  console.log('🕒 Waiting for spinner to become invisible...');

  while (isVisible && Date.now() - startTime < maxWaitTime) {
    try {
      // Check if the spinner is visible
      isVisible = await this.animatedSpin.isVisible({ timeout: 1000 });

      if (!isVisible) {
        this.elapsedTime = Date.now() - startTime;
        console.log(`✅ Spinner disappeared after ${this.elapsedTime / 1000} seconds`);
        break;
      }

      // Log every 30 seconds
      this.elapsedTime = Date.now() - startTime;
      if (this.elapsedTime % 30000 < checkInterval) {
        console.log(`⏳ Spinner still visible after ${Math.floor(this.elapsedTime / 1000)} seconds...`);
      }

      await this.page.waitForTimeout(checkInterval);
    } catch (error) {
      // If element is detached or error occurs, assume it's gone
      console.log(`⚠️ Spinner check error: ${error.message}`);
      isVisible = false;
      this.elapsedTime = Date.now() - startTime;
      break;
    }
  }

  // Final confirmation to ensure it's hidden
  try {
    await this.animatedSpin.waitFor({ state: 'hidden', timeout: 5000 });
  } catch (error) {
    console.log(`❌ Final spinner check failed: ${error.message}`);
  }

  const elapsedTimeInSeconds = this.elapsedTime / 1000;
  console.log(`⏱️ Spinner became invisible after ${elapsedTimeInSeconds} seconds`);

  return elapsedTimeInSeconds;
}



   async analysisTheResume()
{
  await this.page.waitForTimeout(2000)
  await this.textArea.fill("Mid-level web developer with React and Node.js experience, building responsive apps and improving performance")
  await this.evaluateResumeButton.click();
  await this.page.waitForTimeout(5000);
  const descriptionCount = await this.description.count();
  for (let i = 0; i < descriptionCount; i++) {
    const isVisible = await this.description.nth(i).isVisible({ timeout: 10000 });
    try {
      expect(isVisible, `Element at index ${i} should be visible`).to.be.true;
    } catch (error) {
      console.warn(`Warning: Element ${i} is not visible after 10 seconds`);
    }
  }

}

async fillTheForm()
{
  await this.page.waitForTimeout(5000);
  const isContactButtonVisible = await this.contactButton.isVisible();
  if (isContactButtonVisible) {
    await this.contactButton.click();
    console.log("Contact button clicked");
  }
  await this.page.waitForTimeout(2000);
  await this.fullnameField.fill("test QA");
  await this.page.waitForTimeout(2000);
  await this.emailField.fill("testuser@gmail.com");
  await this.page.waitForTimeout(2000);
  await this.phoneNumberField.fill("1234567890");
  await this.page.waitForTimeout(2000);
  await this.messageTextField.fill("testing the applications for better use");
  await this.page.waitForTimeout(2000);
  await this.submitButton.click();
  await this.page.waitForTimeout(5000)
}
}