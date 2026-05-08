import {Page} from "@playwright/test";

export class BasePage {

    constructor(readonly page: Page) {

    }
    async waitForReady(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

}