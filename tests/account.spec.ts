import { test, expect } from '../fixtures';
import { TEST_USER } from "../config/constants";
import { WelcomePage, GamePage } from "../pages";

test.describe('Account Management', () => {
    let welcomePage: WelcomePage;
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        welcomePage = new WelcomePage(page);
        gamePage = new GamePage(page);
        await welcomePage.goto();
    });

    test('test case 01: Create account with valid name', async ({ }) => {
        await welcomePage.createAccount(TEST_USER.name);
        expect(await gamePage.isBoardEmpty()).toBe(true);
    });

    test('test case 02: Create account with empty name is blocked', async ({ }) => {
        await welcomePage.createAccountBtn.click();
        await welcomePage.assertVisible();
    });

    test('test case 03: Create Account button is clickable', async ({ }) => {
        await expect(welcomePage.createAccountButton).toBeEnabled();
    });

    test('test case 04: "Already have an account" link is visible', async ({ page }) => {
        await welcomePage.createAccount(TEST_USER.name);
        await expect(page.getByText(/hello/i)).toBeVisible();
        await gamePage.logOut();
        await welcomePage.createAccount(TEST_USER.name);
        await expect(welcomePage.duplicateAccount).toHaveText('This name is already taken. Try logging in.');
    });

    test('test case 05: Log out and log back in', async ({ }) => {
        await welcomePage.createAccount(TEST_USER.name);
        await welcomePage.page.getByRole('button', { name: /Log Out/i }).click();
        await welcomePage.assertVisible();
        await welcomePage.login(TEST_USER.name);
        await expect(welcomePage.page.getByText(/hello/i)).toBeVisible();
    });

    test('test case 06: Change display name on Profile page', async ({ profilePage }) => {
        await welcomePage.createAccount(TEST_USER.name);
        await profilePage.goto();
        await profilePage.changeDisplayName(TEST_USER.updatedName);
        await expect(profilePage.page.getByText(/TEST_UPDATED_NAME/i)).toBeVisible();
    });

    test('test case 07: Display name never shows placeholder dashes', async ({ }) => {

        await welcomePage.createAccount('RealNamePlayer');
        const greeting = await welcomePage.page.getByText(/hello/i).textContent() ?? '';
        expect(greeting).not.toMatch(/----/);
        expect(greeting).not.toMatch(/hello,\s*$/i);
    });

    test('test case 08: Player name input accepts special characters', async ({ page }) => {
        await welcomePage.createAccount(TEST_USER.specialName);
        await expect(page.getByText(`Hello, ${TEST_USER.specialName}`)).toBeVisible({ timeout: 8000 });
    });

    test('test case 09: "Account does not exist', async ({ page }) => {
        await welcomePage.loginFailed(TEST_USER.unknownUser);
        await expect(welcomePage.loginFailedLink).toBeVisible();
    });

    test('test case 10: change to dark mode', async ({ page }) => {
        await page.getByRole('button', { name: 'Dark' }).click();

        await expect(
            page.locator('html')
        ).toHaveAttribute('data-theme', 'dark');
    });

    test('test case 11: change to language', async ({ page }) => {
        const selectLanguage = page.getByTestId('select-language');
        await selectLanguage.click();
        await selectLanguage.selectOption("fa");
        await expect(page.getByText(/خوش آمدید/i)).toBeVisible();
    });
});