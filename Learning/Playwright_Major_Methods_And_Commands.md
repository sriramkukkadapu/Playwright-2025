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

---

## 9. Playwright Cheat Sheet

A quick-reference for all major Playwright APIs organized by category.

---

### Installation & Setup

| Command / File | Description |
|----------------|-------------|
| `npm init playwright@latest` | Scaffolds config, example tests, and installs browsers |
| `npm i -D @playwright/test` then `npx playwright install` | Add to existing project |
| `playwright.config.ts` | Defines projects, base URL, timeouts, reporters, and parallelism |
| `npx playwright test` | Runs all spec files matching `testMatch` pattern |
| `npx playwright test --ui` | Interactive test explorer with time-travel debugging (UI Mode) |
| `npx playwright codegen <url>` | Records user actions and generates test code (Codegen) |

---

### Test Structure

| Method | Description |
|--------|-------------|
| `test()` | Defines a single test case. Receives a `page` fixture by default |
| `test.describe()` | Groups related tests into a named suite |
| `test.beforeAll()` | Runs once before all tests in the suite |
| `test.afterAll()` | Runs once after all tests in the suite |
| `test.beforeEach()` | Runs before every individual test — ideal for navigation or login setup |
| `test.afterEach()` | Runs after each test — used for cleanup or screenshots on failure |
| `test.only()` | Runs only the focused test(s); useful during development |
| `test.skip()` | Skips a test conditionally or unconditionally |

---

### Locators

| Locator | Description |
|---------|-------------|
| `page.getByRole()` | Locates elements by ARIA role — most recommended for accessibility-first testing |
| `page.getByText()` | Locates by visible text content, supports exact or regex matching |
| `page.getByLabel()` | Finds form inputs associated with a label element |
| `page.getByPlaceholder()` | Targets inputs by their placeholder attribute |
| `page.getByTestId()` | Uses `data-testid` attributes — great for stable, semantic selectors |
| `page.locator()` | CSS or XPath selector — flexible but less preferred than semantic locators |
| `locator.filter()` | Narrows down a locator by text or sub-locator criteria |
| `locator.nth()` | Selects the n-th match from a list of matching elements |

---

### Actions

| Method | Description |
|--------|-------------|
| `click()` | Simulates a single left-click; waits for element to be actionable first |
| `dblclick()` | Performs a double-click on the target element |
| `fill()` | Clears and types a value into an input or textarea field |
| `type()` | Types character by character — useful for triggering key events |
| `press()` | Sends a keyboard key press (e.g., `'Enter'`, `'Tab'`) |
| `hover()` | Moves the mouse pointer over an element to trigger hover states |
| `selectOption()` | Selects a dropdown option by value, label, or index |
| `check() / uncheck()` | Toggles checkboxes or radio buttons |
| `uploadFile()` | Uploads a file to an `<input type="file">` element |
| `dragTo()` | Drags an element and drops it onto a target element |

---

### Assertions (expect)

| Assertion | Description |
|-----------|-------------|
| `toBeVisible()` | Asserts the element is visible in the DOM and not hidden |
| `toBeHidden()` | Asserts the element is not visible or not in the DOM |
| `toBeEnabled() / toBeDisabled()` | Checks the interactive state of form elements |
| `toHaveText()` | Asserts the element's inner text matches a string or regex |
| `toHaveValue()` | Checks the current value of an input or select element |
| `toHaveURL()` | Validates that the page URL matches a string or regex pattern |
| `toHaveTitle()` | Asserts the page `<title>` matches a string or regex |
| `toHaveCount()` | Verifies the number of matching elements in a locator list |
| `toHaveAttribute()` | Checks a specific HTML attribute and its value on an element |
| `toHaveClass()` | Asserts that an element has a specific CSS class applied |
| `toHaveScreenshot()` | Visual regression — compares against a saved screenshot baseline |

---

### Navigation & Page

| Method | Description |
|--------|-------------|
| `page.goto()` | Navigates to a URL; waits for `load` event by default |
| `page.reload()` | Reloads the current page |
| `page.goBack() / goForward()` | Mimics browser back/forward navigation |
| `page.waitForURL()` | Waits until the page URL matches the specified pattern |
| `page.waitForLoadState()` | Waits for `load`, `domcontentloaded`, or `networkidle` |
| `page.waitForSelector()` | Waits for a CSS/XPath selector to appear in the DOM |
| `page.evaluate()` | Executes JavaScript in the browser context and returns the result |

---

### Browser & Context

| API | Description |
|-----|-------------|
| `chromium / firefox / webkit` | Three browser engines supported out-of-the-box in Playwright |
| `browser.newContext()` | Creates an isolated browser context — separate cookies, storage, and sessions |
| `context.newPage()` | Opens a new tab/page within a browser context |
| `storageState` | Save and reuse authentication state across tests to avoid repeated logins |
| `browser.newPage()` | Shortcut — creates a default context and page in one call |
| `context.addCookies()` | Injects cookies into the browser context before tests run |

---

### Fixtures & Configuration

| Setting / API | Description |
|---------------|-------------|
| `test.extend()` | Creates custom fixtures to share setup logic (e.g., logged-in page) across tests |
| `baseURL` | Set in config to prepend to all `page.goto()` calls automatically |
| `use.trace` | Set to `'on'` or `'retain-on-failure'` to capture traces for debugging |
| `use.screenshot` | Auto-capture screenshots on test failure with `'only-on-failure'` |
| `use.video` | Record a video of the test run — helpful for CI debugging |
| `workers` | Controls parallel test execution; set to `1` to run serially |
| `retries` | Number of times to retry a failing test before marking it as failed |

---

### Network & API

| Method | Description |
|--------|-------------|
| `page.route()` | Intercepts network requests — mock responses, block requests, or modify headers |
| `page.unroute()` | Removes a previously registered network interception |
| `request` fixture | Send raw HTTP requests (GET, POST, etc.) without a browser for API testing |
| `page.waitForResponse()` | Waits for a network response matching a URL pattern or predicate |
| `page.waitForRequest()` | Waits for an outgoing network request matching a given URL or predicate |

---

> **Quick Reference Priority:** `getByRole` > `getByText` > `getByTestId` > `getByLabel` > `getByPlaceholder` > `locator(css/xpath)`
