import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';


export type Stats = { wins: number; losses: number; draws: number };

export class ProfilePage extends BasePage {
    constructor(page: Page) { super(page); }

    // ── Locators ─────────────────────────────────────────────────────────────
    get heading()          { return this.page.getByRole('heading', { name: /your profile/i }); }
    get displayNameInput() { return this.page.getByLabel(/display name/i); }
    get saveChangesBtn()   { return this.page.getByRole('button', { name: /save changes/i }); }
    get deleteAccountBtn() { return this.page.getByRole('button', { name: /delete account/i }); }
    // ── Navigation ────────────────────────────────────────────────────────────
    async goto(): Promise<void> {
        await this.page.getByRole('button', { name: /profile/i }).click();
        await expect(this.heading).toBeVisible();
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    async changeDisplayName(newName: string): Promise<void> {
        await this.displayNameInput.clear();
        await this.displayNameInput.fill(newName);
        await this.saveChangesBtn.click();
    }



    // ── Stats ─────────────────────────────────────────────────────────────────

    async getStats(): Promise<Stats> {
        const parent = this.page
            .locator('xpath=//dl | //*[contains(@class, "kv")]')
            .first();

        const getValue = async (index: number): Promise<number> => {
            const text = await parent
                .locator('xpath=.//dd')
                .nth(index)
                .textContent() ?? '0';
            return parseInt(text.trim(), 10);
        };

        return {
            wins:   await getValue(1),
            losses: await getValue(2),
            draws:  await getValue(3),
        };
    }

    // ── Assertions ────────────────────────────────────────────────────────────
    async assertStatsVisible(): Promise<void> {
        await expect(this.page.getByText(/win/i)).toBeVisible();
        await expect(this.page.getByText(/loss/i)).toBeVisible();
        await expect(this.page.getByText(/draw/i)).toBeVisible();
    }

    async assertStats(expected: Partial<Stats>): Promise<void> {
        const actual = await this.getStats();
        if (expected.wins   !== undefined) expect(actual.wins).toBe(expected.wins);
        if (expected.losses !== undefined) expect(actual.losses).toBe(expected.losses);
        if (expected.draws  !== undefined) expect(actual.draws).toBe(expected.draws);
    }

    async assertStatIncrementedBy(
        before: Stats,
        field: keyof Stats,
        amount = 1,
    ): Promise<void> {
        const after = await this.getStats();
        expect(after[field]).toBe(before[field] + amount);


        const others = (['wins', 'losses', 'draws'] as (keyof Stats)[]).filter(f => f !== field);
        for (const f of others) {
            expect(after[f]).toBe(before[f]);
        }
    }
}
