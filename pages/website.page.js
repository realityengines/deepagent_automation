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
        this.loginLink=this.page.locator("(//*[contains(text(),'Login')])[1]");
        this.contactLink=this.page.locator("(//*[contains(text(),'Contact')])[1]");
        this.fullnameField= this.page.locator("//*[contains(@id,'fullName')] | //*[contains(@name,'fullName')] | //*[contains(@placeholder,'Your full name')]");
        this.subjectTextField= this.page.locator("//*[contains(@id,'subject')] | //*[contains(@name,'subject')]");
        this.messageTextField = this.page.locator("//*[contains(@id,'message')] | //*[contains(@name,'message')] | //*[contains(@placeholder,'Tell us more about')]");
        this.statusVisible= this.page.locator("[role='status']")
        
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
}