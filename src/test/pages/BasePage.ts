import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param url URL to navigate to
     */
    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    /**
     * Wait for element to be visible
     * @param selector Element selector
     */
    async waitForElement(selector: string) {
        await this.page.waitForSelector(selector);
    }

    /**
     * Click on element
     * @param selector Element selector
     */
    async click(selector: string) {
        await this.waitForElement(selector);
        await this.page.click(selector);
    }

    /**
     * Input text into a field
     * @param selector Element selector
     * @param text Text to input
     */
    async fill(selector: string, text: string) {
        await this.waitForElement(selector);
        await this.page.fill(selector, text);
    }

    /**
     * Get text from element
     * @param selector Element selector
     * @returns Text content of the element
     */
    async getText(selector: string): Promise<string> {
        await this.waitForElement(selector);
        return await this.page.textContent(selector) || '';
    }

    /**
     * Check if element is visible
     * @param selector Element selector
     * @returns boolean indicating if element is visible
     */
    async isVisible(selector: string): Promise<boolean> {
        return await this.page.isVisible(selector);
    }
}