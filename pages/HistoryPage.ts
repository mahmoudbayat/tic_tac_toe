import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS } from '../config/constants';

export class HistoryPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ── Locators ─────────────────────────────────────────────────────────────
    get heading()         { return this.page.getByRole('heading', { name: /game history/i }); }
    get rows()            { return this.page.locator(SELECTORS.historyRow); }
    get clearHistoryBtn() { return this.page.getByRole('button', { name: /clear history/i }); }
    get historyHeading()           {return this.page.getByRole('heading', { name: 'Game History' })}
    get dateColumnHeader()          {return this.page.getByText('DATE')}
    get difficultyColumnHeader()        {return this.page.getByText('DIFFICULTY')}
    get resultColumnHeader()        {return this.page.getByText('RESULT')}

    // ── Navigation ────────────────────────────────────────────────────────────
    async goto(): Promise<void> {
        await this.page.getByRole('button', { name: /history/i }).click();
        await expect(this.heading).toBeVisible();
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    async clearHistory(): Promise<void> {

        await this.clearHistoryBtn.click();

    }

    async rowCount(): Promise<number> {
        return this.rows.count();
    }

    // ── Assertions ────────────────────────────────────────────────────────────
    async assertHasEntries(): Promise<void> {
        expect(await this.rowCount()).toBeGreaterThan(0);
    }

    async assertEmpty(): Promise<void> {
        await expect(this.rows).toHaveCount(0, { timeout: 3_000 }).catch(() => {});
    }

    async assertRowCount(expected: number): Promise<void> {
        expect(await this.rowCount()).toBe(expected);
    }

    async assertLastResult(result: RegExp): Promise<void> {
        await expect(this.rows.last()).toContainText(result);
    }
}
