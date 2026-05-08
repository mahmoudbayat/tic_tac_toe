import { test, expect } from '../fixtures';

test.describe('Game History', () => {

    test('test case 01: History page displays correct heading', async ({ loggedInGame: { gamePage }, historyPage }) => {
        await historyPage.goto();
        await expect(historyPage.historyHeading).toBeVisible();
    });

    test('test case 02: Win appears in History with correct result', async ({ loggedInGame: { gamePage }, historyPage }) => {
         await gamePage.setDifficulty('Easy', 'accept');
        const result = await gamePage.playToWin('X');
        expect(result).toBe('win');

        await historyPage.goto();
        await historyPage.assertHasEntries();
        await expect(historyPage.historyHeading).toBeVisible();
        await expect(historyPage.dateColumnHeader).toBeVisible();
        await expect(historyPage.difficultyColumnHeader).toBeVisible();
        await expect(historyPage.resultColumnHeader).toBeVisible();
        await historyPage.assertLastResult(/win/i);
    });

    test('test case 03: Multiple games are each recorded in History', async ({ loggedInGame: { gamePage }, historyPage }) => {
        await gamePage.setDifficulty('Easy', 'accept');

        // Game 1
        await gamePage.playToWin('X');
        await gamePage.clickNewGame();

        // Game 2
        await gamePage.playToWin('X');

        await historyPage.goto();
        await historyPage.assertRowCount(2);
    });

    test('test case 04: Clear History removes all entries', async ({page, loggedInGame: { gamePage }, historyPage }) => {

        await gamePage.setDifficulty('Easy', 'accept');
        await gamePage.playToWin('X');
        await historyPage.goto();
        await historyPage.assertHasEntries();
        await historyPage.clearHistory();
        await historyPage.assertEmpty();
    });

    test('test case 05: History row count matches Profile win+loss+draw total', async ({
                                                                                    loggedInGame: { gamePage },
                                                                                    historyPage,
                                                                                    profilePage,
                                                                                }) => {
        await gamePage.setDifficulty('Easy', 'accept');
        await gamePage.playToWin('X');
        await gamePage.clickNewGame();
        await gamePage.playToWin('X');

        await historyPage.goto();
        const totalRows = await historyPage.rowCount();

        await profilePage.goto();
        const stats = await profilePage.getStats();
        expect(stats.wins + stats.losses + stats.draws).toBe(totalRows);
    });

    test('test case 06: Abandoned game (Reset) is NOT recorded in History', async ({ loggedInGame: { gamePage }, historyPage }) => {
        await gamePage.clickCell(0, 0);
        await gamePage.clickReset();

        await historyPage.goto();
        await historyPage.assertEmpty();
    });

});
