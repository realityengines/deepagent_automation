import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
export class LoginPage extends BasePage {
    // Locators
    
    private readonly loginpage="[class*=' relative overflow']";
    private readonly usernameInput = "[placeholder=' Email']";
    private readonly passwordInput = "[placeholder=' Password']";
    private readonly loginButton = "[type='submit']";
    private readonly userProfileText = "(//span[@class='mdc-button__label']/span)[1]";
    private readonly registerButton = "//span[text()='Register']";

  

    async userOnLoginPage()
    {
        await this.isVisible(this.loginpage);
    }

    /**
     * Enter username in the login form
     * @param username Username to enter
     */
    async enterUsername(username: string) {
        await this.fill(this.usernameInput, username);
    }

    /**
     * Enter password in the login form
     * @param password Password to enter
     */
    async enterPassword(password: string) {
        await this.fill(this.passwordInput, password);
    }

    /**
     * Click the login button
     */
    async clickLoginButton() {
        await this.click(this.loginButton);
    }


  
}