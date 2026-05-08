import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WelcomePage extends BasePage {
    constructor(page: Page) { super(page); }

    // ── Locators ─────────────────────────────────────────────────────────────
    get heading()          { return this.page.getByRole('heading', { name: /welcome/i }); }
    get nameInput()        { return this.page.getByLabel(/player name/i); }
    get createAccountBtn() { return this.page.getByRole('button', { name: /create account/i }); }
    get loginLink()        { return this.page.getByRole('button', { name: /log in/i }); }
    get loginBtn()         { return this.page.getByRole('button', { name: /log in|sign in/i }); }
    get duplicateAccount() { return this.page.getByText('This name is already taken. Try logging in.'); }
    get loginFailedLink()  { return this.page.getByText('No account with this name. Please register.'); }

    // ── Actions ───────────────────────────────────────────────────────────────
    async goto(): Promise<void> {
        await this.page.goto('index.html');
        await this.waitForReady();
    }

    async createAccount(name: string): Promise<void> {
        await this.nameInput.fill(name);
        await this.createAccountBtn.click();
    }

    async login(name: string): Promise<void> {
        await this.loginLink.click();
        await this.nameInput.fill(name);
        await this.loginBtn.click();
        await expect(this.page.getByText(/hello/i)).toBeVisible();
    }

    // ── Assertions ────────────────────────────────────────────────────────────
    async assertVisible(): Promise<void> {
        await expect(this.heading).toBeVisible();
    }

    async loginFailed(name: string): Promise<void> {
        await this.loginLink.click();
        await this.nameInput.fill(name);
        await this.loginBtn.click();
    }
}