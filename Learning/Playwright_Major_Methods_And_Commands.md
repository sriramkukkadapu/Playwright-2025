# Playwright — Major Methods & Commands

> Updated: 14 May 2024

Playwright is a Node.js library to automate Browsers.

- Developed by Microsoft
- Supports Chromium, Firefox, WebKit (Safari)
- Cross Platform, Fast, Reliable
- Auto-wait, Network interception, Parallel Execution

---

## 1. Installation

```bash
npm init playwright@latest
```

→ Creates a new project with example tests.

**Runs on:**
- ✓ Chromium
- ✓ Firefox
- ✓ WebKit

---

## 2. Basic Launch

```typescript
import { test, expect } from '@playwright/test';

test('navigate to example.com', async ({ page }) => {
  await page.goto("https://example.com");
});
```

- `test` — defines a test case with a name and a function
- `{ page }` — Playwright automatically creates a browser & page for you (this is called a **fixture**)
- No need to manually launch a browser or close it — Playwright handles that behind the scenes

→ Open Browser & Navigate

---

## 3. Page Locators (Ways to find elements)

| Locator | Example | Description |
|---------|---------|-------------|
| `page.locator("css=div")` | `page.locator("css=button#submit")` | CSS Selector |
| `page.locator("//button[text()='Login']")` | `page.locator("xpath=//button[text()='Login']")` | XPath |
| `page.getByText("Sign In")` | `page.getByText("Sign In")` | By visible text |
| `page.getByRole("button")` | `page.getByRole("button", { name: "Submit" })` | By ARIA role |
| `page.getByPlaceholder("Email")` | `page.getByPlaceholder("Email")` | By placeholder |
| `page.getByTestId("user-id")` | `page.getByTestId("user-id")` | By test id attribute |

---

## 4. Common Methods

| Method | Description | Example |
|--------|-------------|---------|
| `page.goto(url)` | Navigates to a URL | `await page.goto("https://google.com")` |
| `page.click(locator)` | Clicks on an element | `await page.click("text=Login")` |
| `page.fill(locator, value)` | Fills input field | `await page.fill("#email", "test@mail.com")` |
| `page.type(locator, value)` | Types text like a user | `await page.type("#name", "John")` |
| `page.textContent(locator)` | Gets text content | `await page.textContent("h1")` |
| `page.innerText(locator)` | Gets visible text | `await page.innerText("p")` |
| `page.isVisible(locator)` | Checks element visible | `await page.isVisible("#box")` |
| `page.waitForSelector(locator)` | Waits for element | `await page.waitForSelector(".loader")` |
| `page.screenshot(options)` | Takes screenshot | `await page.screenshot({ path: "shot.png" })` |
| `page.goBack()` / `page.goForward()` | Navigate back / forward | `await page.goBack()` |

---

## 5. Assertions (Using expect)

```javascript
expect(locator).toBeVisible()          // Element is visible
expect(locator).toHaveText("Welcome")  // Element has text
expect(locator).toHaveValue("John")    // Input has value
expect(page).toHaveTitle("Home Page")  // Page title check
```

> Built-in Auto-Wait + Retry Logic

---

## 6. Run Tests

```bash
npx playwright test
```

- Runs all tests
- Parallel execution
- HTML report generated

```bash
# Run a single test file
npx playwright test tests/login.spec.ts

# Run a test by its title (grep)
npx playwright test -g "navigate to example"

# Run in headed mode (see the browser)
npx playwright test --headed
```

```bash
npx playwright show-report
```

---

## 7. Debug Commands

| Command | Description |
|---------|-------------|
| `npx playwright test --debug` | Run in debug mode (headed) |
| `npx playwright codegen` | Auto generate test script |
| `npx playwright test --ui` | Run tests with UI mode |

> Debug made easy!

---

## Project Folder Structure (Default)

```
playwright-project/
├── tests/
├── playwright.config.js
└── package.json
```

---

## Tips

- Use Locators over CSS / XPath
- Prefer `getByRole()` & `getByText()`
- Keep tests independent
- Use assertions for validation

> "Automate Smarter, Not Harder!"

---

## 8. Configuration (playwright.config.js)

Here's the full config with all important settings:

```javascript
// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
  workers: 10,            // Number of parallel worker threads
  testDir: './tests',     // Directory where tests are located
  fullyParallel: true,    // Each test in spec file runs independently
  timeout: 60 * 1000,    // Test timeout across entire project (60 seconds)
  expect: {
    timeout: 30 * 1000   // Timeout only for expect assertions (30 seconds)
  },
  reporter: 'html',       // Generates HTML report after execution
  retries: 2,             // Retry failed tests up to 2 times (keep outside `use`)
  use: {
    baseURL: process.env.BASE_URL || 'http://www.google.com',
    browserName: 'chromium',
    ignoreHttpsErrors: true,          // Ignore HTTPS certificate errors
    Permissions: ['geolocation'],     // Allow geo location sharing
    headless: true,                   // true = no browser UI (default for CI)
    screenshot: 'on',                 // 'on', 'only-on-failure', 'off'
    trace: 'on',                      // 'on', 'retain-on-failure'
    video: 'on-first-retry',          // 'on', 'on-first-retry', 'off'
    viewport: null,                   // null = use full window size
    launchOptions: {
      args: [
        "--start-maximized",
        "--disable-features=PrivateNetworkAccessPermissionPrompt"
      ],
    }
  }
});

module.exports = config;
```

### Key Config Settings Explained

| Setting | Value | Description |
|---------|-------|-------------|
| `workers` | `10` | Number of parallel threads — more workers = faster execution |
| `fullyParallel` | `true` | Each test in a spec file runs independently in parallel |
| `timeout` | `60 * 1000` | Max time for a single test to complete (60s) |
| `expect.timeout` | `30 * 1000` | Max time for assertions to pass (30s) |
| `retries` | `2` | Retry failed tests up to 2 times before marking as failed |
| `headless` | `true` | No browser UI shown (faster, used in CI) |
| `screenshot` | `'on'` | Capture screenshot after every test |
| `trace` | `'on'` | Record trace for debugging (view with `npx playwright show-trace`) |
| `video` | `'on-first-retry'` | Record video only on first retry (saves disk space) |
| `viewport: null` | `null` | Removes fixed viewport — allows `--start-maximized` to work |
| `baseURL` | `process.env.BASE_URL` | Set base URL via environment variable or default to google.com |

### Notes

- `retries` should be at the **top level**, NOT inside `use` — it applies globally
- `viewport: null` + `--start-maximized` together = full screen browser
- Pass `BASE_URL` at runtime: `BASE_URL=https://mysite.com npx playwright test`
- `ignoreHttpsErrors: true` — useful when testing on staging with self-signed certs
