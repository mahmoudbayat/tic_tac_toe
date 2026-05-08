import { test, expect } from '../fixtures';

test.describe('Gameplay', () => {

    test('test case 01: Player can win a game on Easy', async ({ loggedInGame: { gamePage } }) => {
        await gamePage.setDifficulty('Easy', 'accept');
        const result = await gamePage.playToWin('X');
        expect(result).toBe('win');
    });

    test('test case 02: AI makes a move after player', async ({ loggedInGame: { gamePage } }) => {
        const before = await gamePage.filledCount();
        await gamePage.clickCell(1, 1);
        const after = await gamePage.filledCount();

        expect(after).toBeGreaterThan(before + 1);
    });``

    test('test case 03: Occupied cell cannot be replayed', async ({ loggedInGame: { gamePage } }) => {

        await gamePage.clickCell(1, 1);
        const centreCell = gamePage.cells.nth(4)
       await  expect(centreCell).toBeDisabled()
    });

    test('test case 04: New Game clears the board', async ({ loggedInGame: { gamePage } }) => {
        await gamePage.clickCell(0, 0);
        await gamePage.assertBoardNotEmpty();
        await gamePage.clickNewGame();
        await gamePage.assertBoardEmpty();
    });

    test('test case 05: Reset clears the board mid-game', async ({ loggedInGame: { gamePage } }) => {
        await gamePage.clickCell(0, 0);
        await gamePage.assertBoardNotEmpty();
        await gamePage.clickReset();
        await gamePage.assertBoardEmpty();
    });

    test('test case 06: Get Hint provides a suggestion', async ({ loggedInGame: { gamePage } }) => {
        await gamePage.clickCell(0, 0);
        await gamePage.clickHint();
        await expect(gamePage.btnHint).toBeVisible();
    });

    test('test case 07: Difficulty change mid-game shows confirmation dialog', async ({ page,loggedInGame: { gamePage } }) => {


        await gamePage.clickCell(0, 0);
        await gamePage.diffSelect.click()
        await page.locator('select').last().click()

    });




    test('test case 08: No dialog when changing difficulty on empty board', async ({ loggedInGame: { gamePage } }) => {
        expect(await gamePage.isBoardEmpty()).toBe(true);
        let dialogAppeared = false;
        gamePage.page.once('dialog', async dialog => {
            dialogAppeared = true;
            await dialog.dismiss();
        });
        await gamePage.setDifficulty('Hard', 'accept');
        expect(dialogAppeared).toBe(false);
    });

});
