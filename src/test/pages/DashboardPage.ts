import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage{

    private readonly routeDropdown='[data-icon="angle-down"]';

    async clickRouteDropdown() {
        
        await this.click(this.routeDropdown);
      }
}