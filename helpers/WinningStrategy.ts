import { Page } from '@playwright/test';
import { SELECTORS, TIMEOUTS } from '../config/constants';

type Board = (string | null)[];   // 9 cells: 'X', 'O', or null

// ── Board reading ─────────────────────────────────────────────────────────────

/**
 * Reads the current board from the DOM.
 * Returns a 9-element array: 'X', 'O', or null for empty cells.
 */
export async function readBoard(page: Page): Promise<Board> {
    const cells = page.locator(SELECTORS.cell);
    const board: Board = [];

    for (let i = 0; i < 9; i++) {
        const text = ((await cells.nth(i).textContent()) ?? '').trim().toUpperCase();
        board.push(text === 'X' || text === 'O' ? text : null);
    }
    return board;
}

// ── Move selection ────────────────────────────────────────────────────────────

/**
 * Finds a winning move index for `player`. Returns null if none exists.
 */
function findWinningMove(board: Board, player: string): number | null {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columns
        [0, 4, 8], [2, 4, 6],              // diagonals
    ];

    for (const [a, b, c] of lines) {
        const vals = [board[a], board[b], board[c]];
        if (
            vals.filter(v => v === player).length === 2 &&
            vals.filter(v => v === null).length === 1
        ) {
            return [a, b, c].find(i => board[i] === null) ?? null;
        }
    }
    return null;
}

/**
 * Picks the best available cell index for `humanPlayer`.
 *
 * Priority:
 *   1. Win immediately
 *   2. Block AI from winning
 *   3. Take centre (index 4)
 *   4. Take a free corner
 *   5. Take any free cell
 */
export function pickBestMove(board: Board, humanPlayer: string): number {
    const aiPlayer = humanPlayer === 'X' ? 'O' : 'X';

    const win   = findWinningMove(board, humanPlayer);
    if (win   !== null) return win;

    const block = findWinningMove(board, aiPlayer);
    if (block !== null) return block;

    if (board[4] === null) return 4;

    const freeCorner = [0, 2, 6, 8].find(i => board[i] === null);
    if (freeCorner !== undefined) return freeCorner;

    return board.findIndex(v => v === null);
}

// ── Full game runner ──────────────────────────────────────────────────────────

/**
 * Plays a complete game using the best-move strategy.
 *
 * - On Easy difficulty this reliably produces a WIN.
 * - On Hard difficulty the AI plays optimally; the best result is a DRAW.
 *
 * Returns: 'win' | 'draw' | 'loss'
 */
export async function playToWin(
    page: Page,
    humanPlayer: 'X' | 'O' = 'X',
): Promise<'win' | 'draw' | 'loss'> {
    const cells  = page.locator(SELECTORS.cell);
    const status = page.locator(SELECTORS.status);

    for (let turn = 0; turn < 9; turn++) {
        // Check if game ended before making a move
        const statusText = (await status.textContent().catch(() => '')) ?? '';
        if (/win|won/i.test(statusText))   return 'win';
        if (/draw/i.test(statusText))      return 'draw';
        if (/loss|lost/i.test(statusText)) return 'loss';

        const board     = await readBoard(page);
        const moveIndex = pickBestMove(board, humanPlayer);

        if (moveIndex === -1) break;   // no empty cells left

        await cells.nth(moveIndex).click().catch(() => {});
        await page.waitForTimeout(TIMEOUTS.ai_move);
    }

    // Final status read
    const finalText = (await status.textContent().catch(() => '')) ?? '';
    if (/win|won/i.test(finalText))   return 'win';
    if (/draw/i.test(finalText))      return 'draw';
    return 'loss';
}
