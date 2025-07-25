import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { expect } from "chai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class WebsitePage {
    constructor(page) {
        this.page = page;
        this.joinUSButton = this.page.locator("(//*[contains(@class,'items-center')]//following::*[contains(text(),'Join Us')])[1]");
        this.firstNameField= this.page.locator("//*[contains(@id,'first')] | //*[contains(@name,'first')] | //*[contains(@placeholder,'Your first name')]");
        this.lastNameField = this.page.locator("//*[contains(@id,'last')] | //*[contains(@name,'last')] | //*[contains(@placeholder,'Your last name')]");
        this.emailField = this.page.locator("//*[contains(@id,'email')] | //*[contains(@name,'email')] | //*[contains(@type,'email')] | //*[@placeholder='Email']");
        this.passwordField=this.page.locator("(//*[contains(@id,'password')] | //*[contains(@name,'password')] | //*[contains(@type,'password')])[1]");
        this.confirmPasswordField = this.page.locator("(//*[contains(@id,'password')] | //*[contains(@name,'password')] | //*[contains(@type,'password')])[2]");
        this.checkOut= this.page.locator("[role='checkbox']");
        this.submitButton=this.page.locator("[type='submit']");
        this.loginLink=this.page.locator("(//*[contains(@class,'items-center')]//following::*//*[contains(text(),'Login') or contains(text(),'Sign')])[1]");
        this.username=this.page.locator("(//*[contains(@class,'items-center')]//following::*[contains(text(),'test')])[1]");
        
        this.logout=this.page.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'logout') or    contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sign out')]");
      
        // this.contactLink=this.page.locator("(//a[contains(text(),'Contact')])[1]");
        this.contactLink = this.page.locator("(//*[contains(@class,'items-center')]//following::*//*[contains(text(),'Contact')])[1]");
        this.fullnameField= this.page.locator("//*[@id='fullName' or (@id='name') or contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'full name')]");
        this.subjectTextField= this.page.locator("//*[contains(@id,'subject')] | //*[contains(@name,'subject')]");
        this.messageTextField = this.page.locator("//*[contains(@id,'message')] | //*[contains(@name,'message')] | //*[contains(@placeholder,'Tell us more about')]");
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
        this.description= this.page.locator("//*[contains(text(),'Instructions')]");
        this.textArea=this.page.locator("textarea[placeholder]");
        this.evaluateResumeButton= this.page.locator("(//button[contains(text(),'Evaluate Resume')] | //button[contains(@class,'inline-flex')])[1]");
        
        this.rowPresent= this.page.locator("(//*[@role='row'])[1]");

        //HR website locators-
        this.signUpLink=this.page.locator("(//*[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'sign up'])[1]");

        //Chatbot-
        // this.chatbotInputField=this.page.locator("input[placeholder*='Ask me about NYC']");

       // ifrmae 
        this.iframechatbot=this.page.locator('iframe[role*="presentation"]');
        this.chatbotInputField=this.page.locator("(//*[contains(@placeholder,'Write something')] | //input[contains(@placeholder,'Ask me about NYC')])");
        
        //LLMAPIS-
        this.successsMessage=this.page.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'successfully')]");
        this.newRoleButton=this.page.locator("//*[contains(text(),'New Role')]");
        this.roleNameField=this.page.locator("(//*[@id='name'] | //*[@name='name'] | //*[@placeholder='Name'] )");
        this.experienceField=this.page.locator("(//*[@id='experience'] | //*[@name='experience'] | //*[@placeholder='Experience'])")
        this.skillsField=this.page.locator("(//*[@id='skills'] | //*[@name='skills'] | //*[@placeholder='Skills'])");
        this.locationField=this.page.locator("(//*[@id='location'] | //*[@name='location'] | //*[@placeholder='Location'])");
        this.jobDescriptionField=this.page.locator("//*[contains(@placeholder,'Description')]");
        this.uploadResumeButton=this.page.locator("(//*[text()='Upload Resume'])[1]");
        this.uploadButton=this.page.locator("//button[contains(text(),'Upload')]");
        this.roleLink=this.page.locator("//*[text()='Roles']");
        this.viweDetails=this.page.locator("(//*[text()='View Details'])[1]");

        //LLM-
        this.registrationLink=this.page.locator("(//*[contains(text(),'have an account?')]/a | //a[contains(@href,'signup')])[1]");
        this.leaveRequestLink=this.page.locator("(//*[text()='Leave Requests'])[1]");
        this.newRequestButton=this.page.locator("(//*[text()='New Request'])[1]");
        this.startDate=this.page.locator("(//*[@type='date'])[1]")
        this.endDate=this.page.locator("(//*[@type='date'])[2]")
        this.leaveTypeField=this.page.locator("[placeholder='Leave Type']")
        this.reasonInputField=this.page.locator("[placeholder='reason']");
        
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
    if(await this.checkOut.isVisible())
    {
        await this.checkOut.click();
    }
    await this.submitButton.click();
    await this.page.waitForTimeout(5000);

    try{
      await this.username.waitFor({ state: "visible", timeout: 30000 }); // wait up to 30 sec
      await this.username.click();
      console.log("username and icon appeared and was clicked.");
    } catch (err) {
      console.log("user name did not appear within 30 seconds, skipping.");
    } 
    
    try {
      await this.logout.waitFor({ state: "visible", timeout: 30000 }); // wait up to 30 sec
      await this.logout.click();
      console.log("Logout button appeared and was clicked.");
    } catch (err) {
      console.log("Logout button did not appear within 30 seconds, skipping.");
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


async checkTheWebsiteHaveUsefulwords()
{
  const words = ["reputation", "fearless", "1989", "lover"];

  for (const word of words) {
    const locator = this.page.locator(`text=${word}`);
    const count = await locator.count();
  
    let isVisible = false;
  
    for (let i = 0; i < count; i++) {
      if (await locator.nth(i).isVisible()) {
        isVisible = true;
        break; // One visible match is enough
      }
    }
  
    if (isVisible) {
      console.log(`The word "${word}" is present on the website.`);
    } else {
      console.log(`The word "${word}" is not found on the website.`);
    }
  }
}

async checkTheChatbot(chatbot) {
  await this.page.waitForLoadState("domcontentloaded");
  await this.page.waitForFunction(() => document.readyState === "complete");
  await this.page.waitForTimeout(3000);

  const chatIconSelector = ".lucide.lucide-message-circle";
  const inputSelector =
    "xpath=(//textarea[contains(@placeholder, 'Write') or contains(@placeholder, 'Ask')] | //div[@contenteditable='true' and not(@aria-hidden='true')])";

  console.log("🔍 Checking for chatbot icon...");

  const chatIcon = await this.page.$(chatIconSelector);
  if (chatIcon) {
    console.log("🟢 Chatbot icon found. Clicking to open chat...");
    await chatIcon.scrollIntoViewIfNeeded();
    await chatIcon.click();
    await this.page.waitForTimeout(15000); // Wait for chat to open
  } else {
    console.warn("⚠️ Chatbot icon not found. Skipping icon click.");
  }

  console.log("🔍 Searching for chatbot input (in or outside iframes)...");

  const allFrames = this.page.frames();
  let inputElement = null;
  let chatbotFrame = null;

  for (const frame of allFrames) {
    try {
      const candidates = await frame.$$(inputSelector);
      if (candidates.length > 0) {
        console.log(`✅ Found ${candidates.length} input(s) in a frame.`);
        for (const input of candidates) {
          try {
            await input.scrollIntoViewIfNeeded({ timeout: 2000 });
          } catch {
            await frame.evaluate(el =>
              el.scrollIntoView({ behavior: "smooth", block: "center" }), input);
          }

          const box = await input.boundingBox();
          if (box) {
            inputElement = input;
            chatbotFrame = frame;
            break;
          }
        }
      }
    } catch (err) {
      console.warn("⚠️ Frame check failed:", err.message);
    }

    if (inputElement) break;
  }

  // Fallback: check main page if not found in frames
  if (!inputElement) {
    try {
      const mainInput = await this.page.$(inputSelector);
      if (mainInput) {
        console.log("✅ Found chatbot input directly on page.");
        inputElement = mainInput;
        chatbotFrame = this.page;
      }
    } catch (err) {
      console.warn("⚠️ Error checking main page for input:", err.message);
    }
  }

  if (!inputElement || !chatbotFrame) {
    console.warn("❌ No visible chatbot input found.");
    await this.page.screenshot({ path: "chatbot_not_found.png", fullPage: true });
    return;
  }

  try {
    await inputElement.fill(chatbot);
    console.log("✅ Filled chatbot input successfully.");
  } catch (err) {
    console.warn("❌ Failed to fill chatbot input:", err.message);
    return;
  }

  await this.page.waitForTimeout(1000);

  const sendButtonSelector = "button [data-icon*='paper-plane']";

  try {
    const sendButton = await chatbotFrame.waitForSelector(sendButtonSelector, { timeout: 5000 });
    await sendButton.click();
    console.log("✅ Clicked send button.");

    await this.page.waitForSelector('[class*="animate-spin"]', {
      state: "detached",
      timeout: 20000,
    });

    console.log("✅ Chatbot response completed — spinner disappeared.");
    await this.page.waitForTimeout(15000);
  } catch (err) {
    console.warn("❌ Failed to send or wait for spinner:", err.message);
    await this.page.screenshot({ path: "send_click_failed.png", fullPage: true });
  }
}

async performSignUp()
{
  await this.page.waitForTimeout(5000)
  const signInIsVisible=await this.loginLink.isVisible()
  if(signInIsVisible)
  {
    await this.loginLink.click()
  }

  await this.signUpLink.click()
  await this.fullnameField.fill("testqa");
  await this.emailField.fill("testuser@gmail.com");
  await this.passwordField.fill("Password@1234");
  await this.confirmPasswordField.fill("Password@1234");
  await this.submitButton.click();
  await this.page.waitForTimeout(10000)
}

async createNewRole()
{
  await this.newRoleButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.newRoleButton.click();
  await this.roleNameField.fill("Software testing");
  await this.experienceField.fill("5");
  await this.skillsField.fill("playwright with Javascript");
  await this.locationField.fill("Bangalore");
  const jobFieldVisible=await this.jobDescriptionField.isVisible()
  if(jobFieldVisible)
  {
    await this.jobDescriptionField.fill("Looking for a candidate have 5 plus years of experience in automation testing")
  }
  await this.submitButton.click();
  await this.page.waitForTimeout(10000);
}

async uploadTheResume()
{
  const isVisible=await this.uploadResumeButton.isVisible()
  if(isVisible)
  {
    await this.uploadResumeButton.click();   
  }
  else{
    await this.roleLink.click();
    await this.viweDetails.click();
    await this.uploadResumeButton.click(); 
  }
  const filePath = path.resolve('testData/resumesample.pdf'); // Convert to absolute path
  await this.fileInput.setInputFiles(filePath);
  await this.page.waitForTimeout(3000)
  await this.uploadButton.click();
  const message = await this.successsMessage.isVisible();
  expect(message).to.be.true;
  await this.page.waitForTimeout(5000)
  
}

async performRegisteration()
{
  await this.page.waitForTimeout(5000)
  await this.registrationLink.click()
  await this.page.waitForTimeout(5000)
  await this.fullnameField.fill("testqa");
  await this.emailField.fill("testuser@gmail.com");
  await this.passwordField.fill("Password@1234");
  await this.confirmPasswordField.fill("Password@1234");
  await this.submitButton.click();
  await this.page.waitForTimeout(10000)
}

async performSignInAction()
{
  const logoutVisible=await this.logout.isVisible();
  if(logoutVisible)
  {
    await this.logout.click();
  }

  await this.emailField.fill("testuser@gmail.com");
  await this.passwordField.fill("Password@1234");
  await this.submitButton.click();
  await this.page.waitForTimeout(5000);

}

async applyForALeave() {
  // Generate tomorrow's and day-after-tomorrow's dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Format date to yyyy-mm-dd for <input type="date">
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  await this.page.waitForTimeout(5000);
  await this.leaveRequestLink.click();
  await this.newRequestButton.click();
  
  await this.startDate.fill(formatDate(tomorrow));          // Fill tomorrow's date
  await this.endDate.fill(formatDate(dayAfterTomorrow));    // Fill day-after-tomorrow's date

  // await this.dropDown.click();
  // await this.page.waitForTimeout(2000);

  // const count = await this.dropdownOptions.count();
  // for (let i = 0; i < count; i++) {
  //   const text = await this.dropdownOptions.nth(i).innerText();
  //   if (text.trim().toLowerCase() === 'sick leave') {
  //     await this.dropdownOptions.nth(i).click();
  //     break;
  //   }
  // }

  await this.leaveTypeField.fill("sick leave");
  await this.reasonInputField.fill("Taking sick leave for two days due to cold and fever.");
  await this.submitButton.click();
  await this.page.waitForTimeout(5000);
}

}
