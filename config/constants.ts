export const TEST_USER = {
    name :  'TEST_USER',
    updatedName : 'TEST_UPDATED_NAME',
    specialName : '123TEST',
    unknownUser: 'TEST'
}as const
export const TIMEOUTS = {
    short:     2_000,
    default:   5_000,
    ai_move:     600,   // ms to wait for AI to respond after a player move
    animation:   400,   // ms to wait for CSS transitions / re-renders
    dialog:    4_000,   // ms to wait for a native browser dialog
} as const;

export const DIFFICULTY = {
    easy:   'Easy',
    medium: 'Medium',
    hard:   'Hard',
} as const;

export const SELECTORS = {
    // Board
    cell:       '[data-testid="cell"], .cell, .board-cell',
    filledCell: '.cell:has-text("X"), .cell:has-text("O"), [data-value="X"], [data-value="O"]',
    hintedCell: '.cell.hint, .cell.highlighted, .cell.suggested, [data-hint="true"]',

    // Status
    status: '[data-testid="status"], .status, .game-status',

    // Controls
    btnNewGame: 'button:has-text("New Game")',
    btnReset:   'button:has-text("Reset")',
    btnHint:    'button:has-text("Get Hint")',
    diffSelect: 'select',

    // Nav
    tabPlay:    'button:has-text("Play")',
    tabProfile: 'button:has-text("Profile")',
    tabHistory: 'button:has-text("History")',
    btnLogout:  'button:has-text("Log Out")',

    // History
    historyRow:      'tbody tr, [role="row"]:not([role="columnheader"])',
    btnClearHistory: 'button:has-text("Clear History")',

    // Profile stats (dl > dd)
    statsParent: 'dl, [data-testid*="profile-"]',
} as const;

