import { test as base, expect } from '@playwright/test';
import { WelcomePage } from '../pages/WelcomePage';
import { GamePage }    from '../pages/GamePage';
import { ProfilePage } from '../pages/ProfilePage';
import { HistoryPage } from '../pages/HistoryPage';

/**
 * Custom fixture types.
 *
 * Every test that imports `test` from this file automatically gets
 * these page objects injected — no manual `new WelcomePage(page)` needed.
 */
type PageFixtures = {
    welcomePage: WelcomePage;
    gamePage:    GamePage;
    profilePage: ProfilePage;
    historyPage: HistoryPage;

    /**
     * Convenience fixture: creates a fresh unique account and navigates
     * to the Play tab. Returns the ready gamePage and the account name.
     *
     * Usage:
     *   test('my test', async ({ loggedInGame: { gamePage, accountName } }) => { ... });
     */
    loggedInGame: { gamePage: GamePage; accountName: string };
};

/**
 * `base` is Playwright's built-in `test`, renamed so we can extend it
 * without a naming conflict.
 *
 * Think of it as layers:
 *
 *   @playwright/test  →  base  (Playwright's original test runner)
 *                           ↓
 *                     base.extend(...)  →  our `test`
 *                           ↓                (adds welcomePage, gamePage, etc.)
 *                     exported as `test`  →  used in all spec files
 */
export const test = base.extend<PageFixtures>({

    welcomePage: async ({ page }, use) => {
        await use(new WelcomePage(page));
    },

    gamePage: async ({ page }, use) => {
        await use(new GamePage(page));
    },

    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },

    historyPage: async ({ page }, use) => {
        await use(new HistoryPage(page));
    },

    loggedInGame: async ({ page }, use, testInfo) => {
        // Generate a unique account name from the test title + random suffix
        // so parallel tests never collide with each other.
        const safeName = testInfo.title
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 12);
        const accountName = `${safeName}${Math.floor(Math.random() * 9000) + 1000}`;

        const welcomePage = new WelcomePage(page);
        const gamePage    = new GamePage(page);

        await welcomePage.goto();
        await welcomePage.createAccount(accountName);
        await gamePage.goto();

        await use({ gamePage, accountName });
    },

});

// Re-export expect so tests only need one import
export { expect };
