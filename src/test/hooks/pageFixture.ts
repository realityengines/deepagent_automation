import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

class PageFixture {
    private _page!: Page;
    private _LoginPage!: LoginPage;
    private _DashboardPage!:DashboardPage;

    // Getter for the base page
    get page(): Page {
        return this._page;
    }

    // Setter for the base page
    set page(page: Page) {
        this._page = page;
        this._LoginPage = new LoginPage(page);
        this._DashboardPage=new DashboardPage(page);
    }

    // Getter for the BookCart page
    get loginpage(): LoginPage {
        return this._LoginPage;

    }

    get dashboardpage(): DashboardPage{
        return this._DashboardPage;
    }
}

export const pageFixture = new PageFixture();