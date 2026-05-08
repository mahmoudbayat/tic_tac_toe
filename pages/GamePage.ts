import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, TIMEOUTS } from '../config/constants';
import { playToWin } from '../helpers/WinningStrategy';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export class GamePage extends BasePage {
    constructor(page: Page) { super(page); }

    // ── Locators ─────────────────────────────────────────────────────────────
    get cells()       { return this.page.locator(SELECTORS.cell); }
    get filledCells() { return this.page.locator(SELECTORS.filledCell); }
    get btnNewGame()  { return this.page.getByRole('button', { name: /new game/i }); }
    get btnReset()    { return this.page.getByRole('button', { name: /reset/i }); }
    get btnHint()     { return this.page.getByRole('button', { name: /get hint/i }); }
    get diffSelect()  { return this.page.getByLabel(/Easy/i) }
    get logOutButton()          {return this.page.getByRole('button', { name: 'Log Out' })}
    // ── Navigation ────────────────────────────────────────────────────────────
    async goto(): Promise<void> {
        await this.page.getByRole('button', { name: /^play$/i }).click();
    }

    // ── Board helpers ─────────────────────────────────────────────────────────


    async clickCell(row: number, col: number): Promise<void> {
        await this.cells.nth(row * 3 + col).click();
        await this.page.waitForTimeout(TIMEOUTS.ai_move);
    }

    async filledCount(): Promise<number> {
        return this.filledCells.count();
    }

    async isBoardEmpty(): Promise<boolean> {
        return (await this.filledCount()) === 0;
    }



    // ── Controls ──────────────────────────────────────────────────────────────
    async logOut() {
        await this.logOutButton.click();
    }
    async clickNewGame(): Promise<void> {
        await this.btnNewGame.click();
    }

    async clickReset(): Promise<void> {
        await this.btnReset.click();
    }

    async clickHint(): Promise<void> {
        await this.btnHint.click();
        await this.page.waitForTimeout(TIMEOUTS.animation);
    }


    async setDifficulty(
        level: DifficultyLevel,
        dialogAction: 'accept' | 'dismiss' = 'accept',
    ): Promise<void> {
        this.page.once('dialog', async dialog => {
            dialogAction === 'accept' ? await dialog.accept() : await dialog.dismiss();
        });

        await this.diffSelect.selectOption({ label: level }).catch(async () => {
            await this.diffSelect.click();
            await this.page.getByText(level).click();
        });

        await this.page.waitForTimeout(TIMEOUTS.animation);
    }



    async playToWin(humanPlayer: 'X' | 'O' = 'X'): Promise<'win' | 'draw' | 'loss'> {
        return playToWin(this.page, humanPlayer);
    }

    // ── Assertions ────────────────────────────────────────────────────────────
    async assertBoardEmpty(): Promise<void> {
        await expect(this.filledCells).toHaveCount(0, { timeout: TIMEOUTS.default });
    }

    async assertBoardNotEmpty(): Promise<void> {
        expect(await this.filledCount()).toBeGreaterThan(0);
    }


}
