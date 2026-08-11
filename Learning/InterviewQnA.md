# Playwright Automation Interview Questions & Answers

A comprehensive guide covering Playwright interview topics — from fundamentals to advanced concepts, framework design, coding challenges, and managerial scenarios.

---

## Table of Contents

1. [Introduction & Self-Presentation](#1-introduction--self-presentation)
2. [Playwright Architecture & Speed](#2-playwright-architecture--speed)
3. [Locators & Filters](#3-locators--filters)
4. [Actions — Dropdowns, Dialogs, Frames](#4-actions--dropdowns-dialogs-frames)
5. [Screenshots & Videos](#5-screenshots--videos)
6. [Network Interception & API Mocking](#6-network-interception--api-mocking)
7. [Authentication](#7-authentication)
8. [Waits & Auto-Waiting](#8-waits--auto-waiting)
9. [Dynamic Elements](#9-dynamic-elements)
10. [Browser, BrowserContext & Page](#10-browser-browsercontext--page)
11. [Headless vs Headed Mode](#11-headless-vs-headed-mode)
12. [Fixtures](#12-fixtures)
13. [Page Object Model (POM)](#13-page-object-model-pom)
14. [Test Data Management](#14-test-data-management)
15. [Parallel Execution](#15-parallel-execution)
16. [Retries & Configuration](#16-retries--configuration)
17. [Debugging & Flaky Tests](#17-debugging--flaky-tests)
18. [Trace Viewer](#18-trace-viewer)
19. [Hooks](#19-hooks)
20. [Multi-Tab & Multi-Page Handling](#20-multi-tab--multi-page-handling)
21. [Playwright vs Selenium](#21-playwright-vs-selenium)
22. [Execution Speed Optimization](#22-execution-speed-optimization)
23. [locator() vs page.$()](#23-locator-vs-page)
24. [XPath in Playwright](#24-xpath-in-playwright)
25. [Coding Questions](#25-coding-questions)
26. [Managerial Questions](#26-managerial-questions)
27. [Tips for Interview Success](#27-tips-for-interview-success)

---

## 1. Introduction & Self-Presentation

### Tell me about yourself

**Sample Answer:**

"Hi, I'm [Your Name], a QA Automation Engineer with X years of experience in test automation. I currently work at [Company] where I'm responsible for building and maintaining our end-to-end test automation framework using Playwright with TypeScript/JavaScript.

**My day-to-day responsibilities:**
- Writing and maintaining Playwright test suites for web applications
- Designing and implementing Page Object Model architecture
- Setting up CI/CD pipelines with parallel test execution
- Mentoring junior team members on automation best practices
- Collaborating with developers on testability and shift-left testing

**Key achievements:**
- Built a Playwright framework from scratch covering 200+ test scenarios
- Reduced regression suite execution time by 60% using parallel execution and API-based test setup
- Implemented network mocking to eliminate third-party service dependencies in tests

**Tech stack:** Playwright, TypeScript, JavaScript, Git, Jenkins/GitHub Actions, Docker, REST APIs."

**Tips:**
- Keep it 60–90 seconds
- Structure: Intro → Current role → Key skills → Achievement
- Mention measurable results (e.g., "Reduced test time by 60%")
- Tailor to the job description

### Walk me through your project and framework

Focus on:
- Architecture (POM, fixtures, test data management)
- Tech stack choices and why
- How tests run in CI/CD
- Reporting and failure analysis workflow
- How you handle flaky tests and maintenance

---

## 2. Playwright Architecture & Speed

### What makes Playwright faster than Selenium?

**Answer:**

Playwright is faster primarily because of its **architecture** — it communicates directly with the browser via WebSocket (DevTools Protocol), eliminating the HTTP-based driver layer that Selenium uses.

**Selenium architecture (slower):**

```
Test Script → WebDriver Client → WebDriver Server → Browser Driver → Browser
                     (HTTP request/response for every command)
```

**Playwright architecture (faster):**

```
Test Script → Playwright → Browser
                (WebSocket — persistent, bidirectional connection)
```

| Factor | Selenium | Playwright |
|--------|----------|-----------|
| Communication | HTTP protocol (new connection per command) | WebSocket (persistent, bidirectional) |
| Driver management | Requires separate browser drivers (chromedriver, geckodriver) | No drivers needed — bundles browser binaries |
| Waiting | Manual explicit/implicit waits | Built-in auto-waiting for every action |
| Parallelism | Requires Grid setup or TestNG threading | Native parallel workers out of the box |
| Browser launch | Heavy — new process + driver handshake | Lightweight — direct protocol connection |
| Context isolation | New browser instance per session (expensive) | BrowserContext (lightweight, fast to create) |

**Additional speed advantages:**
- No driver version mismatch — Playwright ships with compatible browser versions
- BrowserContext creation is nearly instant vs launching a new browser
- Auto-waiting eliminates wasted time from `Thread.sleep()` and unnecessary explicit waits
- Network interception is native — no need for external proxy servers

---

## Hello World — Your First Playwright Test

### Write a basic test that navigates to google.com

```javascript
import { test, expect } from '@playwright/test';

test('navigate to Google', async ({ page }) => {
  await page.goto('https://www.google.com');
  await expect(page).toHaveTitle(/Google/);
});
```

**Run it:**

```bash
npx playwright test tests/hello.spec.js --headed
```

### Breaking it down

```javascript
test('navigate to Google', async ({ page }) => {
//                                    ^^^^^^
//                              This is the PAGE FIXTURE
```

- `test` — defines a test case with a name and function
- `{ page }` — Playwright automatically launches a browser, creates a context, opens a tab, and gives you this `page` object
- `page.goto()` — navigates to the URL
- `expect(page).toHaveTitle()` — asserts the page title (auto-retries until condition is met)
- After the test finishes, Playwright closes the page, context, and cleans up — you don't write any teardown code

**Without the fixture (manual way — DON'T do this in tests):**

```javascript
import { chromium } from 'playwright';

async function first_test() {
  const browser = await chromium.launch();       // Step 1: Launch browser
  const context = await browser.newContext();    // Step 2: Create context
  const page = await context.newPage();         // Step 3: Open tab
  await page.goto('https://www.google.com');    // Step 4: Navigate
  await browser.close();                        // Step 5: Cleanup
}

first_test();
```

The fixture approach eliminates all that boilerplate — zero setup, zero teardown, automatic isolation.

---

## Browser, Context & Page — The Core Building Blocks

### What is Browser, BrowserContext, and Page in Playwright?

These three form a hierarchy — understanding them is key to writing isolated, parallel-safe tests.

```
Browser (Chromium/Firefox/WebKit instance)
│
├── BrowserContext 1 (isolated session — like an incognito window)
│   ├── Page 1 (tab) — shares cookies/storage with Page 2
│   └── Page 2 (tab) — shares cookies/storage with Page 1
│
├── BrowserContext 2 (completely separate session)
│   └── Page 3 (tab) — has NO access to Context 1's cookies
│
└── BrowserContext 3
    └── Page 4
```

| Concept | What it is | Example | Isolation |
|---------|-----------|---------|-----------|
| **Browser** | The browser application itself | `chromium.launch()` | One per worker, shared across tests |
| **BrowserContext** | An isolated session within the browser | `browser.newContext()` | Full isolation: cookies, localStorage, cache |
| **Page** | A single tab/window within a context | `context.newPage()` | Shares session with other pages in same context |

### Detailed Example

```javascript
import { chromium } from 'playwright';

async function browserContextDemo() {
  // 1. BROWSER — Launch a single browser instance
  const browser = await chromium.launch({ headless: false });

  // 2. CONTEXT — Create an isolated session (like opening incognito)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
  });

  // 3. PAGE — Open tabs within the context
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  // Both pages share the SAME session (cookies, localStorage)
  await page1.goto('https://myapp.com/login');
  await page1.fill('#username', 'admin');
  await page1.fill('#password', 'password');
  await page1.click('#login-btn');

  // page2 is already logged in — same context shares the session!
  await page2.goto('https://myapp.com/dashboard');
  // No login required on page2 ✓

  // 4. Create a DIFFERENT context — completely isolated
  const context2 = await browser.newContext();
  const page3 = await context2.newPage();
  await page3.goto('https://myapp.com/dashboard');
  // page3 will ask for login — different context = different session ✗

  await browser.close();
}

browserContextDemo();
```

### Real-World Analogy

Think of it like a **browser on your computer:**

- **Browser** = Chrome application (one running instance)
- **BrowserContext** = A user profile or incognito window (each has its own cookies, history, storage)
- **Page** = A tab within that profile (tabs in the same profile share login sessions)

Opening a new incognito window (new Context) starts fresh — no cookies, no login. Opening a new tab (new Page) in the same window keeps your session intact.

### In Playwright Test (what happens behind the scenes)

```javascript
import { test, expect } from '@playwright/test';

test('my test', async ({ page, context, browser }) => {
  // Playwright automatically does this for each test:
  // 1. Reuses the shared Browser instance (per worker)
  // 2. Creates a FRESH BrowserContext (isolation per test)
  // 3. Opens a new Page inside that context
  // 4. Passes `page` to your test
  // 5. After test → closes context (cleanup)
});
```

You get **automatic test isolation** — every test starts with a clean slate (no cookies, no localStorage from previous tests).

### When to use what

| Scenario | Use |
|----------|-----|
| Multi-user testing (e.g., User A and User B) | Separate BrowserContexts |
| Multi-tab testing (same user, multiple tabs) | Multiple Pages in one Context |
| Session/auth reuse | `storageState` on the Context |
| Complete isolation between tests | Default — Playwright creates fresh Context per test |

---

## 3. Locators & Filters

### Filters in Playwright Locators

Locator filters narrow down matched elements based on content, child elements, or absence of certain text/elements.

#### `filter({ hasText })` — Filter by text content

```typescript
await page.locator('li').filter({ hasText: 'Playwright' }).click();
await page.locator('.card').filter({ hasText: /\$[0-9]+/ }).click(); // Regex support
```

#### `filter({ hasNotText })` — Exclude by text content

```typescript
const availableProducts = page.locator('.product-card').filter({ hasNotText: 'Out of stock' });
await expect(availableProducts).toHaveCount(5);
```

#### `filter({ has })` — Filter by child element

```typescript
await page.locator('tr').filter({ has: page.getByRole('button', { name: 'Edit' }) }).click();
await page.locator('.card').filter({ has: page.locator('img') }).click();
```

#### `filter({ hasNot })` — Exclude by child element

```typescript
const protectedRows = page.locator('tr').filter({ hasNot: page.locator('button.delete') });
await expect(protectedRows).toHaveCount(2);
```

#### Combining Filters (Chaining)

```typescript
await page.locator('.product-card')
  .filter({ hasText: 'iPhone' })
  .filter({ has: page.getByRole('button', { name: 'Add to Cart' }) })
  .click();
```

#### Real-World Example

```typescript
const johnRow = page.locator('tr').filter({ hasText: 'John' });
await johnRow.getByRole('button', { name: 'Edit' }).click();
```

**Summary:**

| Filter | Purpose | Example |
|--------|---------|---------|
| `hasText` | Match elements containing text | `.filter({ hasText: 'Submit' })` |
| `hasNotText` | Exclude elements with text | `.filter({ hasNotText: 'Disabled' })` |
| `has` | Match elements with a specific child locator | `.filter({ has: page.locator('img') })` |
| `hasNot` | Exclude elements with a specific child locator | `.filter({ hasNot: page.locator('.badge') })` |

---

## 4. Actions — Dropdowns, Dialogs, Frames

### How do you select a value from a dropdown?

```typescript
// By label (preferred — most stable)
await page.locator('select#country').selectOption({ label: 'India' });

// By value attribute
await page.locator('select#country').selectOption({ value: 'IN' });

// By visible text directly
await page.locator('select#country').selectOption('India');

// By index
await page.locator('select#country').selectOption({ index: 5 });

// Multi-select
await page.selectOption('#colors', ['red', 'blue', 'green']);
```

**For custom dropdowns (non-`<select>`):**

```typescript
await page.locator('.dropdown-trigger').click();
await page.locator('.dropdown-option').filter({ hasText: 'India' }).click();

// Or using role locators
await page.getByRole('combobox').click();
await page.getByRole('option', { name: 'India' }).click();
```

### How do you handle dialogs/alerts?

```typescript
// Register handler BEFORE the action that triggers the dialog
page.on('dialog', async (dialog) => {
  console.log('Dialog type: ' + dialog.type());
  console.log('Dialog message: ' + dialog.message());
  await dialog.accept();  // or dialog.dismiss()
});

await page.locator('#alert-btn').click();
```

**Why register the handler BEFORE the action?**

Dialogs are **synchronous and blocking** — when `window.alert()` fires, the browser pauses all execution immediately. If you click first and then register the handler, the dialog blocks everything before your handler code runs, causing a timeout. Register first = catcher is ready before the ball is thrown.

**Confirm dialog:**

```typescript
page.on('dialog', async (d) => {
  expect(d.type()).toContain('confirm');
  expect(d.message()).toEqual('Are you sure?');
  await d.accept(); // or d.dismiss() for Cancel
});
await page.click('#delete-button');
```

**Prompt dialog:**

```typescript
page.on('dialog', async (d) => {
  await d.accept('My Answer'); // Pass input text
});
await page.click('#prompt-btn');
```

### How do you handle Frames/iFrames?

```typescript
// Using frameLocator (recommended)
const frame = page.frameLocator('#payment-iframe');
await frame.locator('#card-number').fill('4242424242424242');
await frame.locator('#submit').click();

// Nested iframes
const outerFrame = page.frameLocator('#outer');
const innerFrame = outerFrame.frameLocator('#inner');
await innerFrame.locator('button').click();

// Assertions inside frames
await expect(frame.locator('.success')).toBeVisible();
```

**Key Points:**
- `frameLocator()` is the modern, chainable API (replaces `frame()`)
- Dialogs MUST have handlers set BEFORE the triggering action
- Custom dropdowns need click-based interaction, not `selectOption()`

---

## 5. Screenshots & Videos

### How do you take screenshots in Playwright?

```typescript
// Full page screenshot (captures entire scrollable page)
await page.screenshot({ path: 'screenshots/fullpage.png', fullPage: true });

// Viewport only (what's currently visible)
await page.screenshot({ path: 'screenshots/viewport.png' });

// Element screenshot
await page.locator('.hero-banner').screenshot({ path: 'screenshots/banner.png' });

// Clipped area
await page.screenshot({
  path: 'screenshots/clipped.png',
  clip: { x: 0, y: 0, width: 300, height: 200 },
});
```

**Auto-capture in config:**

```javascript
const config = ({
  use: {
    screenshot: 'on', // 'on', 'only-on-failure', 'off'
  }
});
module.exports = config;
```

### How do you record videos?

```javascript
const config = ({
  use: {
    video: 'on-first-retry', // 'on', 'off', 'on-first-retry', 'retain-on-failure'
  }
});
module.exports = config;
```

**Access video in test:**

```typescript
test('record video', async ({ page }, testInfo) => {
  await page.goto('https://example.com');
  const video = page.video();
  if (video) {
    const path = await video.path();
    await testInfo.attach('video', { path, contentType: 'video/webm' });
  }
});
```

**Key Points:**
- `fullPage: true` captures the entire scrollable page
- Videos are `.webm` format
- `retain-on-failure` keeps videos only for failed tests (saves disk space)
- Screenshots/videos auto-attach to HTML reports

---

## 6. Network Interception & API Mocking

### How do you capture network requests & responses?

```typescript
test('capture network traffic', async ({ page }) => {
  page.on('request', (request) => {
    console.log(`${request.method()} ${request.url()}`);
  });

  page.on('response', (response) => {
    console.log(`${response.url()} → ${response.status()}`);
  });

  await page.goto('https://example.com');
});
```

**Wait for a specific API response:**

```typescript
const responsePromise = page.waitForResponse(
  (response) => response.url().includes('/api/users') && response.status() === 200
);
await page.click('#load-users');
const response = await responsePromise;
const data = await response.json();
expect(data.users).toHaveLength(10);
```

### How can you mock API responses?

```typescript
// Return custom mock data
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ users: [{ id: 1, name: 'Alice' }] }),
  });
});
```

**Mock error responses:**

```typescript
await page.route('**/api/data', async (route) => {
  await route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server Error' }) });
});
```

**Modify real responses (partial mock):**

```typescript
await page.route('**/api/products', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  json.products[0].price = 0; // Modify
  await route.fulfill({ response, body: JSON.stringify(json) });
});
```

**Block requests:**

```typescript
await page.route('**/*google-analytics*/**', (route) => route.abort());
await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());
```

**Using HAR files:**

```typescript
await page.routeFromHAR('tests/mocks/api.har', { url: '**/api/**' });
```

**Key Points:**
- `route.fulfill()` — custom response without hitting server
- `route.fetch()` + `route.fulfill()` — modify real responses
- `route.abort()` — block requests entirely
- `route.continue()` — proceed with optional modifications
- Mocks are page-scoped; use `context.route()` for context-wide mocks

---

## 7. Authentication

### What would be your approach to handling authentication?

The best approach is **authenticate once, reuse the session state** across tests via `storageState`.

**Step 1 — Global setup (login once, save session):**

```javascript
// global-setup.js
const { chromium } = require('@playwright/test');

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://myapp.com/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('#login-btn');
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: './auth/loginState.json' });
  await browser.close();
}
module.exports = globalSetup;
```

**Step 2 — Reuse in config:**

```javascript
const config = ({
  globalSetup: require.resolve('./global-setup.js'),
  use: {
    storageState: './auth/loginState.json',
  }
});
module.exports = config;
```

**Now every test starts pre-authenticated — no login needed.**

#### Basic Auth (HTTP credentials):

```typescript
const context = await browser.newContext({
  httpCredentials: { username: 'admin', password: 'password123' },
});
```

#### Token-based Auth (inject via API):

```typescript
test('token auth', async ({ page }) => {
  const response = await page.request.post('/api/auth/login', {
    data: { username: 'user', password: 'pass' },
  });
  const { token } = await response.json();
  await page.addInitScript((t) => { localStorage.setItem('authToken', t); }, token);
  await page.goto('/dashboard');
});
```

#### Multi-role testing:

```typescript
test.describe('Admin tests', () => {
  test.use({ storageState: './auth/admin.json' });
  test('admin can delete', async ({ page }) => { /* ... */ });
});

test.describe('Viewer tests', () => {
  test.use({ storageState: './auth/viewer.json' });
  test('viewer cannot delete', async ({ page }) => { /* ... */ });
});
```

**Key Points:**
- `storageState` saves cookies + localStorage — fastest session reuse
- Global setup runs once before all tests
- API-based login is faster than UI-based for setup
- Create separate state files per user role

---

## 8. Waits & Auto-Waiting

### How does Playwright handle waits differently from Selenium?

Playwright uses **auto-waiting** built into every action. Selenium requires manual wait management.

**Playwright — auto-waits on every action:**

```typescript
await page.click('#submit');
// Automatically waits for:
// ✓ Attached to DOM
// ✓ Visible
// ✓ Stable (no animations)
// ✓ Enabled
// ✓ Receives events (not obscured)

await expect(page.locator('.success')).toBeVisible();
// Retries every 100ms until condition met or timeout
```

**Selenium — manual waits everywhere:**

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
button.click();
```

**Comparison:**

| Aspect | Selenium | Playwright |
|--------|----------|-----------|
| Click | Must wait for clickable explicitly | Auto-waits for actionability |
| Text assertion | Get text → compare manually | `expect(loc).toHaveText()` auto-retries |
| Animations | Must handle manually | Waits for element stability |
| Navigation | Waits for page load only | Waits for load + network idle |

**When you DO need explicit waits in Playwright (rare):**

```typescript
await page.waitForURL('**/dashboard');
await page.waitForResponse('**/api/data');
await page.waitForLoadState('networkidle');
```

**Anti-patterns to AVOID:**

```typescript
// ❌ NEVER
await page.waitForTimeout(3000);

// ❌ Race condition
const isVisible = await page.locator('#btn').isVisible();
if (isVisible) await page.click('#btn');

// ✅ Just act — Playwright auto-waits
await page.click('#btn');
```

---

## 9. Dynamic Elements

### How do you handle dynamic elements?

**Use text/role locators instead of dynamic IDs:**

```typescript
// Bad: dynamic ID that changes every render
await page.locator('#btn-abc123xyz');

// Good: stable locators
await page.getByRole('button', { name: 'Submit' });
await page.getByTestId('submit-button');
```

**Wait for dynamic content:**

```typescript
await expect(page.locator('.results')).toHaveCount(10);
await expect(page.locator('.price')).not.toHaveText('Loading...');
```

**Polling for dynamic values:**

```typescript
await expect(async () => {
  const count = await page.locator('.notification-count').textContent();
  expect(Number(count)).toBeGreaterThan(0);
}).toPass({ timeout: 10000 });
```

**Key Points:**
- Playwright locators are "lazy" — they re-query the DOM on every action
- Use `expect().toPass()` for custom polling assertions
- Auto-waiting handles most dynamic scenarios without explicit waits

---

## 10. Browser, BrowserContext & Page

### What's the difference between Browser, BrowserContext & Page?

```
Browser (one instance, shared)
├── BrowserContext 1 (isolated session — cookies, storage)
│   ├── Page 1 (a tab)
│   └── Page 2 (another tab — shares session with Page 1)
├── BrowserContext 2 (completely isolated from Context 1)
│   └── Page 3
```

| Concept | What it is | Isolation |
|---------|-----------|-----------|
| **Browser** | Chromium/Firefox/WebKit instance | Shared process (one per worker) |
| **BrowserContext** | Isolated browser session (like incognito) | Full: cookies, localStorage, cache |
| **Page** | A single tab within a context | Shares session with other pages in same context |

### Scenario: Two pages in the same context — will the second ask for login?

**Answer: No.** Both pages share the same cookies/localStorage.

```typescript
const context = await browser.newContext();
const page1 = await context.newPage(); // Login here
const page2 = await context.newPage(); // Already logged in — same session
```

### What if it's a different context?

**Answer: Yes.** Different contexts are completely isolated.

```typescript
const context1 = await browser.newContext();
const context2 = await browser.newContext(); // Fresh session!
const page1 = await context1.newPage(); // Logged in
const page2 = await context2.newPage(); // NOT logged in
```

```
Browser
├── Context A (logged in)
│   ├── Page 1 ✓ authenticated
│   └── Page 2 ✓ authenticated (shares session)
└── Context B (fresh)
    └── Page 3 ✗ not authenticated
```

**Key Insight:** `BrowserContext` is the session boundary. Pages in the same context share state. Pages in different contexts are isolated — like incognito vs regular windows.

---

## 11. Headless vs Headed Mode

### How do you launch browsers in headless vs headed mode?

```javascript
// In config — headless is the DEFAULT
const config = ({
  use: {
    headless: true, // true = no browser UI (faster, for CI)
  }
});
module.exports = config;
```

**CLI override:**

```bash
npx playwright test --headed     # Shows browser
npx playwright test --debug      # Headed + Inspector
```

**Environment-based:**

```javascript
headless: !process.env.HEADED  // HEADED=1 npx playwright test
```

**Key Points:**
- Headless = faster, no UI, ideal for CI
- Headed = visible browser, useful for debugging
- `--debug` automatically opens headed mode with Inspector
- Use `slowMo: 500` with headed mode for demos

---

## 12. Fixtures

### What are Playwright Fixtures and why are they useful?

Fixtures are Playwright's **dependency injection system** — they provide pre-configured, isolated objects to tests automatically.

**Built-in fixtures:**

```typescript
test('example', async ({ page, context, browser, request }) => {
  // page — fresh tab (per test)
  // context — BrowserContext owning the page
  // browser — shared Browser instance
  // request — APIRequestContext for HTTP calls
});
```

### Write code to create a custom fixture for a URL

```javascript
// utils/test-base.js
import { test as base } from '@playwright/test';

export const test = base.extend({
  pageWithUrl: async ({ page }, use) => {
    await page.goto('https://rahulshettyacademy.com/client');
    await use(page); // Pass navigated page to test
  },

  appUrl: async ({}, use) => {
    await use('https://rahulshettyacademy.com/client');
  }
});
export { expect } from '@playwright/test';
```

**Using in a test:**

```javascript
import { test } from './utils/test-base';
import { expect } from '@playwright/test';

test('dashboard loads', async ({ pageWithUrl }) => {
  await expect(pageWithUrl.locator('h1')).toBeVisible();
});

test('use URL fixture', async ({ page, appUrl }) => {
  await page.goto(appUrl);
  await expect(page).toHaveURL(/client/);
});
```

**Why fixtures are useful:**
1. **Isolation** — Each test gets its own instance (no shared state leaks)
2. **Lazy initialization** — Only runs if the test actually uses it
3. **Automatic cleanup** — Teardown runs after `use()`, even if test fails
4. **Composability** — Fixtures can depend on other fixtures
5. **Encapsulation** — Complex setup hidden from test code

---

## 13. Page Object Model (POM)

### How do you implement POM in Playwright?

**POM with Fixture (recommended):**

```typescript
// pageObjects/POFixture.ts
import { test as base } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";

export const test = base.extend({
  poManager: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      dashboardPage: new DashboardPage(page),
    });
  }
});
export { expect } from "@playwright/test";
```

**Page class:**

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('email@example.com');
    this.passwordInput = page.getByPlaceholder('enter your passsword');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() { await this.page.goto('/login'); }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

**Using in tests:**

```typescript
import { test } from "./pageObjects/POFixture";

test('End to end journey', async ({ poManager }) => {
  const { loginPage, dashboardPage } = poManager;
  await loginPage.goto();
  await loginPage.login("sriramkukkadapu@gmail.com", "Test1234!");
  await dashboardPage.searchProductAndAddtoCart("ZARA COAT 3");
});
```

**Best Practices:**
- One class per page/component
- Locators in constructor, actions as methods
- Use fixtures to inject page objects
- Don't put assertions inside page objects (exception: verification methods)

---

## 14. Test Data Management

### How do you manage test data?

**JSON fixture files:**

```typescript
import testData from '../testData/loginTestData.json';
await page.fill('#email', testData.email);
await page.fill('#password', testData.password);
```

**Data-driven tests (multiple users):**

```typescript
import users from '../testData/users.json';

for (const user of users) {
  test(`Login as ${user.email}`, async ({ page }) => {
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.click('#login');
  });
}
```

**Test data as fixture:**

```typescript
export const test = base.extend({
  testDataForLogin: async ({}, use) => {
    await use({ email: "user@example.com", password: "Test1234!" });
  }
});
```

**API-generated data (setup/teardown):**

```typescript
test.beforeAll(async ({ request }) => {
  const response = await request.post('/api/orders', { data: { product: 'Widget' } });
  orderId = (await response.json()).id;
});

test.afterAll(async ({ request }) => {
  await request.delete(`/api/orders/${orderId}`);
});
```

**Key Principles:**
- Separate test data from test logic
- Environment variables for sensitive data
- Generate unique data for parallel tests
- Clean up after tests

---

## 15. Parallel Execution

### How do you handle parallel test execution?

**Method 1 — Global config (recommended):**

```javascript
const config = ({
  workers: 10,           // Number of parallel threads
  fullyParallel: true,   // Each test in spec file runs independently
});
module.exports = config;
```

**Method 2 — Per spec file:**

```javascript
test.describe.configure({ mode: 'parallel' }); // Only this file
```

**Sharding for CI (distribute across machines):**

```bash
npx playwright test --shard=1/4   # Machine 1
npx playwright test --shard=2/4   # Machine 2
npx playwright test --shard=3/4   # Machine 3
npx playwright test --shard=4/4   # Machine 4
```

**Key Points:**
- Each worker = isolated browser (no shared state)
- `fullyParallel: true` = individual tests within a file also run in parallel
- Use unique test data per test to avoid conflicts
- `test.describe.configure({ mode: 'serial' })` for dependent tests
- Workers × Shards = total parallelism in CI

---

## 16. Retries & Configuration

### How do you configure retries?

```javascript
const config = ({
  retries: 2, // Keep at TOP LEVEL, not inside `use`
});
module.exports = config;
```

**Per-test retry:**

```typescript
test.describe.configure({ retries: 3 });
```

**Detecting retries in code:**

```typescript
test('retry-aware', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    console.log(`Retry attempt: ${testInfo.retry}`);
  }
});
```

**CLI override:**

```bash
npx playwright test --retries=3
```

**Key Points:**
- Retries re-run the entire test including `beforeEach` hooks
- Each retry gets a fresh browser context
- Combine with `video: 'on-first-retry'` to capture video on retries only
- Don't put `retries` inside `use` — it applies globally at the top level

---

## 17. Debugging & Flaky Tests

### What strategies do you use to debug flaky tests?

**1. Enable Trace Viewer:**

```javascript
use: { trace: 'on-first-retry' }
```

**2. Reproduce flakiness:**

```bash
npx playwright test --repeat-each=10 --reporter=list tests/flaky-test.spec.ts
```

**3. Common causes and solutions:**

| Cause | Solution |
|-------|----------|
| Timing issues | Use `expect(locator).toBeVisible()` instead of hard waits |
| Race conditions | Use `page.waitForResponse()` |
| Shared state | Ensure test isolation with fresh contexts |
| Animation interference | Disable animations in config |
| Network instability | Mock unreliable external APIs |

**4. Debug mode:**

```bash
npx playwright test --headed --debug
```

**5. Verbose logging:**

```typescript
page.on('console', (msg) => console.log('BROWSER:', msg.text()));
page.on('pageerror', (err) => console.error('PAGE ERROR:', err.message));
page.on('requestfailed', (req) => console.log('FAILED:', req.url()));
```

**6. Isolate the test:**

```bash
npx playwright test tests/specific-test.spec.ts --workers=1
```

---

## 18. Trace Viewer

### How do you use Trace Viewer for debugging?

**Enable:**

```javascript
use: { trace: 'on-first-retry' } // or 'on', 'retain-on-failure'
```

**Open:**

```bash
npx playwright show-trace test-results/test-name/trace.zip
npx playwright show-report  # HTML report links to traces
```

**What Trace Viewer shows:**
1. Timeline of all actions with timing
2. DOM Snapshots before/after each action
3. Network requests with payloads
4. Console messages
5. Source code with current action highlighted
6. Actionability logs (why a click waited)

**Debugging workflow:**
```
Test fails → Open trace → Click failing action → Check "Before" snapshot → 
Check network tab → Check console → Compare Before/After snapshots
```

---

## 19. Hooks

### What are hooks and where have you used them?

Hooks are lifecycle methods that run before/after tests for setup and teardown.

| Hook | When it runs |
|------|-------------|
| `test.beforeAll()` | Once before ALL tests in a describe block |
| `test.afterAll()` | Once after ALL tests in a describe block |
| `test.beforeEach()` | Before EACH test |
| `test.afterEach()` | After EACH test |

**Example:**

```javascript
test.describe('Dashboard Tests', () => {
  test.beforeAll(async () => {
    console.log('Seed test data via API');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://myapp.com/dashboard');
    await expect(page.locator('.dashboard-header')).toBeVisible();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png`, fullPage: true });
    }
  });

  test.afterAll(async () => {
    console.log('Clean up test data');
  });

  test('verify welcome message', async ({ page }) => {
    await expect(page.locator('.welcome')).toHaveText('Welcome, Admin');
  });
});
```

**Where I use hooks:**
- `beforeEach` — Navigate to base page, wait for page load
- `afterEach` — Screenshot on failure, attach to report
- `beforeAll` — Create test data via API
- `afterAll` — Cleanup created data

---

## 20. Multi-Tab & Multi-Page Handling

### You have 5 tabs open — how do you switch to the 3rd page?

```javascript
test('switch to 3rd tab', async ({ context, page }) => {
  // Page 1 already open (from fixture)
  await page.goto('https://example.com');

  // Open more pages
  const page2 = await context.newPage();
  await page2.goto('https://google.com');

  const page3 = await context.newPage();
  await page3.goto('https://github.com');

  const page4 = await context.newPage();
  await page4.goto('https://stackoverflow.com');

  const page5 = await context.newPage();
  await page5.goto('https://playwright.dev');

  // Get all open pages
  const allPages = context.pages();
  console.log('Total pages: ' + allPages.length); // 5

  // Switch to 3rd page (zero-indexed)
  const thirdPage = allPages[2];
  await thirdPage.bringToFront();

  // Interact with the 3rd page
  await expect(thirdPage).toHaveURL(/github/);
});
```

**Key Points:**
- `context.pages()` returns array of all Page objects
- Zero-indexed — 3rd page = `allPages[2]`
- `page.bringToFront()` brings the tab into focus
- Unlike Selenium, no `switchTo().window()` needed — you directly reference the Page

### Handling new tab opened by clicking a link:

```javascript
const [newPage] = await Promise.all([
  context.waitForEvent('page'),       // Wait for new tab
  page.locator('a#external').click()  // Click opens new tab
]);
await newPage.waitForLoadState();
// Now interact with newPage
```

---

## 21. Playwright vs Selenium

### Share a scenario where Playwright is better

**Scenario: Testing a real-time collaborative editor (like Google Docs)**

| Aspect | Playwright | Selenium |
|--------|-----------|----------|
| Multi-browser contexts | Native | Requires multiple WebDriver instances |
| Network interception | Built-in `page.route()` | Requires BrowserMob Proxy |
| WebSocket handling | Native | No built-in support |
| Auto-waiting | Built-in for all actions | Manual WebDriverWait |
| Speed | WebSocket, no HTTP overhead | JSON Wire Protocol adds latency |
| Multi-tab | Native context/page management | Complex window handle switching |
| iFrame handling | `frameLocator()` chainable | Explicit `switchTo().frame()` |
| Shadow DOM | Native support | Limited, needs JS execution |

**Two users collaborating:**

```typescript
test('two users edit same document', async ({ browser }) => {
  const user1Context = await browser.newContext({ storageState: './auth/user1.json' });
  const user2Context = await browser.newContext({ storageState: './auth/user2.json' });

  const user1Page = await user1Context.newPage();
  const user2Page = await user2Context.newPage();

  await user1Page.goto('/docs/shared-doc');
  await user2Page.goto('/docs/shared-doc');

  await user1Page.locator('.editor').type('Hello from User 1');
  await expect(user2Page.locator('.editor')).toContainText('Hello from User 1');
});
```

---

## 22. Execution Speed Optimization

### How do you optimize test execution speed?

1. **Parallel execution** — `workers: 10`, `fullyParallel: true`
2. **Reuse auth state** — `storageState` (saves 2-5s per test)
3. **Block unnecessary resources:**
   ```typescript
   await page.route('**/*.{png,jpg,svg}', (route) => route.abort());
   await page.route('**/analytics/**', (route) => route.abort());
   ```
4. **API for setup instead of UI** (saves 5-15s per test)
5. **Sharding in CI** — Linear scaling across machines
6. **Disable unnecessary features:**
   ```javascript
   use: { video: 'off', screenshot: 'only-on-failure', trace: 'on-first-retry' }
   ```

---

## 23. locator() vs page.$()

| Feature | `page.locator()` | `page.$()` |
|---------|-----------------|------------|
| Return type | Locator (lazy reference) | ElementHandle (eager) |
| Auto-waiting | Yes | No — returns null if not found |
| Re-evaluation | Re-queries DOM on every action | Stale after DOM changes |
| Recommended | Yes — modern API | No — legacy, may be deprecated |
| Assertions | Works with `expect(locator)` | Manual checks |

```typescript
// locator — never goes stale
const counter = page.locator('.count');
await expect(counter).toHaveText('0');
await page.click('#increment');
await expect(counter).toHaveText('1'); // Re-queries DOM

// $() — can go stale
const button = await page.$('#submit');
// If DOM re-renders, button reference becomes invalid!
```

**Always use `locator()` in modern Playwright.**

---

## 24. XPath in Playwright

### Write an XPath for an element

```typescript
// XPath by text
await page.locator("//a[text()='Docs']").click();

// XPath with contains
await page.locator("//a[contains(text(),'Doc')]").click();

// XPath by attribute
await page.locator("//a[contains(@href,'/docs')]").click();
```

**But prefer role-based locators over XPath:**

```typescript
// Better — more readable and resilient
await page.getByRole('link', { name: 'Docs' }).click();
```

**When to use XPath:** Complex DOM traversal (parent/sibling), legacy apps without semantic HTML.
**When NOT to use:** If `getByRole()`, `getByText()`, or `getByTestId()` can do the job.

---

## 25. Coding Questions

### Count vowels and consonants in your name

**Java:**

```java
public class VowelConsonantCounter {
    public static void main(String[] args) {
        String name = "Sriram Kukkadapu";
        int vowels = 0, consonants = 0;
        String lower = name.toLowerCase();

        for (int i = 0; i < lower.length(); i++) {
            char ch = lower.charAt(i);
            if (ch >= 'a' && ch <= 'z') {
                if ("aeiou".indexOf(ch) != -1) vowels++;
                else consonants++;
            }
        }
        System.out.println("Vowels: " + vowels);       // 6
        System.out.println("Consonants: " + consonants); // 9
    }
}
```

**TypeScript:**

```typescript
function countVowelsAndConsonants(name: string): void {
  let vowels = 0, consonants = 0;
  for (const char of name.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      'aeiou'.includes(char) ? vowels++ : consonants++;
    }
  }
  console.log(`Vowels: ${vowels}, Consonants: ${consonants}`);
}
countVowelsAndConsonants('Sriram Kukkadapu'); // Vowels: 6, Consonants: 9
```

---

### Find unique & duplicate characters WITHOUT using Collections

**Java:**

```java
public class UniqueDuplicateFinder {
    public static void main(String[] args) {
        String name = "SriramKukkadapu".toLowerCase();
        int[] charCount = new int[26]; // No Collections — just an array

        for (int i = 0; i < name.length(); i++) {
            charCount[name.charAt(i) - 'a']++;
        }

        System.out.print("Unique: ");
        for (int i = 0; i < 26; i++)
            if (charCount[i] == 1) System.out.print((char)(i + 'a') + " ");

        System.out.print("\nDuplicate: ");
        for (int i = 0; i < 26; i++)
            if (charCount[i] > 1) System.out.print((char)(i + 'a') + "(" + charCount[i] + ") ");
    }
}
// Output: Unique: d i m p s u | Duplicate: a(3) k(3) r(2)
```

---

### Find the Longest Substring without repeating characters

**Java (Sliding Window):**

```java
public static int lengthOfLongestSubstring(String s) {
    int[] lastIndex = new int[128];
    java.util.Arrays.fill(lastIndex, -1);
    int maxLength = 0, start = 0;

    for (int end = 0; end < s.length(); end++) {
        char ch = s.charAt(end);
        if (lastIndex[ch] >= start) start = lastIndex[ch] + 1;
        lastIndex[ch] = end;
        maxLength = Math.max(maxLength, end - start + 1);
    }
    return maxLength;
}
// "abcabcbb" → 3 ("abc")
// "pwwkew" → 3 ("wke")
```

**TypeScript:**

```typescript
function longestSubstring(s: string): number {
  const lastIndex = new Map<string, number>();
  let maxLen = 0, start = 0;

  for (let end = 0; end < s.length; end++) {
    if (lastIndex.has(s[end]) && lastIndex.get(s[end])! >= start) {
      start = lastIndex.get(s[end])! + 1;
    }
    lastIndex.set(s[end], end);
    maxLen = Math.max(maxLen, end - start + 1);
  }
  return maxLen;
}
```

**Complexity:** Time O(n), Space O(1) for fixed character set.

---

## 26. Managerial Questions

### The deadline is near. How would you distribute tasks?

**Structured approach:**

1. **Assess** — List remaining work, identify blockers and risks
2. **Prioritize** — Must-have (P0) vs Nice-to-have (P2)
3. **Match to strengths** — Complex tasks → experienced people
4. **Communicate** — Daily 15-min standups, shared board with ownership
5. **Risk mitigation** — Assign biggest risk first, have backup plan

**Sample answer:**

> "When a deadline is tight, I first list all remaining work and prioritize into must-have vs nice-to-have. I match tasks to team members based on their strengths — this isn't the time for stretch assignments. I assign highest-risk items to senior people and take on blocker-resolution myself. I set up daily syncs to surface issues early and communicate transparently with stakeholders about what's realistic. If needed, I negotiate scope — it's better to deliver fewer things well than everything poorly."

---

## 27. Tips for Interview Success

1. **Demonstrate depth, not just breadth** — Give the "why" not just the "how"
2. **Code on screen** — Practice writing without IDE autocomplete
3. **Think aloud** — Interviewers want to see your problem-solving process
4. **Ask clarifying questions** — Shows maturity and real-world experience
5. **Relate to real projects** — "In my last project, we faced X and solved it with Y"
6. **Know the trade-offs** — Every decision has pros and cons
7. **Stay current** — Mention recent Playwright features (component testing, UI mode, trace viewer)

> Interviewers don't just check if you can write code — they want to know you understand concepts like Browser, BrowserContext, Page, session sharing, fixtures, and auto-waiting. Understanding the "why" behind Playwright's design shows you truly know the framework.

---

*Good luck with your interview preparation!*

---

## Senior SDET — Real-World Playwright Questions

If you're preparing for a Senior SDET / QA Automation / Playwright + TypeScript interview, don't just learn Playwright syntax. Be ready to explain how you **solve real automation problems**.

---

### How do you handle flaky tests in Playwright?

**Answer:**

I first identify the root cause instead of simply increasing retries. I check for:

- Unstable locators
- Hard-coded waits
- Race conditions
- Test data dependencies
- Network/API delays
- Shared state between tests

Then I apply these solutions:

- **Playwright auto-waiting** — every action auto-waits for actionability
- **Reliable locators** — `getByRole()`, `getByTestId()` over fragile CSS
- **Web-first assertions** — `expect(locator).toBeVisible()` auto-retries
- **Isolated test data** — each test creates its own data, no shared state
- **Proper synchronization** — `waitForResponse()`, `waitForURL()` where needed

```typescript
// Bad — hard wait, flaky
await page.waitForTimeout(3000);
await page.click('#btn');

// Good — auto-waits, reliable
await expect(page.locator('#btn')).toBeVisible();
await page.click('#btn');
```

---

### How do you handle authentication in Playwright?

**Answer:**

For large test suites, I prefer using **authentication state** instead of logging in before every test.

```typescript
// Save auth state after login (run once in global setup)
await page.context().storageState({
  path: 'playwright/.auth/user.json'
});
```

The authenticated state is then reused across tests:

```javascript
// playwright.config.js
const config = ({
  use: {
    storageState: 'playwright/.auth/user.json',
  }
});
module.exports = config;
```

**Benefits:**
- Faster execution — no login per test
- Less duplicate login code
- Better scalability
- Reduced total test execution time

---

### How would you test both UI and API in the same Playwright framework?

**Answer:**

I use Playwright's built-in API capabilities alongside browser automation. This gives a single framework for both UI and API testing.

```typescript
import { test, expect } from '@playwright/test';

test('API + UI combined', async ({ page, request }) => {
  // API: Create test data quickly
  const response = await request.post('/api/orders', {
    data: { product: 'Widget', quantity: 1 }
  });
  expect(response.ok()).toBeTruthy();
  const { orderId } = await response.json();

  // UI: Verify the order appears on the page
  await page.goto(`/orders/${orderId}`);
  await expect(page.locator('.order-status')).toHaveText('Pending');
});
```

**API testing is used for:**
- Backend validation
- Test data creation (faster than UI)
- Faster setup/teardown
- Response validation (status codes, schemas, body)

**UI tests then validate** the complete user journey end-to-end.

---

### How do you run Playwright tests in parallel?

**Answer:**

Playwright Test supports parallel execution using workers.

```bash
npx playwright test --workers=4
```

Or configure in config:

```javascript
const config = ({
  workers: 10,
  fullyParallel: true,
});
module.exports = config;
```

Parallel execution can significantly reduce regression time — but tests **must be independent** and free from shared-state dependencies.

**Key rules for parallel tests:**
- Each test creates its own data
- No test depends on another test's outcome
- Use unique identifiers (timestamps, worker index)
- Don't share mutable variables across tests

---

### How would you design a scalable Playwright framework?

**Answer:**

My framework structure:

```
framework/
├── pages/              # Page Objects
├── fixtures/           # Custom fixtures (auth, data, pages)
├── testData/           # JSON files, environment configs
├── api/                # API client utilities
├── utils/              # Helpers (date, string, file utils)
├── config/             # Environment management
├── auth/               # Storage state files per role
├── tests/              # Test spec files
├── reports/            # HTML, Allure, screenshots
└── .github/workflows/  # CI/CD pipeline
```

**Design principles I focus on:**

| Principle | How |
|-----------|-----|
| Reusability | Page Objects + shared fixtures |
| Test isolation | Fresh context per test, unique data |
| Parallel execution | Independent tests, no shared state |
| Maintainability | POM pattern, DRY, clean structure |
| Reliable reporting | HTML reports, screenshots on failure, trace on retry |
| UI + API coverage | Combined in one framework using `request` fixture |
| CI/CD integration | GitHub Actions / Jenkins with sharding |

---

### Bonus: What is the biggest mistake in Playwright automation?

**Answer:**

> Writing tests that work on your machine but are unreliable in CI.

A good automation engineer designs for:

- **Local execution** — headed mode, debugging
- **CI execution** — headless, no display server
- **Parallel execution** — isolated tests, no shared state
- **Cross-browser execution** — Chromium + Firefox + WebKit

**Common mistakes that cause CI failures:**
- Hard-coded timeouts that work locally but not on slower CI machines
- Tests depending on screen resolution or viewport size
- Shared test data that causes conflicts in parallel
- Relying on network speed (mock external APIs instead)
- Screenshots/videos not configured for failure debugging

**The fix:** Always run tests in CI-like conditions locally before pushing — headless, parallel, with retries off.

---

## Reducing CI/CD Pipeline Execution Time

### "Your Playwright test suite takes 4 hours to run in the CI/CD pipeline. How would you reduce the execution time?"

This is not just a Playwright question — it tests your understanding of test architecture, parallel execution, CI/CD, and optimization.

---

#### 1. Enable Parallel Execution

Run independent tests across multiple workers instead of executing them sequentially.

```javascript
workers: 4
```

This can significantly reduce total execution time.

---

#### 2. Use Sharding

Distribute the test suite across multiple CI machines.

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

Instead of: ⏱️ 4 hours on 1 machine

You could achieve: ⚡ ~1 hour across 4 machines

---

#### 3. Avoid Unnecessary UI Tests

Not everything needs to be validated through the UI.

Use **API testing** for backend validations and test setup wherever appropriate. UI tests should focus on actual user journeys — not verifying data that an API call can confirm in milliseconds.

---

#### 4. Optimize Test Data & Setup

Avoid creating the same test data repeatedly. Use:

- API-based setup (create data via REST calls, not clicking through UI)
- Fixtures (reusable setup logic)
- Storage state (authenticate once, reuse everywhere)
- Reusable authentication (no login per test)

---

#### 5. Reduce Unnecessary Waits

Avoid hard waits like:

```typescript
// ❌ Never do this
await page.waitForTimeout(5000);
```

Prefer Playwright's auto-waiting and condition-based waits:

```typescript
// ✅ Auto-retries until condition met
await expect(page.locator('.result')).toBeVisible();
```

---

#### 6. Run Tests Based on Purpose

Instead of running the entire suite on every pipeline trigger:

| Trigger | What to run |
|---------|-------------|
| **PR / Merge Request** | Smoke tests + impacted tests only |
| **Daily (nightly)** | Full regression suite |
| **Release** | Full regression + cross-browser |

This prevents unnecessary full-suite runs on every code change.

---

#### 7. Identify Slow Tests

Use Playwright reports and CI metrics to find:

- 🐌 Slow tests (taking disproportionately long)
- ❌ Frequently failing tests (causing unnecessary retries)
- 🔁 Tests with unnecessary retries (masking real issues)

Then optimize the biggest bottlenecks first — often 20% of tests cause 80% of the execution time.

---

#### Interview Answer

> "I wouldn't simply increase the number of workers. First, I would identify where the 4 hours are being spent. Then I would use parallel execution and sharding, optimize test data and authentication setup, replace unnecessary UI validations with API checks, remove hard waits, and create different execution strategies for PR, nightly, and release pipelines."

---

#### Key Takeaway

> Good automation is not just about writing more tests. It's about building a test suite that is **fast, reliable, maintainable, and scalable**.
