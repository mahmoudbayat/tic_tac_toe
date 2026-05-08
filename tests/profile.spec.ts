import { test, expect } from '../fixtures';
import {GamePage, ProfilePage, WelcomePage} from "../pages";
import {TEST_USER} from "../config/constants";

test.describe('Profile & Stats', () => {
    let welcomePage: WelcomePage;


    test.beforeEach(async ({page}) =>{
        welcomePage = new WelcomePage(page)
        await welcomePage.goto()

    })
    test('test case 01: Profile page shows win/loss/draw stats', async ({loggedInGame: { gamePage },profilePage,}) => {
        await profilePage.goto();
        await profilePage.assertStatsVisible();
    });

    test('test case 02: Win counter increments after winning a game', async ({ loggedInGame: { gamePage }, profilePage }) => {
        await profilePage.goto();
        const before = await profilePage.getStats();
        await gamePage.goto();
        await gamePage.playToWin('X');
        await profilePage.goto();
        await profilePage.assertStatIncrementedBy(before, 'wins', 1);
    });

    test('test case 03: Stats start at zero for a new account', async ({ loggedInGame: { gamePage }, profilePage }) => {

        await profilePage.goto();
        await profilePage.assertStats({ wins: 0, losses: 0, draws: 0 });
    });

    test('test case 04: Delete Account button shows confirmation dialog', async ({ page,loggedInGame: { gamePage }, profilePage }) => {
        await profilePage.goto();
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Delete this account');
            await dialog.dismiss(); // Cancel so we don't actually delete
        });
        await profilePage.deleteAccountBtn.click();
    });
    test('test case 04: Cancelling Delete Account keeps account active', async ({ page,loggedInGame: { gamePage }, profilePage }) => {
        await profilePage.goto();
        page.on('dialog', async (dialog) => {
            await dialog.dismiss();
        });
        await profilePage.deleteAccountBtn.click();
        await page.waitForTimeout(500);
        // Should still be on profile page
        await expect(profilePage.heading).toBeVisible();
    });
});
