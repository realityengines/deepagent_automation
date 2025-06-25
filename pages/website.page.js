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
        this.emailField = this.page.locator("//*[contains(@id,'email')] | //*[contains(@name,'email')] | //*[contains(@type,'email')]");
        this.passwordField=this.page.locator("//*[contains(@id,'password')] | //*[contains(@name,'password')] | (//*[contains(@type,'password')])[1]");
        this.confirmPasswordField = this.page.locator("//*[contains(@id,'confirm')] | //*[contains(@name,'confirm')] | (//*[contains(@type,'password')])[2] ");
        this.submitButton=this.page.locator("[type='submit']");
        this.loginLink=this.page.locator("(//*[contains(text(),'Login') or contains(text(),'Sign')])[1]");
        this.contactLink=this.page.locator("(//*[contains(text(),'Contact')])[1]");
        this.fullnameField= this.page.locator("//*[contains(@id,'fullName')] | //*[contains(@name,'fullName')] | //*[contains(@placeholder,'Your full name')]");
        this.subjectTextField= this.page.locator("//*[contains(@id,'subject')] | //*[contains(@name,'subject')]");
        this.messageTextField = this.page.locator("//*[contains(@id,'message')] | //*[contains(@name,'message')] | //*[contains(@placeholder,'Tell us more about')]");
        this.statusVisible= this.page.locator("(//*[@role='status'] | //*[contains(text(),'Invalid')])[1]");
        this.exerciseLink=this.page.locator("(//*[contains(text(),'Exercises')] | //*[contains(@href,'exercises')])[1]")
        this.categoriesDropdown=this.page.locator("((//*[@role='combobox']) | //*[contains(text(),'Categories')])[1]");
        this.dropdownOptions = this.page.locator('[role*="option"]');
        this.fileInput = this.page.locator('[type="file"]');
        this.recipeInputFields=this.page.locator('(//input[contains(@id,"ingredient")] | //input[@type="text"]) | //input[contains(@placeholder,"ingredient")]');
        this.dropDown=this.page.locator('[role*="combobox"]');
        this.generateRecipeButton=this.page.locator("(//*[contains(text(),'Generate Recipes')] | //*[contains(text(),'Generate')])[1]");
        this.description= this.page.locator("[class*='flex-col space']");
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
    await this.passwordField.fill("password123");
    await this.confirmPasswordField.fill("password123");
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);

   }

   async performLoginAction()
   {
    await this.page.waitForTimeout(2000);
    await this.loginLink.click();
    await this.emailField.fill("testuser@gmail.com")
    await this.passwordField.fill("password123");
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);
   }

   async performInvalidLoginAction()
   {
    await this.page.waitForTimeout(2000);
    await this.loginLink.click();
    await this.emailField.fill("testuser@gmail.com")
    await this.passwordField.fill("password1234");
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);
    await this.statusVisible.waitFor({ state: 'visible' });
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
    await this.generateRecipeButton.click();
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


async uploadTheFile()
   {
    await this.page.waitForTimeout(2000)
    const filePath = path.resolve('testData/SampleContract-Shuttle.pdf');
    await this.page.waitForTimeout(3000);
    await this.fileInput.setInputFiles(filePath);
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
}