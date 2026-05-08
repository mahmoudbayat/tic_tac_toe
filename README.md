# tic-tac-toe-qa-automation

## Project Structure

```
tic_tac_toe/
├── config/            # Constants, selectors, timeouts
├── pages/             # Page Object Model (one class per page/tab)
├── helpers/           # Shared utilities (WinStrategy, etc.)
├── fixtures/          # Extended Playwright test with page object fixtures
├── tests/
│   ├── e2e/           # Full feature tests (cross-browser)
└── .github/workflows/ # CI pipeline
```


## Quick Start

```bash
npm install
npx playwright install
npx serve install

#Run
serve .
npx playwright test