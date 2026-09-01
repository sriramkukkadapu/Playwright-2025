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
28. [Capgemini Interview — Playwright + JavaScript (10-08-2026)](#28-capgemini-interview--playwright--javascript-10-08-2026)
29. [CGI Interview Questions — Playwright](#29-cgi-interview-questions--playwright)
30. [PwC SDET Interview — Playwright MCP](#30-pwc-sdet-interview--playwright-mcp)
31. [Accenture SDET Interview — JavaScript + Playwright + API Testing](#31-accenture-sdet-interview--javascript--playwright--api-testing)
32. [Accenture Interview Questions — Playwright focused](#32-accenture-interview-questions--playwright-focused)
33. [10 Playwright Interview Questions You Should Be Ready to Answer](#33-10-playwright-interview-questions-you-should-be-ready-to-answer)
34. [Playwright Interview Q&A — Real-World Answers (4+ Years Experience)](#34-playwright-interview-qa--real-world-answers-4-years-experience)

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


---

## 28. Capgemini Interview — Playwright + JavaScript (10-08-2026)

---

### 1. Introduce yourself and explain your current project and automation framework.

*(Refer to Section 1 — Introduction & Self-Presentation for a detailed sample answer)*

---

### 2. Why are we using Playwright nowadays instead of Selenium?

**Answer:**

| Aspect | Selenium | Playwright |
|--------|----------|-----------|
| Architecture | HTTP-based (WebDriver protocol) — slow | WebSocket (DevTools Protocol) — fast |
| Browser drivers | Requires separate chromedriver, geckodriver etc. | Bundles browser binaries — no driver mismatch |
| Auto-waiting | No — manual explicit/implicit waits | Yes — built into every action |
| Multi-browser | Needs separate setup per browser | Chromium + Firefox + WebKit in one API |
| Network interception | Needs BrowserMob Proxy | Built-in `page.route()` |
| Parallel execution | Needs Selenium Grid or TestNG config | Native workers out of the box |
| Debugging | Limited | Trace Viewer, Codegen, Inspector, UI Mode |
| Context isolation | New browser instance (heavy) | BrowserContext (lightweight, instant) |
| iFrames | `switchTo().frame()` — verbose | `frameLocator()` — chainable |
| Mobile emulation | Limited | Built-in device descriptors |

**Why teams are switching:**
- Faster test execution (WebSocket vs HTTP)
- Less flaky tests (auto-waiting eliminates timing issues)
- Better developer experience (Trace Viewer, Codegen, UI Mode)
- Single framework for UI + API testing
- No driver management headaches

---

### 3. What are fixtures in Playwright? How do you create a custom fixture?

**Answer:**

Fixtures are Playwright's **dependency injection system** — they provide pre-configured, isolated resources to your tests automatically with built-in setup and teardown.

**Built-in fixtures:** `page`, `context`, `browser`, `request`

**Creating a custom fixture:**

```javascript
// fixtures/test-base.js
import { test as base } from '@playwright/test';

export const test = base.extend({
  // Custom fixture: authenticated page
  authenticatedPage: async ({ page }, use) => {
    // Setup — runs before test
    await page.goto('https://myapp.com/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    await page.click('#login-btn');
    await page.waitForURL('**/dashboard');

    // Provide to test
    await use(page);

    // Teardown — runs after test (even if test fails)
    await page.goto('about:blank');
  }
});

export { expect } from '@playwright/test';
```

**Using it in a test:**

```javascript
import { test } from './fixtures/test-base';

test('dashboard shows welcome', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('.welcome')).toBeVisible();
});
```

**Key points:**
- Code before `use()` = setup
- What you pass to `use()` = what the test receives
- Code after `use()` = teardown (automatic cleanup)

---

### 4. How do you handle merge conflicts in Git?

**Answer:**

```bash
# 1. Pull the latest changes from the target branch
git pull origin main

# 2. If conflicts occur, Git marks them in the files like:
<<<<<<< HEAD
  your changes
=======
  incoming changes
>>>>>>> main

# 3. Manually resolve — decide what to keep
# 4. Stage resolved files
git add <resolved-file>

# 5. Commit the merge
git commit -m "Resolved merge conflicts"

# 6. Push
git push
```

**My approach:**
- I use VS Code's built-in merge editor — it shows both versions side by side
- For test files, I usually keep both changes (new tests from both branches)
- For config files, I carefully review what changed and merge manually
- I always run the full test suite after resolving conflicts to ensure nothing broke

**Prevention:**
- Frequent small PRs (less chance of conflicts)
- Communicate with team about shared files
- Rebase feature branches regularly

---

### 5. About flaky tests? Explain with an example.

**Answer:**

A **flaky test** is a test that sometimes passes and sometimes fails without any code changes. It's unreliable and erodes confidence in the test suite.

**Example of a flaky test:**

```javascript
// ❌ FLAKY — race condition
test('add item to cart', async ({ page }) => {
  await page.goto('/products');
  await page.click('.add-to-cart');

  // This might fail if the cart update is async and hasn't completed yet
  const count = await page.locator('.cart-count').textContent();
  expect(count).toBe('1'); // Sometimes '0' because cart hasn't updated yet!
});
```

**Why it's flaky:** The cart count updates asynchronously after clicking. Sometimes the assertion runs before the DOM updates.

**Fixed version:**

```javascript
// ✅ STABLE — uses auto-retrying assertion
test('add item to cart', async ({ page }) => {
  await page.goto('/products');
  await page.click('.add-to-cart');

  // Auto-retries until condition is met or timeout
  await expect(page.locator('.cart-count')).toHaveText('1');
});
```

**Common causes of flakiness:**
- Hard-coded waits (`waitForTimeout`)
- Race conditions (asserting before async updates)
- Shared test data (tests interfere with each other in parallel)
- Network instability (external API calls)
- Animation timing

---

### 6. How do you debug flaky or intermittent test failures?

**Answer:**

**Step-by-step approach:**

1. **Reproduce** — Run the test multiple times:
   ```bash
   npx playwright test --repeat-each=10 tests/flaky.spec.js
   ```

2. **Enable traces** — Capture what happened:
   ```javascript
   use: { trace: 'on' }
   ```
   Then: `npx playwright show-trace`

3. **Check the Trace Viewer** — Look at DOM snapshots, network calls, and timing

4. **Isolate** — Run the test alone to rule out shared state:
   ```bash
   npx playwright test tests/flaky.spec.js --workers=1
   ```

5. **Add logging** — Capture browser console and network:
   ```javascript
   page.on('console', msg => console.log('BROWSER:', msg.text()));
   page.on('requestfailed', req => console.log('FAILED:', req.url()));
   ```

6. **Fix root cause:**
   - Replace `waitForTimeout` with assertions
   - Use `waitForResponse()` for API-dependent UI
   - Isolate test data
   - Mock unstable external services

---

### 7. CI/CD — Script passing locally but failing in pipeline?

**Answer:**

**My troubleshooting approach:**

| Check | What to look for |
|-------|------------------|
| **Screenshots/Traces** | Enable `screenshot: 'on'` and `trace: 'on'` in CI config — download artifacts |
| **Headless vs Headed** | Locally you might run headed; CI is headless — some rendering differences |
| **Viewport/Resolution** | CI might have different default viewport — set explicitly in config |
| **Timing** | CI machines are often slower — avoid hard waits, rely on auto-waiting |
| **Environment** | Different base URLs, missing env vars, network restrictions |
| **Dependencies** | Browser binaries not installed — ensure `npx playwright install` runs in CI |
| **File paths** | OS differences (Windows vs Linux in CI) — use `path.join()` |
| **Parallelism** | Tests might be isolated locally but conflict in parallel on CI |

**Concrete steps:**

```bash
# 1. Run locally in headless mode (simulate CI)
npx playwright test --workers=4

# 2. Check CI logs for the exact error message

# 3. Download trace artifacts from CI and open locally
npx playwright show-trace downloaded-trace.zip

# 4. Verify env vars are set in CI pipeline

# 5. Check if browser install step exists in CI config
```

**CI/CD tools I've used:** GitHub Actions, Jenkins, GitLab CI

---

### 8. Strategies to keep test scripts reusable and maintainable as the project grows?

**Answer:**

1. **Page Object Model (POM)** — Separate locators and actions from tests
2. **Custom fixtures** — Reusable setup logic (auth, navigation, data)
3. **Utility functions** — Common helpers (date formatting, data generation)
4. **Test data separation** — JSON files or fixtures, not hardcoded in tests
5. **Meaningful naming** — Test names describe WHAT, not HOW
6. **DRY principle** — Extract repeated logic into shared functions
7. **Small, focused tests** — Each test verifies one thing
8. **Consistent structure** — Standard folder organization across the team
9. **Code reviews** — Catch duplication and bad patterns early
10. **Documentation** — README with framework setup and conventions

**Folder structure:**

```
tests/
├── pages/          # Page Objects
├── fixtures/       # Custom fixtures
├── testData/       # JSON test data
├── utils/          # Helpers
├── specs/          # Test files (grouped by feature)
└── playwright.config.js
```

---

### 9. Can you launch a browser without using Playwright's built-in fixtures?

**Answer:**

Yes. You can manually launch a browser using Playwright's library API directly:

```javascript
import { chromium } from 'playwright';

async function launchManually() {
  // Launch browser manually (no fixture)
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://example.com');
  console.log(await page.title());

  // Must manually close
  await browser.close();
}

launchManually();
```

**When you'd do this:**
- Standalone scripts (not using `@playwright/test` runner)
- Custom automation tools
- Web scraping
- When you need full control over browser lifecycle

**But in test files, always prefer fixtures** — they handle isolation, cleanup, and parallel safety automatically.

---

### 10. page.locator() vs page.frameLocator()

**Answer:**

| Method | Purpose | Scope |
|--------|---------|-------|
| `page.locator()` | Finds elements on the main page DOM | Main page |
| `page.frameLocator()` | Finds elements INSIDE an iframe | Within a specific iframe |

**page.locator() — for main page elements:**

```javascript
// Element is on the main page
await page.locator('#username').fill('admin');
await page.locator('button[type="submit"]').click();
```

**page.frameLocator() — for elements inside an iframe:**

```javascript
// Element is INSIDE an iframe
const frame = page.frameLocator('#payment-iframe');
await frame.locator('#card-number').fill('4242424242424242');
await frame.locator('#expiry').fill('12/25');
await frame.locator('#pay-btn').click();
```

**Nested iframes:**

```javascript
const outerFrame = page.frameLocator('#outer');
const innerFrame = outerFrame.frameLocator('#inner');
await innerFrame.locator('button').click();
```

**Key difference:** You cannot use `page.locator()` to access elements inside an iframe — the iframe has its own separate DOM. You must use `frameLocator()` to "enter" the iframe first.

---

### 11. Explain Promise.all() with an example. Where have you used it?

**Answer:**

`Promise.all()` executes multiple promises **concurrently** and waits for all of them to resolve. If any one fails, the whole thing fails.

**Basic example:**

```javascript
const [result1, result2, result3] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/orders'),
  fetch('/api/products')
]);
// All 3 API calls run at the same time, not one after another
```

**Where I use it in Playwright — handling new tabs/popups:**

```javascript
test('handle new tab', async ({ context, page }) => {
  await page.goto('https://example.com');

  // Click opens a new tab — we need to wait for it AND click simultaneously
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),   // Wait for new tab to open
    page.locator('#external-link').click()  // Click that triggers new tab
  ]);

  await newPage.waitForLoadState();
  console.log(await newPage.title());
});
```

**Why Promise.all() here?**
- `context.waitForEvent('page')` needs to be listening BEFORE the click happens
- The click triggers the new tab
- Both must happen concurrently — if you click first, you might miss the event

**Other Playwright uses:**
- Waiting for download + clicking download button
- Waiting for dialog + triggering the dialog
- Waiting for network response + performing the action

---

### 12. Open URL in Firefox, handle popup, validate popup text

**Answer (on-screen coding):**

```javascript
import { test, expect, firefox } from '@playwright/test';

test('handle popup in Firefox', async () => {
  // Launch Firefox manually
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to URL
  await page.goto('https://example.com/popup-demo');

  // Register dialog handler BEFORE triggering the popup
  page.on('dialog', async (dialog) => {
    // Validate popup text
    console.log('Popup message:', dialog.message());
    expect(dialog.message()).toContain('Are you sure');

    // Accept the popup (click OK)
    await dialog.accept();
    // Or dismiss: await dialog.dismiss();
  });

  // Click button that triggers the popup
  await page.locator('#popup-trigger').click();

  await browser.close();
});
```

**Using Playwright Test config (project-based approach):**

```javascript
// playwright.config.js — run in Firefox
const config = ({
  projects: [
    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    }
  ]
});
module.exports = config;
```

```javascript
// Test file — uses fixture (simpler)
test('handle popup', async ({ page }) => {
  await page.goto('https://example.com/popup-demo');

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Are you sure');
    await dialog.accept();
  });

  await page.locator('#popup-trigger').click();
});
```

**Key point:** Always register the dialog handler BEFORE the action that triggers it — dialogs are synchronous and blocking.

---

### 13. Print only non-duplicate characters from a string

**Input:** `"roshan is automation tester & roshan is ui tester"`
**Expected Output:** `automation & ui`

**JavaScript Solution:**

```javascript
function getNonDuplicateWords(str) {
  const words = str.split(' ');
  const wordCount = {};

  // Count occurrences of each word
  for (const word of words) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }

  // Filter words that appear only once
  const unique = words.filter(word => wordCount[word] === 1);
  return unique.join(' ');
}

const input = "roshan is automation tester & roshan is ui tester";
console.log(getNonDuplicateWords(input));
// Output: "automation & ui"
```

**Explanation:**
1. Split the string into words
2. Count how many times each word appears
3. Keep only words with count === 1 (non-duplicate)
4. Join them back into a string

**Complexity:** Time O(n), Space O(n)

---

### 14. Find the last non-repeating character in a string

**JavaScript Solution:**

```javascript
function lastNonRepeatingChar(str) {
  const charCount = {};

  // Count frequency of each character
  for (const char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Traverse from the END to find last non-repeating
  for (let i = str.length - 1; i >= 0; i--) {
    if (charCount[str[i]] === 1) {
      return str[i];
    }
  }

  return null; // No non-repeating character found
}

// Examples
console.log(lastNonRepeatingChar("automation")); // 'n'
console.log(lastNonRepeatingChar("aabbcc"));     // null
console.log(lastNonRepeatingChar("abcabc"));     // null
console.log(lastNonRepeatingChar("abcdef"));     // 'f'
console.log(lastNonRepeatingChar("stress"));     // 't'
```

**Explanation:**
1. Count frequency of every character
2. Loop from the END of the string backwards
3. Return the first character (from the end) that has count === 1

**Complexity:** Time O(n), Space O(1) for fixed character set


---

## 29. CGI Interview Questions — Playwright

---

### Round 1 (20–30 Mins)

---

#### 1. Introduction & How do you capture network requests and responses in Playwright?

**Answer:**

```javascript
test('capture network traffic', async ({ page }) => {
  // Listen to all requests
  page.on('request', (request) => {
    console.log(`${request.method()} ${request.url()}`);
  });

  // Listen to all responses
  page.on('response', (response) => {
    console.log(`${response.url()} → ${response.status()}`);
  });

  await page.goto('https://example.com');
});
```

**Wait for a specific API response:**

```javascript
const responsePromise = page.waitForResponse(
  (resp) => resp.url().includes('/api/users') && resp.status() === 200
);
await page.click('#load-users');
const response = await responsePromise;
const data = await response.json();
```

**Key Points:**
- `page.on('request')` — fires for every outgoing request
- `page.on('response')` — fires for every received response
- `page.waitForResponse()` — waits for specific API call to complete
- Can capture headers, body, status codes

---

#### 2. How can you mock API responses using Playwright?

**Answer:**

```javascript
test('mock API', async ({ page }) => {
  // Intercept and return mock data
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ users: [{ id: 1, name: 'Alice' }] }),
    });
  });

  await page.goto('https://example.com/users');
  await expect(page.locator('.user-card')).toHaveCount(1);
});
```

**Other options:**
- `route.fulfill()` — return custom response (no server hit)
- `route.abort()` — block the request entirely
- `route.fetch()` + `route.fulfill()` — modify real response
- `route.continue()` — let request proceed with modified headers

---

#### 3. How do you take screenshots and videos in Playwright?

**Answer:**

```javascript
// Full page screenshot
await page.screenshot({ path: 'screenshots/full.png', fullPage: true });

// Element screenshot
await page.locator('.hero').screenshot({ path: 'screenshots/hero.png' });
```

**Config for auto-capture:**

```javascript
const config = ({
  use: {
    screenshot: 'on',           // 'on', 'only-on-failure', 'off'
    video: 'on-first-retry',    // 'on', 'off', 'on-first-retry'
  }
});
module.exports = config;
```

**Key Points:**
- `fullPage: true` captures entire scrollable page
- Videos saved as `.webm` files
- `retain-on-failure` saves disk space in CI

---

#### 4. How do you handle authentication in Playwright (Basic Auth, Token-based, OAuth)?

**Answer:**

**Basic Auth:**

```javascript
const context = await browser.newContext({
  httpCredentials: { username: 'admin', password: 'pass123' }
});
```

**Token-based (storageState — recommended):**

```javascript
// global-setup.js — login once, save session
await page.goto('/login');
await page.fill('#user', 'admin');
await page.fill('#pass', 'password');
await page.click('#login-btn');
await page.context().storageState({ path: './auth/state.json' });
```

```javascript
// Config — reuse across all tests
use: { storageState: './auth/state.json' }
```

**OAuth:** Save session state after OAuth flow completes, then reuse via `storageState`.

---

#### 5. How do you configure retries and test retries in Playwright?

**Answer:**

```javascript
const config = ({
  retries: 2, // Top level — NOT inside `use`
});
module.exports = config;
```

**Per-test override:**

```javascript
test.describe.configure({ retries: 3 });
```

**CLI:**

```bash
npx playwright test --retries=3
```

**Key Points:**
- Retries re-run entire test including `beforeEach`
- Each retry gets a fresh browser context
- Combine with `video: 'on-first-retry'` to capture only on retries
- `testInfo.retry` gives current retry count in test code

---

### Round 2 (30–45 Mins)

---

#### 1. What strategies do you use to debug flaky Playwright tests?

**Answer:**

1. **Reproduce:** `npx playwright test --repeat-each=10`
2. **Trace Viewer:** `use: { trace: 'on-first-retry' }` then `npx playwright show-trace`
3. **Debug mode:** `npx playwright test --debug`
4. **Logging:** `page.on('console')`, `page.on('requestfailed')`
5. **Isolate:** Run with `--workers=1` to rule out shared state
6. **Fix root cause:** Replace hard waits with assertions, mock unstable APIs, isolate test data

---

#### 2. How do you optimize execution speed in Playwright?

**Answer:**

1. Parallel execution — `workers: 10`, `fullyParallel: true`
2. Reuse auth state — `storageState` (saves 2-5s per test)
3. API for setup — create data via API, not UI clicks
4. Block resources — `page.route('**/*.{png,jpg}', r => r.abort())`
5. Sharding in CI — `--shard=1/4` across machines
6. Disable unused features — `video: 'off'`, `trace: 'on-first-retry'`

---

#### 3. How do you handle dynamic elements in Playwright?

**Answer:**

- Use stable locators: `getByRole()`, `getByTestId()` instead of dynamic IDs
- Auto-retrying assertions: `await expect(locator).toHaveText('value')`
- Polling: `await expect(async () => { ... }).toPass()`
- Locators are "lazy" — re-query DOM on every action, never go stale

---

#### 4. What is the difference between locator and page.$ methods?

**Answer:**

| Feature | `page.locator()` | `page.$()` |
|---------|-----------------|------------|
| Type | Lazy reference | Eager ElementHandle |
| Auto-waiting | Yes | No |
| Re-evaluation | Re-queries DOM each time | Goes stale after DOM change |
| Recommended | Yes — modern API | No — legacy |

Always use `locator()` in modern Playwright.

---

#### 5. How do you use trace viewer in Playwright for debugging?

**Answer:**

```javascript
use: { trace: 'on-first-retry' }
```

```bash
npx playwright show-trace test-results/trace.zip
```

Shows: timeline, DOM snapshots, network calls, console logs, action screenshots.

---

#### 6. Share a scenario where Playwright is a better choice than Selenium.

**Answer:**

Multi-user collaboration testing (e.g., Google Docs):
- Playwright: Two `BrowserContexts` in one test, native WebSocket support, network interception
- Selenium: Needs two WebDriver instances, no network mocking, manual synchronization

Also better for: file downloads, mobile emulation, iframe handling, auth state reuse.

---

#### 7. How do you implement Page Object Model (POM) in Playwright?

**Answer:**

```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByPlaceholder('email');
    this.password = page.getByPlaceholder('password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
  }
  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}
```

Use with fixtures for injection:

```javascript
export const test = base.extend({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); }
});
```

---

#### 8. How do you manage test data in Playwright?

**Answer:**

- JSON files for static data
- Data-driven tests with `for...of` loops
- Fixtures for injecting test data
- API-based setup/teardown for dynamic data
- Environment variables for sensitive data

---

#### 9. What are Playwright's parallel execution capabilities?

**Answer:**

- `workers: N` — N test files run simultaneously
- `fullyParallel: true` — individual tests within files also run in parallel
- Each worker = isolated browser (no shared state)
- Sharding: `--shard=1/4` distributes across CI machines
- `test.describe.configure({ mode: 'serial' })` for dependent tests

---

#### 10. What is the difference between page, browser, and context in Playwright?

**Answer:**

```
Browser (one instance per worker)
├── BrowserContext 1 (isolated session — cookies, storage)
│   ├── Page 1 (tab — shares session with Page 2)
│   └── Page 2
└── BrowserContext 2 (completely separate session)
    └── Page 3
```

- **Browser** = application instance
- **Context** = isolated session (like incognito window)
- **Page** = a tab within a context

Pages in same context share cookies. Different contexts are fully isolated.

---

#### 11. How do you launch a browser in headless and non-headless modes?

**Answer:**

```javascript
// Config
use: { headless: true }   // Default — no browser UI

// CLI override
// npx playwright test --headed
```

Headless = faster, for CI. Headed = visible, for debugging.

---

#### 12. What are Playwright fixtures, and how are they useful?

**Answer:**

Fixtures are dependency injection — provide pre-configured objects to tests with automatic setup/teardown.

- Built-in: `page`, `context`, `browser`, `request`
- Custom: `test.extend()` to create your own
- Benefits: isolation, no boilerplate, automatic cleanup, lazy initialization

---

#### 13. How do you handle dropdowns, frames, and alerts in Playwright?

**Answer:**

**Dropdown:** `await page.selectOption('#country', { label: 'India' });`

**Frame:** `const frame = page.frameLocator('#iframe'); await frame.locator('#btn').click();`

**Alert:**
```javascript
page.on('dialog', async (d) => { await d.accept(); });
await page.click('#alert-btn');
```

Register handler BEFORE the action — dialogs are synchronous and blocking.

---

#### 14. How does Playwright handle waits differently compared to Selenium?

**Answer:**

- **Selenium:** Manual explicit/implicit waits, `Thread.sleep()` anti-pattern
- **Playwright:** Auto-waiting built into every action (checks attached, visible, stable, enabled, not obscured)

Assertions auto-retry: `await expect(locator).toHaveText('value')` polls until condition met or timeout.

Almost zero `waitForTimeout()` calls needed in a good Playwright framework.

---

### Round 3 (Coding + Managerial)

---

#### 1. Count and print number of vowels and consonants in your name

```javascript
function countVowelsConsonants(name) {
  let vowels = 0, consonants = 0;
  for (const char of name.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      'aeiou'.includes(char) ? vowels++ : consonants++;
    }
  }
  console.log(`Vowels: ${vowels}, Consonants: ${consonants}`);
}
countVowelsConsonants('Sriram Kukkadapu'); // Vowels: 6, Consonants: 9
```

---

#### 2. Unique and duplicates in your name without using Collections in Java

```java
String name = "SriramKukkadapu".toLowerCase();
int[] count = new int[26]; // No Collections — just an array

for (int i = 0; i < name.length(); i++)
    count[name.charAt(i) - 'a']++;

System.out.print("Unique: ");
for (int i = 0; i < 26; i++)
    if (count[i] == 1) System.out.print((char)(i + 'a') + " ");

System.out.print("\nDuplicate: ");
for (int i = 0; i < 26; i++)
    if (count[i] > 1) System.out.print((char)(i + 'a') + "(" + count[i] + ") ");
// Unique: d i m p s u | Duplicate: a(3) k(3) r(2)
```

---

#### 3. Longest Substring without repeating characters

```javascript
function longestSubstring(s) {
  const lastIndex = new Map();
  let maxLen = 0, start = 0;

  for (let end = 0; end < s.length; end++) {
    if (lastIndex.has(s[end]) && lastIndex.get(s[end]) >= start) {
      start = lastIndex.get(s[end]) + 1;
    }
    lastIndex.set(s[end], end);
    maxLen = Math.max(maxLen, end - start + 1);
  }
  return maxLen;
}
console.log(longestSubstring('abcabcbb')); // 3 ("abc")
console.log(longestSubstring('pwwkew'));   // 3 ("wke")
```

---

#### 4. How do you distribute tasks to teammates when deadline is near?

**Answer:**

1. **Assess** — List remaining work, identify blockers
2. **Prioritize** — Must-have (P0) vs nice-to-have (P2)
3. **Match to strengths** — Complex tasks → senior members
4. **Communicate** — Daily 15-min syncs, shared board with ownership
5. **Risk mitigation** — Biggest risk assigned first, backup plan ready
6. **Scope negotiation** — Communicate cuts early to stakeholders

> "I first list all remaining work and prioritize ruthlessly. I match tasks to strengths, assign highest-risk items to experienced people, take on blockers myself, set up daily syncs, and communicate transparently with stakeholders about what's realistic."


---

## 30. PwC SDET Interview — Playwright MCP

---

### Have you used Playwright MCP?

**Answer:**

Yes, I have used Playwright MCP.

Playwright MCP allows AI assistants and AI agents to interact with web applications through Playwright. It can help an AI agent:
- Navigate a browser
- Inspect elements
- Perform actions
- Understand the current page state
- Execute application workflows

**In simple terms:**

```
AI Agent → Playwright MCP → Browser → Web Application
```

The AI agent communicates via MCP protocol (JSON-RPC tool calls) and Playwright runs as a background MCP server that controls the browser.

---

### What is MCP?

**Answer:**

MCP stands for **Model Context Protocol**.

It is a standardized protocol that allows AI models to interact with external tools, applications, and data sources. Instead of creating separate integrations between an AI model and every tool, MCP provides a **common interface**.

**In simple terms:**

```
AI Model → MCP → External Tools and Systems
```

Think of MCP like a USB-C port — one standard connection that works with many different devices (browsers, databases, APIs, file systems, etc.).

---

### How does MCP improve automation?

**Answer:**

MCP makes automation more **AI-driven** by allowing an AI agent to interact with tools and applications based on the current context.

**For example, with Playwright MCP:**

```
AI Agent → Understands the requirement
AI Agent → Interacts with the browser
AI Agent → Identifies elements
AI Agent → Performs actions
AI Agent → Observes the result
AI Agent → Decides the next action
```

**This can help with:**

| Use Case | How MCP Helps |
|----------|--------------|
| **Test case generation** | Create test scenarios from requirements |
| **Test execution** | Allow AI agents to execute browser workflows |
| **Exploratory testing** | Dynamically explore application behavior |
| **Debugging** | Analyze failures and application state |
| **Test maintenance** | Identify changes in UI elements and workflows |

**Traditional automation vs MCP-based automation:**

| Traditional Automation | MCP-Based Automation |
|----------------------|---------------------|
| Follows predefined scripts | AI agents interact dynamically based on current state |
| Breaks when UI changes | Can adapt to changes by observing the DOM |
| Manual test creation | AI can generate tests from requirements |
| Fixed execution flow | Context-aware decision making |

This is why Playwright MCP and MCP are becoming important topics for modern SDET interviews — they represent the shift toward **AI-assisted test automation**.

---

## 31. Accenture SDET Interview — JavaScript + Playwright + API Testing

**Role:** SDET / Automation Engineer (3–6 Yrs Experience)  
**Duration:** ~50 mins  
**Key Focus Areas:** JavaScript Core Concepts, Playwright Automation, API Testing  

---

### JavaScript – Core Concepts

---

#### 1. Remove duplicates from an array without using Set

**Answer:**

There are multiple ways to remove duplicates from an array in JavaScript without using `Set`.

##### Approach 1: Using `filter()` + `indexOf()` (Most Common & Idiomatic)
`indexOf()` returns the index of the **first occurrence** of an element. If the current index doesn't match `indexOf()`, it is a duplicate.

```javascript
function removeDuplicatesFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const numbers = [1, 2, 3, 2, 4, 1, 5, 6, 5];
console.log(removeDuplicatesFilter(numbers)); // [1, 2, 3, 4, 5, 6]
```
- **Time Complexity:** $O(n^2)$ (due to nested search with `indexOf`)
- **Space Complexity:** $O(n)$

##### Approach 2: Using `reduce()` + `includes()`
Accumulate elements in a new array only if they are not already included.

```javascript
function removeDuplicatesReduce(arr) {
  return arr.reduce((unique, item) => {
    return unique.includes(item) ? unique : [...unique, item];
  }, []);
}

console.log(removeDuplicatesReduce([10, 20, 10, 30, 40, 20])); // [10, 20, 30, 40]
```

##### Approach 3: Using a Hash Map / Object Lookup (Fastest: $O(n)$ Time)
Using a hash map / object lookup to store seen keys in $O(1)$ lookup time:

```javascript
function removeDuplicatesHash(arr) {
  const seen = {};
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!seen[item]) {
      seen[item] = true;
      result.push(item);
    }
  }
  return result;
}

console.log(removeDuplicatesHash(['apple', 'banana', 'apple', 'orange'])); 
// ['apple', 'banana', 'orange']
```
- **Time Complexity:** $O(n)$
- **Space Complexity:** $O(n)$

##### Approach 4: Traditional Nested For-Loops (No High-Order Functions)

```javascript
function removeDuplicatesLoops(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    let isDuplicate = false;
    for (let j = 0; j < result.length; j++) {
      if (arr[i] === result[j]) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      result.push(arr[i]);
    }
  }
  return result;
}
```

---

#### 2. Closures and Hoisting

**Answer:**

##### A. Closures
A **closure** is a function bundled together with references to its surrounding state (lexical environment). In other words, an inner function has access to the outer function’s variables and scope even **after the outer function has finished executing**.

```javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable enclosed in outer scope

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.getCount());  // 11
```

**Real-world Automation Use Cases for Closures:**
- **Custom test loggers / metrics trackers**: Encapsulating step counters or test step timings.
- **Unique Test Data Generators**: Maintaining private sequences (e.g. `generateUser()` incrementing an internal ID).
- **Environment Configuration**: Storing base URLs or authorization headers in private scope.

---

##### B. Hoisting
**Hoisting** is JavaScript's default behavior of moving declarations (variable and function declarations) to the top of their containing scope during the compilation phase before code execution.

| Declaration | Hoisted? | Initialized Value | Accessible Before Declaration? |
|-------------|----------|-------------------|--------------------------------|
| `var` | Yes | `undefined` | Yes (returns `undefined`) |
| `let` / `const` | Yes | Uninitialized (Temporal Dead Zone - TDZ) | No (`ReferenceError`) |
| Function Declaration (`function foo() {}`) | Yes | Full function definition | Yes (can be invoked before declaration) |
| Function Expression (`var foo = function() {}`) | Only variable hoisted | `undefined` | No (`TypeError: foo is not a function`) |

**Code Example:**

```javascript
// 1. var Hoisting:
console.log(a); // undefined (declaration hoisted, assignment stays here)
var a = 10;

// 2. let/const in Temporal Dead Zone (TDZ):
// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;

// 3. Function Declaration Hoisting:
greet(); // Output: "Hello from Playwright!" (Works!)
function greet() {
  console.log("Hello from Playwright!");
}

// 4. Function Expression Hoisting:
// sayBye(); // TypeError: sayBye is not a function
var sayBye = function() {
  console.log("Bye!");
};
```

---

#### 3. `==` vs `===`

**Answer:**

In JavaScript, `==` (Loose / Abstract Equality) and `===` (Strict Equality) are comparison operators with fundamentally different behavior regarding type conversion.

| Feature | `==` (Loose Equality) | `===` (Strict Equality) |
|---------|-----------------------|-------------------------|
| **Type Coercion** | Performs implicit type coercion before comparison | No type coercion |
| **Comparison** | Converts operands to a common type, then compares value | Compares both **value** and **data type** |
| **Performance** | Slightly slower due to conversion logic | Faster (direct comparison) |
| **Predictability** | Prone to bugs and edge cases | Predictable and reliable |

##### Comparison Examples:

```javascript
// 1. Primitive comparisons:
5 == '5'        // true (string '5' coerced to number 5)
5 === '5'       // false (number !== string)

0 == false      // true (false coerced to 0)
0 === false     // false (number !== boolean)

null == undefined   // true (special rule in JS spec)
null === undefined  // false (object/null !== undefined)

'' == 0         // true (empty string coerced to 0)
'' === 0        // false

// 2. Object & Array comparisons (Reference equality):
[1, 2] == [1, 2]    // false (different references in memory)
[1, 2] === [1, 2]   // false (different references in memory)
```

**SDET Recommendation:**
Always use `===` and `!==` in test automation assertions and logic to prevent unexpected false positives caused by implicit type coercion.

---

#### 4. Promises vs Async/Await

**Answer:**

Both Promises and `async/await` handle asynchronous operations in JavaScript, but `async/await` is modern syntactic sugar built on top of Promises (introduced in ES2017).

##### Key Differences:

| Aspect | Promises (`.then` / `.catch`) | `async/await` |
|--------|-------------------------------|---------------|
| **Syntax** | Method chaining with `.then()`, `.catch()`, `.finally()` | Synchronous-looking code using `async` keyword and `await` operator |
| **Error Handling** | Handled using `.catch()` callback | Handled using standard `try { ... } catch (error) { ... }` blocks |
| **Readability** | Can lead to "Promise Chaining Hell" with nested steps | Clean, linear, and easy to read / maintain |
| **Conditionals / Loops** | Awkward in `for` loops, often requires `Promise.all` or recursion | Natural integration with `for...of`, `if/else`, and `try/catch` |
| **Debugging** | Stack traces can be fragmented across callback boundaries | Cleaner stack traces matching line-by-line execution |

##### Code Comparison:

**Using Promises:**
```javascript
function fetchUserData() {
  return api.getUser()
    .then(user => {
      return api.getOrders(user.id)
        .then(orders => {
          return { user, orders };
        });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}
```

**Using Async/Await (Playwright Standard):**
```javascript
async function fetchUserData() {
  try {
    const user = await api.getUser();
    const orders = await api.getOrders(user.id);
    return { user, orders };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
```

##### Playwright Example with `Promise.all()`
When an action (like a click) triggers an async event (like a popup or navigation), Playwright uses `Promise.all` to avoid race conditions:

```javascript
test('wait for popup and click concurrently', async ({ page }) => {
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.click('#open-new-tab-button'), // Triggers the popup
  ]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveTitle('Dashboard');
});
```

---

### Playwright – Automation

---

#### 1. Explain your Playwright framework structure

**Answer:**

"In my current project, we have designed an enterprise-grade, modular end-to-end testing framework using Playwright with JavaScript/TypeScript following the Page Object Model (POM) and Custom Fixtures design pattern."

##### Directory Architecture:

```
playwright-automation/
├── .github/
│   └── workflows/
│       └── playwright-ci.yml       # CI/CD pipeline (GitHub Actions)
├── config/
│   ├── env.qa.json                 # QA environment endpoints & configs
│   ├── env.stage.json              # Staging environment configs
│   └── playwright.config.js        # Global configuration (workers, projects, retries)
├── pages/                          # Page Object Model classes
│   ├── BasePage.js                 # Common methods (navigate, wait, assertions)
│   ├── LoginPage.js                # Login page locators and user actions
│   ├── DashboardPage.js            # Dashboard components and flows
│   └── CheckoutPage.js             # Checkout actions and validations
├── fixtures/                       # Custom Playwright Fixtures
│   └── customFixture.js            # Injected Page Objects, API clients, auth state
├── testData/                       # Static & Dynamic test data
│   ├── users.json                  # User credentials & roles
│   └── orderData.json              # Payload templates
├── utils/                          # Utility & Helper functions
│   ├── APIUtils.js                 # REST API helper methods (token generation, setup)
│   ├── DBUtils.js                  # Database verification helpers
│   └── DataGenerator.js            # Dynamic test data (faker.js)
├── tests/                          # Test suites (Spec files)
│   ├── e2e/
│   │   ├── auth.spec.js
│   │   └── checkout.spec.js
│   └── api/
│       └── userApi.spec.js
├── auth/                           # Saved session states
│   └── userState.json              # storageState cookies & localStorage
├── test-results/                   # Test execution artifacts
├── playwright-report/              # Generated HTML test reports
└── package.json                    # Project dependencies & scripts
```

##### Key Highlights of the Framework:
1. **Fixtures-Driven POM:** Pages are instantiated via Playwright fixtures (`test.extend`), eliminating manual `new PageObject(page)` boilerplate in tests.
2. **Session Reuse (`storageState`):** Authentication runs once during global setup or API setup, saving 3–5 seconds per test case.
3. **Environment Agnostic:** Dynamic config loading for Dev, QA, Stage, and Prod via environment variables.
4. **CI/CD Integration:** Runs parallelized suites with HTML reporting, Trace Viewer on first retry, and automatic artifact uploading upon failure.

---

#### 2. How do you handle dynamic elements?

**Answer:**

In modern web applications (React, Angular, Vue), IDs, classes, and attributes are often auto-generated (e.g., `<button id="btn_9f82d1_submit">`). Here is how we handle them in Playwright:

##### 1. Use User-Facing & Resilient Role Locators (Best Practice)
Playwright recommends locating elements by their accessibility semantics rather than volatile CSS selectors or dynamic IDs:

```javascript
// Locate by accessible role and accessible name
await page.getByRole('button', { name: 'Submit' }).click();

// Locate by label text associated with an input
await page.getByLabel('User Email').fill('test@accenture.com');

// Locate by placeholder text
await page.getByPlaceholder('Enter your password').fill('SecurePass123');

// Locate by data-testid attribute (dedicated automation attribute)
await page.getByTestId('order-submit-btn').click();
```

##### 2. Locator Filtering and Chaining
When multiple dynamic cards or table rows exist, filter by child element or unique text:

```javascript
// Filter a dynamic product list by text and child button
await page.locator('.product-card')
  .filter({ hasText: 'iPhone 15 Pro' })
  .getByRole('button', { name: 'Add to Cart' })
  .click();
```

##### 3. Handling Dynamic Text with Regex
Match dynamic or partial text (e.g., "Order #98234 created"):

```javascript
await expect(page.locator('.order-status')).toHaveText(/Order #\d+ created/);
```

##### 4. Polling Assertions with `expect.toPass()`
For elements whose values update asynchronously (e.g., stock price, status ticker):

```javascript
await expect(async () => {
  const status = await page.locator('.badge-status').textContent();
  expect(status.trim()).toBe('Completed');
}).toPass({
  intervals: [500, 1000, 2000],
  timeout: 15000,
});
```

##### 5. Playwright's Lazy Locators & Auto-Waiting
Playwright Locators are **lazy** — they re-evaluate the DOM every time an action or assertion is performed. This completely eliminates Selenium's `StaleElementReferenceException`.

---

#### 3. How do you handle flaky tests?

**Answer:**

"Flaky tests erode trust in automation. In our Playwright framework, we address flakiness systematically at the architecture, test design, and execution levels."

##### Key Strategies:

1. **Leverage Playwright's Built-In Auto-Waiting & Auto-Retrying Assertions:**
   - Playwright automatically checks actionability (visible, attached, enabled, stable, receive events) before performing actions.
   - Use web-first assertions (`await expect(locator).toBeVisible()`) instead of non-retrying boolean checks (`expect(await locator.isVisible()).toBe(true)`).

2. **Eliminate Hardcoded Sleep (`page.waitForTimeout`):**
   - Hardcoded sleeps cause false failures when networks slow down, and waste time when networks are fast.
   - Replace with event-driven waits: `page.waitForResponse()`, `page.waitForURL()`, or `expect().toPass()`.

3. **Diagnose with Playwright Trace Viewer:**
   - Configure traces to capture on failure or retry:
     ```javascript
     use: {
       trace: 'on-first-retry', // Collects DOM snapshot, network calls, console logs, and action timeline
       screenshot: 'only-on-failure',
       video: 'retain-on-failure'
     }
     ```
   - Open trace with `npx playwright show-trace test-results/.../trace.zip` to step back and forward through execution time.

4. **Ensure Complete Test Isolation:**
   - Never make Test B depend on data created by Test A.
   - Use distinct user accounts or create dynamic test data via API (`beforeEach` / custom fixtures).
   - Playwright automatically provides a fresh `BrowserContext` per test so cookies and caches don't leak.

5. **Configured Automatic Retries in CI:**
   ```javascript
   retries: process.env.CI ? 2 : 0, // Retry failed tests up to 2 times in CI pipeline
   ```

6. **Network & Clock Mocking:**
   - Mock unstable 3rd-party dependencies (e.g., payment gateways, analytics) using `page.route()`.

---

#### 4. Parallel execution across browsers

**Answer:**

Playwright has native, out-of-the-box parallel execution without needing external grids or plugins.

##### 1. Configuration in `playwright.config.js`:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Runs all test cases inside files in parallel
  workers: process.env.CI ? 4 : '50%', // 4 workers on CI, 50% CPU cores locally
  retries: 2,
  
  projects: [
    {
      name: 'Chromium - Desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox - Desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit - Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome - Pixel 7',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
```

##### 2. Controlling Parallelism at File / Suite Level:

```javascript
// Run all tests in this file in parallel
test.describe.configure({ mode: 'parallel' });

// Run sequentially when tests must share sequential state
test.describe.configure({ mode: 'serial' });
```

##### 3. CI/CD Sharding:
Distribute test execution across multiple CI machines to reduce execution time linearly:
```bash
# Machine 1:
npx playwright test --shard=1/3

# Machine 2:
npx playwright test --shard=2/3

# Machine 3:
npx playwright test --shard=3/3
```

---

#### 5. Page Object Model (POM) implementation

**Answer:**

"In Playwright, POM encapsulates UI locators and actions within classes, and we integrate them with custom fixtures for clean dependency injection."

##### 1. Page Object Class (`pages/LoginPage.js`):

```javascript
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('.error-banner');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
```

##### 2. Custom Fixture Setup (`fixtures/pomFixture.js`):

```javascript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
```

##### 3. Test Implementation (`tests/login.spec.js`):

```javascript
import { test, expect } from '../fixtures/pomFixture';

test('valid user can log in successfully', async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login('sriram@accenture.com', 'ValidPass123');
  await expect(dashboardPage.welcomeHeader).toHaveText('Welcome, Sriram');
});
```

---

### API Testing

---

#### 1. How do you automate REST APIs in Playwright?

**Answer:**

Playwright provides a built-in `APIRequestContext` via the `request` fixture that enables fast, isolated REST API automation without needing third-party libraries like Axios, Supertest, or RestAssured.

##### Advantages:
- Built into Playwright — no external dependencies.
- Shares cookie storage, base URLs, and authentication states with browser tests.
- High performance (executes directly over Node.js HTTP layer).

##### Basic HTTP Methods Example:

```javascript
import { test, expect } from '@playwright/test';

test.describe('CRUD Operations with Playwright APIRequestContext', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  // GET Request
  test('GET - Fetch post by ID', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/1`);
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body).toHaveProperty('title');
  });

  // POST Request
  test('POST - Create new post', async ({ request }) => {
    const payload = {
      title: 'Playwright API Testing',
      body: 'Automating REST APIs with Playwright',
      userId: 101,
    };

    const response = await request.post(`${baseURL}/posts`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.title).toBe(payload.title);
    expect(responseBody.id).toBeDefined();
  });

  // PUT Request
  test('PUT - Update existing post', async ({ request }) => {
    const updatePayload = {
      id: 1,
      title: 'Updated Title',
      body: 'Updated Body',
      userId: 1,
    };

    const response = await request.put(`${baseURL}/posts/1`, {
      data: updatePayload,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe('Updated Title');
  });

  // DELETE Request
  test('DELETE - Delete post', async ({ request }) => {
    const response = await request.delete(`${baseURL}/posts/1`);
    expect(response.status()).toBe(200);
  });
});
```

---

#### 2. API chaining – practical example

**Answer:**

**API Chaining** is a testing pattern where data extracted from the response of one API request (like an `id`, `token`, or `orderId`) is dynamically passed as an input parameter or header into subsequent API requests.

##### Scenario: User Lifecycle Management
1. **POST `/api/users`** → Create user, extract generated `userId`.
2. **GET `/api/users/{userId}`** → Fetch details using `userId`, verify attributes.
3. **PUT `/api/users/{userId}`** → Update user details (e.g. email/status).
4. **DELETE `/api/users/{userId}`** → Delete user by `userId`.
5. **GET `/api/users/{userId}`** → Verify user no longer exists (404 Not Found).

##### Complete Working Playwright Test:

```javascript
import { test, expect } from '@playwright/test';

test('API Chaining: Create -> Read -> Update -> Delete User Lifecycle', async ({ request }) => {
  const baseURL = 'https://reqres.in/api';
  let createdUserId;

  // Step 1: POST Request - Create User
  await test.step('Step 1: Create a new user', async () => {
    const createResponse = await request.post(`${baseURL}/users`, {
      data: {
        name: 'Sriram SDET',
        job: 'Lead Automation Engineer',
      },
    });

    expect(createResponse.status()).toBe(201);
    const createBody = await createResponse.json();
    expect(createBody.name).toBe('Sriram SDET');
    
    // Extract ID for chaining
    createdUserId = createBody.id;
    console.log(`Created User ID: ${createdUserId}`);
    expect(createdUserId).toBeDefined();
  });

  // Step 2: PUT Request - Update User using chained ID
  await test.step('Step 2: Update user details', async () => {
    const updateResponse = await request.put(`${baseURL}/users/${createdUserId}`, {
      data: {
        name: 'Sriram SDET',
        job: 'Principal SDET',
      },
    });

    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();
    expect(updateBody.job).toBe('Principal SDET');
  });

  // Step 3: DELETE Request - Delete user using chained ID
  await test.step('Step 3: Delete user', async () => {
    const deleteResponse = await request.delete(`${baseURL}/users/${createdUserId}`);
    expect(deleteResponse.status()).toBe(204);
  });
});
```

---

#### 3. Authentication & token handling

**Answer:**

"In our automation framework, we handle various authentication mechanisms such as Bearer Tokens (JWT), Basic Auth, API Keys, and Session Cookies."

##### 1. Bearer Token (JWT) Handling:
Generate token in setup / helper, then pass in `Authorization` header:

```javascript
import { test, expect } from '@playwright/test';

test('Bearer token authentication', async ({ request }) => {
  // 1. Obtain Token via Auth Endpoint
  const authResponse = await request.post('https://api.myapp.com/auth/login', {
    data: {
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD,
    },
  });

  expect(authResponse.status()).toBe(200);
  const { token } = await authResponse.json();

  // 2. Pass Token to Authorized Endpoint
  const profileResponse = await request.get('https://api.myapp.com/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  expect(profileResponse.status()).toBe(200);
  const profile = await profileResponse.json();
  expect(profile.email).toBeDefined();
});
```

##### 2. Global Token / Context Configuration:
Create a dedicated `APIRequestContext` with pre-configured headers:

```javascript
import { request } from '@playwright/test';

async function createAuthenticatedClient(token) {
  return await request.newContext({
    baseURL: 'https://api.myapp.com',
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
```

##### 3. Hybrid UI + API Authentication (Fastest Test Execution):
Bypass slow UI login pages by making an API call and injecting the session into `BrowserContext`:

```javascript
test('Hybrid Auth - Login via API and inject storageState into UI', async ({ request, context, page }) => {
  // Login via fast API call (< 200ms)
  const loginRes = await request.post('https://myapp.com/api/login', {
    data: { user: 'sriram', pass: 'secret' }
  });
  const { authToken } = await loginRes.json();

  // Inject token directly into browser's localStorage
  await page.addInitScript((token) => {
    window.localStorage.setItem('jwtToken', token);
  }, authToken);

  // Navigate directly to protected dashboard — already logged in!
  await page.goto('https://myapp.com/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

---

#### 4. Response validation and negative scenarios

**Answer:**

Comprehensive API automation requires validating not only happy paths (status 200/201), but also status codes, response headers, response time, payload schemas, and negative boundary cases.

##### 1. Schema & Detailed Body Validation:

```javascript
import { test, expect } from '@playwright/test';

test('Comprehensive Response Validation', async ({ request }) => {
  const startTime = Date.now();
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  const responseTime = Date.now() - startTime;

  // 1. Status Code & Status Text Validation
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe('OK');
  expect(response.ok()).toBeTruthy();

  // 2. Response Time Performance Assertion (< 2000ms)
  expect(responseTime).toBeLessThan(2000);

  // 3. Response Headers Validation
  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  // 4. Detailed Body / Field-Level Validation
  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body.name).toEqual('Leanne Graham');
  expect(body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Regex email validation
  expect(body.address).toHaveProperty('geo');
  expect(typeof body.address.city).toBe('string');
});
```

##### 2. Negative Test Scenarios:

```javascript
test.describe('API Negative Test Scenarios', () => {
  const baseURL = 'https://reqres.in/api';

  // Negative Scenario 1: 400 Bad Request - Missing mandatory fields
  test('400 Bad Request when password is missing in registration', async ({ request }) => {
    const response = await request.post(`${baseURL}/register`, {
      data: {
        email: 'sydney@fife', // password omitted deliberately
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing password');
  });

  // Negative Scenario 2: 401 Unauthorized - Invalid or expired token
  test('401 Unauthorized when invalid token provided', async ({ request }) => {
    const response = await request.get('https://api.myapp.com/secure-data', {
      headers: {
        Authorization: 'Bearer INVALID_EXPIRED_TOKEN_123',
      },
    });

    expect(response.status()).toBe(401);
  });

  // Negative Scenario 3: 404 Not Found - Resource does not exist
  test('404 Not Found for non-existent user ID', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/999999`);
    expect(response.status()).toBe(404);
  });

  // Negative Scenario 4: 415 / 400 Unsupported Media Type / Bad Content-Type
  test('415 / 400 on incorrect Content-Type payload format', async ({ request }) => {
    const response = await request.post(`${baseURL}/users`, {
      headers: { 'Content-Type': 'text/plain' },
      data: 'invalid plain text payload where json is expected',
    });

    expect([400, 415]).toContain(response.status());
  });
});
```

---

## 32. Accenture Interview Questions — Playwright focused

**Role:** Test Automation Engineer / SDET  
**Company:** Accenture  
**Focus:** Playwright, JavaScript/TypeScript, Framework Architecture, Debugging & CI/CD  

---

### 1. Tell me about yourself and walk through your project

**Answer:**

"Hi, I am a QA Automation Engineer / SDET with over [X] years of experience specializing in test automation, framework development, and CI/CD quality engineering.

**My Core Responsibilities:**
- Architecting and maintaining robust, scalable end-to-end automation frameworks using **Playwright with JavaScript/TypeScript**.
- Implementing the **Page Object Model (POM)** pattern enhanced with **custom fixtures** for seamless dependency injection.
- Integrating UI and API tests into CI/CD pipelines (**GitHub Actions / Jenkins**) with parallel worker execution, sharding, and automated reporting.
- Optimizing test execution speed using **Playwright `storageState` session reuse**, network mocking, and API-driven test setups.
- Collaborating with cross-functional Agile teams to enable in-sprint automation and reduce defect escape rates.

**Key Achievements:**
- Reduced regression test execution time by **60%** by transitioning legacy suites to Playwright with parallel execution and CI sharding.
- Achieved a **98%+ test stability rate** by replacing arbitrary waits with Playwright's built-in auto-waiting and web-first assertions.
- Implemented API test setup utilities to seed test data before UI tests run, decreasing UI test duration by 40%."

---

### 2. Which IDE do you use, and your Git version?

**Answer:**

- **IDE:** **Visual Studio Code (VS Code)**
  - *Why VS Code for Playwright:*
    - **Playwright Test for VS Code Extension:** Provides native test running/debugging, step-by-step execution, locator picking, interactive DOM inspection, and automatic code generation (Codegen).
    - **Integrated Debugger:** Breakpoint debugging with direct inspection of Playwright's `page` and locator objects.
    - **Extensions:** ESLint, Prettier (code formatting), GitLens (version control history), and Playwright Trace Viewer integration.
- **Git Version & Workflow:**
  - Git version: **Git 2.4x+**
  - Workflow: Feature-branching / Gitflow workflow (`feature/`, `bugfix/`, `release/`, `main`).
  - Pull Request (PR) automation: Pre-merge validation runs Playwright smoke suites in GitHub Actions before code is merged into `main`.

---

### 3. How do you run test files in a CI/CD pipeline?

**Answer:**

In our CI/CD pipeline (e.g., GitHub Actions / Jenkins), tests are executed in a headless, containerized Linux environment with parallel workers, artifact preservation, and automated reporting.

#### Sample GitHub Actions Workflow (`.github/workflows/playwright.yml`):

```yaml
name: Playwright Test Automation Suite

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  schedule:
    - cron: '0 2 * * *' # Nightly regression at 2 AM UTC

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    # Run tests across multiple parallel matrix shards
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install project dependencies
        run: npm ci

      - name: Install Playwright browsers with OS dependencies
        run: npx playwright install --with-deps

      - name: Run Playwright Tests (Sharded)
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
        env:
          CI: true
          BASE_URL: ${{ secrets.QA_BASE_URL }}
          AUTH_TOKEN: ${{ secrets.QA_AUTH_TOKEN }}

      - name: Upload HTML Test Report Artifact
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.shardIndex }}
          path: playwright-report/
          retention-days: 14

      - name: Upload Trace & Failure Artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.shardIndex }}
          path: test-results/
          retention-days: 7
```

**Key Pipeline Best Practices:**
1. Use `npm ci` for deterministic, clean installs.
2. Install browser binaries via `npx playwright install --with-deps`.
3. Use `--shard=x/y` to distribute test files across multiple CI agent machines.
4. Capture and upload `playwright-report/` and `test-results/` (traces/videos/screenshots) on failure.

---

### 4. A test fails in parallel execution but passes when run alone — how do you handle it?

**Answer:**

"When a test passes in isolation but fails during parallel execution, it is almost always caused by **shared state, test data collision, or environmental race conditions**."

#### Systematic Root Cause & Resolution Steps:

| Cause | Why it Fails in Parallel | How to Fix |
|-------|--------------------------|------------|
| **Shared Test Data Collision** | Multiple worker threads modify/delete the exact same user, record, or entity simultaneously. | **Generate unique, dynamic test data** per test using timestamps or UUIDs (e.g. `user_${Date.now()}@example.com` or Faker.js). |
| **Shared Authentication / Session** | Multiple tests overwrite or invalidate the shared session token / cookies at the same time. | Use isolated `BrowserContext` per test or role-based dedicated `storageState` files (`adminAuth.json`, `userAuth.json`). |
| **Global / Static Variable Pollution** | Framework variables outside `test()` blocks modified across tests running in the same process. | Keep page objects, state, and test variables strictly scoped inside tests or Playwright fixtures. |
| **Server / DB Resource Bottlenecks** | Too many parallel requests cause backend timeouts or database locks. | Tune worker concurrency (`workers: 4` or `workers: '50%'` in config), increase assertion timeouts, or optimize backend environment. |
| **Order Dependency** | Test B relies on Test A having created a record or navigated first. | Ensure **zero interdependency**. Each test must be completely autonomous (seed its own data via API in `beforeEach`). If strictly dependent, use `test.describe.configure({ mode: 'serial' })`. |

#### How to Debug:
1. Re-run locally with multiple workers: `npx playwright test --workers=4`.
2. Inspect the **Trace Viewer** of the failed test run (`npx playwright show-trace test-results/.../trace.zip`) to check DOM state and network responses at the exact moment of failure.

---

### 5. Locators Preferences in Playwright

**Answer:**

Playwright recommends an **accessibility-first, user-centric locator hierarchy**. We prioritize locators that reflect how actual users and assistive technologies perceive the webpage, making tests resilient to HTML refactoring.

#### Locator Priority Order:

```
1. getByRole()        (Primary choice — matches accessibility tree)
       ↓
2. getByLabel()       (Form controls associated with <label>)
       ↓
3. getByPlaceholder() (Input fields with placeholder text)
       ↓
4. getByText()        (Non-interactive text content)
       ↓
5. getByTestId()      (Dedicated QA test attribute: data-testid)
       ↓
6. locator(css)       (Stable CSS / structural selectors)
       ↓
7. XPath / Dynamic ID (Avoid / Last resort)
```

#### Examples & Rationale:

```javascript
// 1. BEST: User-facing role + name
await page.getByRole('button', { name: 'Submit Order' }).click();
await page.getByRole('heading', { level: 1, name: 'User Profile' });

// 2. BEST for form inputs: Label association
await page.getByLabel('Email Address').fill('sriram@accenture.com');

// 3. GOOD: Placeholder
await page.getByPlaceholder('Search products...').fill('Laptop');

// 4. GOOD: Dedicated test ID (stable against UX redesigns)
await page.getByTestId('cart-total-amount');

// 5. CSS with Filtering (for complex lists/tables):
await page.locator('.product-row').filter({ hasText: 'MacBook' }).getByRole('button', { name: 'Delete' }).click();

// ❌ AVOID: Brittle, implementation-dependent XPaths / Dynamic IDs
// await page.locator('//div[3]/div[2]/table/tbody/tr[1]/td[4]/button');
// await page.locator('#button_9421_submit');
```

---

### 6. `beforeAll()` vs `beforeEach()` — When do you use each?

**Answer:**

Both are lifecycle hooks provided by Playwright, but they differ in execution frequency, isolation scope, and fixture access.

| Feature | `beforeAll()` | `beforeEach()` |
|---------|---------------|----------------|
| **Execution Frequency** | Runs **once** before all tests in a file/group | Runs **before every single test** in a file/group |
| **Scope** | Worker-level / Suite-level | Individual test-level |
| **`page` Fixture Access** | ❌ **No** (Cannot access `page` fixture directly because `page` is scoped to individual tests) | ✅ **Yes** (Has direct access to `page`, `context`, and custom test fixtures) |
| **Test Isolation** | Shared across tests in that worker | Clean, isolated slate per test |
| **Primary Use Cases** | - Setting up database connections<br>- Fetching global auth tokens / API tokens<br>- Starting/stopping mock servers<br>- Loading heavy static test fixtures | - Navigating to the base URL (`await page.goto('/')`)<br>- Resetting application state<br>- Instantiating Page Objects<br>- Creating unique test-specific data via API |

#### Code Example:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Order Management Module', () => {
  let authToken;

  // beforeAll: Heavy one-time setup (Runs ONCE)
  test.beforeAll(async ({ request }) => {
    const authRes = await request.post('https://api.myapp.com/auth/token', {
      data: { client_id: 'accenture_qa', secret: 'secret123' },
    });
    const data = await authRes.json();
    authToken = data.token; // Cached for entire suite
  });

  // beforeEach: Test-specific setup (Runs BEFORE EACH TEST)
  test.beforeEach(async ({ page }) => {
    // Set token in localStorage and navigate to dashboard
    await page.addInitScript((token) => {
      window.localStorage.setItem('auth_token', token);
    }, authToken);
    await page.goto('/dashboard');
  });

  test('Test 1: View profile', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });

  test('Test 2: View orders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  });
});
```

---

### 7. Write a TS/JS program to find the second largest number in an array

**Answer:**

#### Approach 1: Single Pass $O(n)$ Time & $O(1)$ Space (Optimal Solution)
Iterate through the array once while maintaining two variables: `largest` and `secondLargest`. Correctly handles negative numbers, duplicate maximum values, and edge cases.

```typescript
function findSecondLargest(arr: number[]): number | null {
  if (!arr || arr.length < 2) {
    console.log("Array must contain at least two elements.");
    return null;
  }

  let largest = -Infinity;
  let secondLargest = -Infinity;

  for (const num of arr) {
    if (num > largest) {
      secondLargest = largest;
      largest = num;
    } else if (num > secondLargest && num < largest) {
      // Handles duplicate values of largest (e.g., [20, 20, 10])
      secondLargest = num;
    }
  }

  if (secondLargest === -Infinity) {
    console.log("No distinct second largest element found (all elements are equal).");
    return null;
  }

  return secondLargest;
}

// Test Cases:
console.log(findSecondLargest([12, 35, 1, 10, 34, 1])); // 34
console.log(findSecondLargest([10, 5, 10]));             // 5 (Duplicate max handled)
console.log(findSecondLargest([-10, -5, -20, -2]));      // -5 (Negative numbers handled)
console.log(findSecondLargest([10, 10, 10]));            // null (All equal)
console.log(findSecondLargest([7]));                     // null (< 2 elements)
```

- **Time Complexity:** $O(n)$ — Single pass through the array.
- **Space Complexity:** $O(1)$ — Constant extra memory.

---

### 8. What is POM (Page Object Model) and why use it?

**Answer:**

**Page Object Model (POM)** is a structural design pattern in test automation where each web page (or distinct UI component) is represented by a dedicated class.

- The **class** encapsulates the page's UI elements (locators) and user actions (methods).
- The **test scripts** interact exclusively with page methods and contain assertion logic.

```
       ┌───────────────────────────────┐
       │         Test Script           │  <-- Contains test flow and assertions
       │  (e.g., login.spec.js)        │
       └──────────────┬────────────────┘
                      │ calls methods
                      ▼
       ┌───────────────────────────────┐
       │       Page Object Class       │  <-- Encapsulates locators and user actions
       │   (e.g., LoginPage.js)        │
       └──────────────┬────────────────┘
                      │ interacts with
                      ▼
       ┌───────────────────────────────┐
       │        Web Application        │  <-- Real browser DOM
       └───────────────────────────────┘
```

#### Why use POM?
1. **Maintainability:** If a locator changes (e.g. login button ID), you only update it in one place (`LoginPage.js`), without touching hundreds of test files.
2. **Reusability:** Common workflows (e.g., `login()`, `searchProduct()`, `checkout()`) are written once and reused across multiple test suites.
3. **Readability:** Tests read like business requirements rather than technical selector manipulation:
   ```javascript
   await loginPage.login('admin', 'password');
   await dashboardPage.navigateToSettings();
   ```
4. **Separation of Concerns:** UI interaction logic is decoupled from validation/assertion logic.

---

### 9. Have you done API testing?

**Answer:**

"Yes. In my projects, I perform automated REST API testing using **Playwright's native `APIRequestContext` (`request` fixture)** as well as tools like Postman and RestAssured."

#### How API Testing is utilized in our Playwright Automation:

1. **Standalone API Regression Suites:**
   - Validating CRUD operations (GET, POST, PUT, DELETE, PATCH).
   - Verifying HTTP status codes (200, 201, 400, 401, 403, 404, 500).
   - Validating response schemas, headers, content types, and latency performance SLAs.

2. **Fast Pre-Test Setup & Post-Test Teardown:**
   - Instead of logging in via UI and clicking 15 times to create a shopping cart, we execute an API call in `beforeEach` (< 200ms) to create the cart and inject its ID into the test.
   - Cleaning up database records via DELETE APIs in `afterEach`.

3. **Session Authentication Reuse (`storageState`):**
   - Logging in via API, obtaining JWT tokens/cookies, and injecting them directly into browser storage to bypass UI login screens.

4. **Hybrid End-to-End Validation:**
   - Action triggered on UI (e.g., place an order) $\to$ Backend validation via API (e.g., verify order status in database/API is `PROCESSED`).

---

### 10. How do you handle a Strict Mode Violation in Playwright?

**Answer:**

#### What is a Strict Mode Violation?
By default, Playwright enforces **strict mode** on all locator actions (`click()`, `fill()`, `textContent()`, etc.). If a locator resolves to **more than one element** in the DOM, Playwright halts execution immediately and throws:

```
Error: strict mode violation: locator('button.submit-btn') resolved to 3 elements:
1) <button class="submit-btn">Save Draft</button>
2) <button class="submit-btn">Submit Order</button>
3) <button class="submit-btn">Cancel</button>
```

#### How to Handle / Resolve It:

##### 1. Refine the Locator (Best Practice — Make it unique):
Use accessible roles, text, or parent-child filters:
```javascript
// Before (matches multiple buttons):
// await page.locator('button.submit-btn').click();

// After (Precise and unique):
await page.getByRole('button', { name: 'Submit Order' }).click();
```

##### 2. Use `filter()`:
```javascript
await page.locator('.product-card').filter({ hasText: 'iPhone 15' }).click();
```

##### 3. Use Explicit Index Selectors (`first()`, `last()`, `nth()`):
When intentionally selecting an item from a list:
```javascript
await page.locator('.dropdown-item').first().click();
await page.locator('.dropdown-item').nth(2).click(); // 3rd item (0-indexed)
```

##### 4. For Multi-Element Assertions, use `count()` or `all()`:
```javascript
// Assert count
await expect(page.locator('.todo-item')).toHaveCount(5);

// Iterate through all matched elements
const items = await page.locator('.product-title').all();
for (const item of items) {
  console.log(await item.textContent());
}
```

---

### 11. Key features of your automation framework

**Answer:**

"Our Playwright automation framework is designed with an enterprise architecture focused on speed, reliability, maintainability, and CI/CD integration."

#### Core Framework Features:

```
                  ┌─────────────────────────────────────────────────┐
                  │          Playwright Automation Framework        │
                  └───────────────────────┬─────────────────────────┘
                                          │
    ┌─────────────────┬───────────────────┼───────────────────┬─────────────────┐
    ▼                 ▼                   ▼                   ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌───────────────┐ ┌────────────────┐ ┌────────────────┐
│ Page Object  │ │ Session Auth │ │ Built-in API  │ │ Parallelism &  │ │ Multi-Channel  │
│  & Fixtures  │ │ storageState │ │ Orchestration │ │ CI/CD Sharding │ │ Reporting &    │
│ Architecture │ │ (Fast Login) │ │ (Hybrid E2E)  │ │ (Cross-Browser)│ │ Trace Debugging│
└──────────────┘ └──────────────┘ └───────────────┘ └────────────────┘ └────────────────┘
```

1. **TypeScript / JavaScript Core:** Strict typing, IntelliSense, modern async/await syntax.
2. **Page Object Model + Custom Fixtures (`test.extend`):** Clean dependency injection where pages are auto-initialized and passed into tests with zero boilerplate.
3. **Session Authentication Reuse (`storageState`):** Saves cookies and localStorage to JSON, bypassing UI login on every test run.
4. **Hybrid UI + API Integration:** Fast API calls for data preparation and assertions.
5. **Cross-Browser & Multi-Device Execution:** Native Chromium, Firefox, WebKit, and mobile viewport emulation.
6. **Built-in Auto-Waiting & Auto-Retrying Assertions:** Zero arbitrary `sleep()` calls, drastically reducing flakiness.
7. **Trace Viewer, Screenshots & Video Recording:** Captured on first retry / failure for instant debugging.
8. **Dynamic Test Data Management:** Environment-specific configs (`qa.env`, `stage.env`) combined with dynamic data generators (Faker.js).
9. **CI/CD Pipeline with Matrix Sharding:** Distributed runs in GitHub Actions / Jenkins with HTML reports published to GitHub Pages or AWS S3.

---

### 12. What are fixtures, and how do you create a custom one?

**Answer:**

#### What are Fixtures?
In Playwright, **Fixtures** provide a powerful dependency injection mechanism. They set up the environment, instantiate required resources, provide them to the test, and tear them down automatically after the test finishes.

- **Isolation:** Every test gets a fresh, isolated fixture instance.
- **Composability:** Fixtures can depend on other fixtures.
- **Lazy Initialization:** Fixtures only run if a test explicitly declares them as arguments.

#### How to Create a Custom Fixture:

##### Step 1: Define Custom Fixtures (`fixtures/myCustomFixture.ts` / `.js`)

```typescript
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// 1. Declare the fixture types
type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  loggedInPage: Page;
};

// 2. Extend the base test object with custom fixtures
export const test = base.extend<MyFixtures>({
  // Page Object Fixture: Instantiates LoginPage
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage); // Passes fixture to the test
  },

  // Page Object Fixture: Instantiates DashboardPage
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  // Pre-authenticated Page Fixture
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser@accenture.com', 'Password123');
    await use(page); // Test receives already-logged-in page
    // Teardown logic after test completes (optional)
    await page.context().clearCookies();
  },
});

export { expect } from '@playwright/test';
```

##### Step 2: Use the Fixtures in Test Files (`tests/dashboard.spec.ts`)

```typescript
import { test, expect } from '../fixtures/myCustomFixture';

// Notice how zero "new LoginPage(page)" instances are created manually!
test('user can view dashboard statistics', async ({ loggedInPage, dashboardPage }) => {
  await dashboardPage.openStatisticsTab();
  await expect(dashboardPage.statsCard).toBeVisible();
});
```

---

### 13. How do you handle dynamic locators / dynamic elements?

**Answer:**

Dynamic elements have IDs, classes, or attributes that change every render or deployment (e.g., `<button id="btn_x78k_submit">`).

#### Strategies to Handle Dynamic Elements in Playwright:

##### 1. User-Facing Accessibility Locators (Immune to dynamic DOM changes):
```javascript
// Regardless of changing IDs, role and accessible name remain constant
await page.getByRole('button', { name: 'Confirm Payment' }).click();
await page.getByLabel('Date of Birth').fill('1995-05-15');
```

##### 2. Locator Filtering & Chaining:
Filter parent containers by static text or child elements:
```javascript
// Target a specific row in a dynamic table
const targetRow = page.locator('tr').filter({ hasText: 'Invoice #1042' });
await targetRow.getByRole('button', { name: 'Download PDF' }).click();
```

##### 3. Substring Matching in CSS / XPath:
When attributes have dynamic suffixes or prefixes:
```javascript
// Starts with: id starts with "user_submit_"
await page.locator("button[id^='user_submit_']").click();

// Contains: class contains "item-card"
await page.locator("div[class*='item-card']").click();

// Ends with: id ends with "_save"
await page.locator("input[id$='_save']").click();
```

##### 4. Regex Pattern Matching:
```javascript
// Dynamic order confirmation message
await expect(page.locator('.confirmation-msg')).toHaveText(/Order #\d{6} confirmed/);
```

##### 5. Polling Assertions with `expect.toPass()`:
For elements whose contents update via live WebSockets or async background polls:
```javascript
await expect(async () => {
  const badge = await page.locator('.status-badge').textContent();
  expect(badge?.trim()).toBe('Ready');
}).toPass({ timeout: 10000, intervals: [500, 1000] });
```

---

## 33. 10 Playwright Interview Questions You Should Be Ready to Answer

*If you're preparing for a Playwright / SDET / Automation Engineer interview, don't focus only on syntax. Top organizations test how well you understand framework design, scalability, debugging, CI/CD, and real-world automation. These 10 questions probe exactly that.*

---

### 1. How would you design a scalable Playwright automation framework for a large enterprise application?

**Answer:**

Scalability at enterprise level means the framework has to support many teams, many applications/modules, and a growing number of tests without becoming slow or unmaintainable. Key design pillars:

```
enterprise-framework/
├── core/                    # Framework internals — not test-specific
│   ├── DriverManager.js     # Browser/context lifecycle
│   ├── BasePage.js          # Shared Page Object behavior
│   └── BaseTest.js          # Shared test lifecycle hooks
├── modules/                 # One folder per business domain/team
│   ├── checkout/
│   │   ├── pages/
│   │   └── tests/
│   ├── inventory/
│   │   ├── pages/
│   │   └── tests/
│   └── payments/
│       ├── pages/
│       └── tests/
├── fixtures/                # Shared + module-specific fixtures
├── api/                     # API clients for fast test-data setup
├── config/                  # Per-environment config (dev/qa/stage/prod)
├── utils/                   # Cross-cutting helpers (data gen, date, retry)
└── ci/                      # Pipeline definitions, shard strategy
```

**Design principles that make it scale:**

| Principle | How it's achieved |
|-----------|--------------------|
| **Modularity** | Each business domain owns its Page Objects/tests in its own folder — teams don't step on each other |
| **Reusability** | Shared `BasePage`/`BaseTest`/fixtures live in `core/`, imported everywhere, changed in one place |
| **Test isolation** | Fresh `BrowserContext` per test (Playwright default), unique test data per test/run |
| **Fast setup** | API-based test data creation and `storageState` auth reuse instead of UI-driven setup |
| **Parallelism built-in** | `fullyParallel: true`, tuned `workers`, and CI **sharding** across machines |
| **Config-driven environments** | Base URL, credentials, feature flags loaded per environment, never hardcoded in tests |
| **Ownership boundaries** | Each team can add/modify their module's tests without needing framework-team review for every PR |
| **Observability** | Centralized HTML/Allure reporting, trace-on-retry, screenshots/videos on failure only |
| **Governed extension points** | New Page Objects/fixtures follow a documented contract (constructor takes `page`, exposes behavior not locators) so 50 contributors produce consistent code |

**Interview-ready summary:** "I design for team autonomy and speed — a thin, well-tested core that every module depends on, strict test isolation so parallelism is safe by default, and API-first setup so the suite scales in test *count* without scaling linearly in *execution time*."

---

### 2. How does Playwright's auto-waiting mechanism work, and when would you use explicit waits?

**Answer:**

Every Playwright **action** (`click`, `fill`, `check`, etc.) automatically waits for the target element to pass a sequence of **actionability checks** before performing the action — there's no need to manually wait for the element first.

**The actionability checks, in order:**

```
1. Attached   — element is present in the DOM
2. Visible    — has non-empty bounding box, no visibility:hidden
3. Stable     — not animating (same bounding box across 2 consecutive frames)
4. Enabled    — not disabled
5. Receives Events — not obscured by another element on top of it
```

```typescript
// This single line internally waits for all 5 checks before clicking
await page.click('#submit');

// Web-first assertions ALSO auto-retry — polling every ~100ms until true or timeout
await expect(page.locator('.success')).toBeVisible();
await expect(page.locator('.cart-count')).toHaveText('3');
```

**When explicit waits are still needed** — auto-waiting only covers element actionability, not *application-level* async events that don't map to a specific element becoming actionable:

```typescript
// Waiting for a navigation to complete
await page.waitForURL('**/dashboard');

// Waiting for a specific network response (e.g., data load finished)
await page.waitForResponse(resp => resp.url().includes('/api/orders') && resp.ok());

// Waiting for the network to go idle (rare — mostly for legacy apps without clear signals)
await page.waitForLoadState('networkidle');

// Waiting for a new tab/popup/download event
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#export-btn'),
]);
```

**What NOT to do:**

```typescript
// ❌ Anti-pattern — arbitrary fixed delay, either too short (flaky) or too long (slow)
await page.waitForTimeout(3000);
```

**Interview-ready summary:** "Auto-waiting covers 'is this element ready to be acted on', which is 90%+ of what causes flakiness in Selenium-era frameworks. I reach for explicit waits only for events that aren't tied to a single element's state — network responses, URL changes, downloads, or custom app events — and never for arbitrary fixed-time sleeps."

---

### 3. A Playwright test passes locally but fails intermittently in CI. How would you investigate and fix it?

**Answer:**

**Step-by-step investigation:**

1. **Capture evidence from CI, not just the failure message** — enable this permanently for CI runs:
   ```javascript
   use: {
     trace: 'on-first-retry',
     screenshot: 'only-on-failure',
     video: 'retain-on-failure',
   }
   ```
2. **Open the trace** downloaded from the CI artifact: `npx playwright show-trace trace.zip` — check the DOM snapshot at the failing action, network calls around that time, and console errors.
3. **Reproduce locally under CI-like conditions** — headless, same worker count, throttled CPU/network if possible:
   ```bash
   npx playwright test --workers=4 --repeat-each=20 tests/flaky.spec.ts
   ```
4. **Check the usual CI-vs-local divergence points:**

| Cause | What to check |
|-------|----------------|
| **Timing/speed** | CI machines are often slower/shared — replace any implicit assumption of fast response with proper `waitForResponse`/assertions |
| **Headless rendering differences** | Some CSS animations/fonts render slightly differently headless vs headed — check `waitForLoadState` and animation-stability |
| **Parallelism / shared state** | Two tests in different workers hitting the same test account/data and conflicting |
| **Environment/config drift** | Missing env vars, different base URL/feature flags in CI vs local `.env` |
| **Browser binary mismatch** | CI didn't run `npx playwright install --with-deps` after a Playwright version bump |
| **Viewport/resolution** | CI default viewport differs from local dev machine — set explicitly in config |
| **Network flakiness** | Calls to real third-party services (payment gateway, analytics) that CI's network handles differently |

5. **Isolate the specific test** — run it alone (`--workers=1`) to rule out cross-test contamination.
6. **Fix the root cause, not the symptom** — don't just add `retries: 3` and move on; that hides real bugs. Use retries as a safety net *after* fixing what's fixable, not as the primary fix.

**Interview-ready summary:** "I don't guess — I turn on trace/video/screenshot capture in CI, pull the actual trace, and look at the DOM/network state at the exact failing moment. Most 'passes locally, fails in CI' issues come down to timing assumptions, shared test data across parallel workers, or an environment/config difference — the trace tells you which one within a couple of minutes."

---

### 4. How would you implement authentication efficiently so hundreds of tests don't perform UI login repeatedly?

**Answer:**

The core idea: **log in once, save the session, reuse it everywhere** via Playwright's `storageState`.

**Step 1 — Authenticate once in global setup and persist the session:**

```javascript
// global-setup.js
import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://myapp.com/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('#login-btn');
  await page.waitForURL('**/dashboard');

  // Persist cookies + localStorage to disk
  await page.context().storageState({ path: './auth/user.json' });
  await browser.close();
}
```

**Step 2 — Every test reuses the saved state instead of logging in:**

```javascript
// playwright.config.js
export default {
  globalSetup: require.resolve('./global-setup.js'),
  use: {
    storageState: './auth/user.json',
  },
};
```

**For multiple roles** (admin, viewer, editor), generate one `storageState` file per role and assign per `describe` block:

```typescript
test.describe('Admin flows', () => {
  test.use({ storageState: './auth/admin.json' });
  test('admin can delete a record', async ({ page }) => { /* ... */ });
});

test.describe('Viewer flows', () => {
  test.use({ storageState: './auth/viewer.json' });
  test('viewer cannot see delete button', async ({ page }) => { /* ... */ });
});
```

**Even faster — skip the UI entirely and authenticate via API:**

```typescript
setup('authenticate via API', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    data: { username: 'testuser', password: 'password123' },
  });
  const { token } = await response.json();

  // Inject the token directly, bypassing the login form entirely
  await request.storageState({ path: './auth/user.json' });
});
```

**Why this scales to hundreds of tests:**
- Login happens **once per role**, not once per test — saves 2-5+ seconds × hundreds of tests
- Removes UI-login flakiness (slowest, most fragile part of most suites) from the critical path of every test
- `storageState` files can be regenerated on a schedule (e.g., before each CI run) so sessions never go stale mid-suite

**Interview-ready summary:** "I never let individual tests own the login flow. Authentication is a fixture-level or global-setup-level concern — authenticate once (ideally via API, or UI only if API isn't available), persist `storageState`, and every test starts already logged in. This turns an O(n) cost across the whole suite into effectively O(1)."

---

### 5. How does Playwright handle parallel execution, and how would you safely run thousands of tests in parallel?

**Answer:**

**How Playwright parallelizes:**

- **Workers** — independent OS processes, each with its own browser instance; `workers: N` runs N test *files* concurrently
- **`fullyParallel: true`** — goes further and runs individual **tests within the same file** concurrently too, not just across files
- **Sharding** — splits the *entire suite* across multiple CI machines, each shard running a subset with its own worker pool

```javascript
// playwright.config.js
export default {
  fullyParallel: true,
  workers: process.env.CI ? 4 : '50%', // 4 workers on CI, half the CPU cores locally
};
```

```bash
# Distribute 1000s of tests across 8 CI machines, 4 workers each = 32-way parallelism
npx playwright test --shard=1/8   # machine 1
npx playwright test --shard=2/8   # machine 2
# ... up to 8/8
```

**Safely running at scale (thousands of tests) requires discipline beyond just cranking up `workers`:**

| Risk at scale | Mitigation |
|----------------|------------|
| **Shared test data collisions** | Every test creates its own data (unique IDs via timestamp/worker index), never reuses a shared fixed record |
| **Shared external state** (a single "admin" account, a single DB row) | Provision per-worker or per-test resources (e.g., a pool of test users, one per worker) |
| **Rate-limited/expensive external dependencies** | Mock third-party APIs (`page.route()`) rather than hammering a real payment gateway thousands of times |
| **Flood on the target environment** | Cap total concurrency to something the QA/staging environment can actually absorb — infinite workers just DoS your own test environment |
| **Non-deterministic ordering assumptions** | Never write a test that depends on running before/after another — `test.describe.configure({ mode: 'serial' })` only within a file, and only when truly required |
| **Report/artifact overload** | `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, `trace: 'on-first-retry'` — capturing everything for thousands of passing tests wastes disk/CI minutes |
| **Flaky test amplification** | A 1%-flaky test run 5,000 times produces ~50 failures — track flake rate per test and quarantine/fix repeat offenders rather than blanket-retrying |

**Interview-ready summary:** "Playwright gives you workers and sharding for free, so the mechanics of parallelism aren't the hard part — the hard part is making thousands of tests **independent**: unique data, mocked externals, no shared fixed accounts, and capacity-aware concurrency so you don't overwhelm the environment under test. Sharding scales linearly *only if* the tests themselves don't fight over shared state."

---

### 6. What is the difference between Browser, BrowserContext, and Page? Why is BrowserContext important for test isolation?

**Answer:**

```
Browser (Chromium/Firefox/WebKit instance — one per worker, shared across many tests)
│
├── BrowserContext 1 (isolated session — like an incognito window)
│   ├── Page 1 (a tab) — shares cookies/localStorage with Page 2
│   └── Page 2 (a tab)
│
└── BrowserContext 2 (completely separate session — no shared cookies/storage with Context 1)
    └── Page 3
```

| Concept | What it is | Isolation scope |
|---------|-----------|-------------------|
| **Browser** | The actual browser application instance | Shared — expensive to launch, so reused across many tests in a worker |
| **BrowserContext** | An isolated session inside the browser (own cookies, localStorage, cache, permissions) | Full isolation between contexts |
| **Page** | A single tab within a context | Shares session state with sibling pages in the *same* context |

```typescript
const browser = await chromium.launch();          // one heavy launch

const contextA = await browser.newContext();       // cheap, near-instant
const pageA1 = await contextA.newPage();
const pageA2 = await contextA.newPage();
// pageA1 and pageA2 share cookies — log in on pageA1, pageA2 is already logged in

const contextB = await browser.newContext();       // completely fresh session
const pageB1 = await contextB.newPage();
// pageB1 has NO access to contextA's cookies — asks for login again
```

**Why `BrowserContext` matters for test isolation:**

1. **Playwright's test runner creates a brand-new `BrowserContext` per test by default** — so every test starts with zero cookies, zero localStorage, zero leftover session state from the previous test, *without* the cost of launching a new browser process each time.
2. **Context creation is nearly instant** (unlike a full browser launch), which is exactly what makes "isolated context per test" cheap enough to do for every single test at scale.
3. It's the natural mechanism for **multi-user scenarios in one test** — e.g., testing a shared document editor with "User A" and "User B" as two separate contexts within the same test, each fully isolated but running against the same browser instance.
4. It maps directly onto **Q4's authentication reuse** — `storageState` is set *per context*, so a context can be created "pre-logged-in" without ever touching the login UI.

**Interview-ready summary:** "Browser is the expensive, shared resource; Context is the cheap, disposable isolation boundary — that's the whole reason Playwright can give every test a clean slate without a slow full-browser relaunch. Understanding this is also the key to writing multi-user tests: separate contexts, same browser."

---

### 7. How would you test an application that depends on unstable or unavailable third-party APIs?

**Answer:**

The core principle: **don't let your test's pass/fail hinge on infrastructure you don't own and can't control.** Use Playwright's native network interception to remove the dependency entirely, while still validating your app handles the third party correctly.

**1. Mock the third-party response — deterministic, fast, no external dependency:**

```typescript
await page.route('**/api/payment-gateway/**', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ status: 'success', transactionId: 'txn_12345' }),
  });
});

await page.goto('/checkout');
await page.click('#pay-now');
await expect(page.locator('.payment-success')).toBeVisible();
```

**2. Simulate the third party's failure modes deliberately — this is often MORE valuable than the happy path:**

```typescript
// Simulate the payment gateway timing out
await page.route('**/api/payment-gateway/**', route => route.abort('timedout'));
await page.click('#pay-now');
await expect(page.locator('.payment-error')).toHaveText(/try again/i);

// Simulate a 500 from the third party
await page.route('**/api/shipping-rates/**', route =>
  route.fulfill({ status: 500, body: JSON.stringify({ error: 'Service unavailable' }) })
);
await expect(page.locator('.shipping-fallback-message')).toBeVisible();
```

**3. Partial mocking — let the real call happen, but tweak the response (useful for edge cases the real service can't easily reproduce on demand):**

```typescript
await page.route('**/api/inventory/**', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  json.stock = 0; // Force an out-of-stock edge case
  await route.fulfill({ response, body: JSON.stringify(json) });
});
```

**4. Record real traffic once, replay it deterministically (HAR files) — useful when the mock needs to match a real, complex response shape exactly:**

```typescript
await page.routeFromHAR('tests/mocks/shipping-api.har', { url: '**/api/shipping/**' });
```

**5. Reserve a small number of true end-to-end tests against the real third party** (in a nightly/scheduled suite, not the PR-blocking suite) so you still catch genuine contract drift — but the bulk of coverage runs mocked, fast, and deterministic.

**Interview-ready summary:** "I separate 'testing that my app correctly calls and handles a third party' from 'testing that the third party itself works' — the second one isn't my job and shouldn't block my pipeline. `page.route()` lets me mock success, failure, timeout, and malformed-response scenarios for the third party on demand, which is actually *better* coverage than hoping the real unstable service happens to be down when I need to test my error handling."

---

### 8. How would you combine Playwright UI testing with API testing in the same automation framework?

**Answer:**

Playwright ships a built-in `request` fixture (`APIRequestContext`) that makes HTTP calls without needing a browser — so UI and API testing live in the same framework, same test runner, same reports, using the same assertion library.

**1. Use API calls for fast test-data setup, then verify via the UI (most common pattern):**

```typescript
test('newly created order appears correctly in the UI', async ({ page, request }) => {
  // API: create the order in ~50ms instead of clicking through a multi-step UI form
  const response = await request.post('/api/orders', {
    data: { product: 'Widget', quantity: 2 },
  });
  expect(response.ok()).toBeTruthy();
  const { orderId } = await response.json();

  // UI: verify the actual user-facing behavior
  await page.goto(`/orders/${orderId}`);
  await expect(page.locator('.order-status')).toHaveText('Pending');
});
```

**2. Pure API test suite, colocated with UI tests, sharing the same config/reporting:**

```typescript
test.describe('Orders API', () => {
  test('GET /api/orders/:id returns correct schema', async ({ request }) => {
    const response = await request.get('/api/orders/123');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ id: 123, status: expect.any(String) });
  });
});
```

**3. Cleanup via API after a UI test** — keeps the environment clean without slow UI-driven teardown:

```typescript
test.afterEach(async ({ request }, testInfo) => {
  if (testInfo.annotations.find(a => a.type === 'orderId')) {
    await request.delete(`/api/orders/${orderId}`);
  }
});
```

**4. Authenticated API calls sharing the same session as the UI** — since `request` can be given the same `storageState`, a POST from the API fixture and a page load in the browser can hit the app as the *same logged-in user*.

**Where to draw the UI vs. API line:**

| Use API for | Use UI for |
|-------------|------------|
| Test data setup/teardown | The actual user journey under test |
| Verifying backend contract/schema | Visual/interaction behavior (drag-drop, modals, animations) |
| Fast negative-path/status-code checks | End-to-end flows spanning multiple screens |
| Seeding large volumes of data | The one or two critical assertions that must be seen through real rendering |

**Interview-ready summary:** "I treat the UI and API as two entry points into the same application, tested from the same framework. API calls do the heavy lifting for setup/teardown and backend contract checks — fast and reliable — while the UI tests stay focused on what a user actually experiences. This alone is usually the single biggest lever for cutting suite execution time, because UI-driven setup is almost always the slowest part of a test."

---

### 9. How would you design a locator strategy that remains maintainable when the application's UI changes frequently?

**Answer:**

The goal is to make locators depend on things that **rarely change** — user-facing semantics and dedicated test hooks — rather than things that change on every refactor — CSS classes, DOM structure, or auto-generated IDs.

**Locator priority, most to least resilient:**

```typescript
// 1. Role + accessible name — tied to what the USER sees/hears, survives most CSS/DOM refactors
await page.getByRole('button', { name: 'Submit Order' }).click();

// 2. Label / placeholder text — tied to the form's actual UX copy
await page.getByLabel('Email Address').fill('user@example.com');
await page.getByPlaceholder('Search products...').fill('laptop');

// 3. Dedicated test attribute — a contract explicitly owned by QA + Dev, survives styling changes entirely
await page.getByTestId('checkout-submit-btn').click();

// 4. Visible text — fine for stable, non-dynamic copy
await page.getByText('Order Confirmed').isVisible();

// 5. CSS/structural selectors — last resort, most fragile
await page.locator('.btn.btn-primary.mt-3').click();  // breaks on any style refactor
```

**Practical strategies to keep this maintainable at scale:**

1. **Push for `data-testid` as a team contract.** Get developers to add `data-testid` to key interactive elements as part of the Definition of Done — this decouples locators from styling/DOM changes entirely, and is the single highest-leverage fix for locator churn.
2. **Centralize locators in Page Objects, never inline in test files.** When the UI changes, you fix the locator in exactly one place (`LoginPage.js`), not in every test file that touches that page.
   ```typescript
   export class CheckoutPage {
     constructor(page) {
       this.page = page;
       this.submitButton = page.getByTestId('checkout-submit-btn'); // single source of truth
     }
   }
   ```
3. **Filter/chain instead of writing brittle deep-nested selectors** — target a stable ancestor, then filter by content:
   ```typescript
   await page.locator('tr').filter({ hasText: 'Invoice #1042' })
     .getByRole('button', { name: 'Download' }).click();
   ```
4. **Use regex for dynamic-but-patterned text** rather than hardcoding a value that will go stale:
   ```typescript
   await expect(page.locator('.order-status')).toHaveText(/Order #\d+ confirmed/);
   ```
5. **Avoid absolute XPath and index-based locators** (`div > div > span:nth-child(3)`) — they break the moment a sibling element is added/removed, which happens constantly during active UI development.
6. **Codegen as a starting point, not the final answer** — `npx playwright codegen` often produces brittle CSS selectors; always review and upgrade to role/testid-based locators before committing.

**Interview-ready summary:** "I rank locators by how tightly they're coupled to implementation details versus user-facing intent — role and `data-testid` at the top because they survive redesigns, raw CSS/XPath at the bottom because they don't. Combined with centralizing every locator inside Page Objects, a UI refactor becomes a handful of one-line fixes instead of a mass find-and-replace across hundreds of test files."

---

### 10. How would you design a CI/CD strategy for a Playwright framework used by multiple development teams?

**Answer:**

With multiple teams sharing one framework, the CI/CD strategy has to balance **fast feedback for each team** against **not drowning shared CI infrastructure** in redundant full-suite runs.

**1. Tiered execution triggered by context, not one-size-fits-all:**

| Trigger | What runs | Why |
|---------|-----------|-----|
| **On every PR/commit** | Smoke tests + tests tagged for the changed module(s) | Fast feedback (minutes, not hours) — don't block a dev's PR on unrelated teams' tests |
| **Merge to main** | Full regression for the affected team's module | Confidence before it ships to shared main |
| **Nightly (scheduled)** | Full cross-team regression suite, all browsers | Catches cross-module integration regressions that PR-scoped runs miss |
| **Pre-release** | Full regression + cross-browser + visual regression | Final gate before a release cut |

```typescript
// Tag tests so CI can selectively run subsets
test('checkout completes successfully', { tag: ['@smoke', '@checkout'] }, async ({ page }) => { ... });
```

```bash
npx playwright test --grep @smoke              # PR pipeline
npx playwright test --grep @checkout           # Only checkout team's PRs
npx playwright test                            # Nightly — full suite
```

**2. Parallelism + sharding to keep even the full nightly suite fast:**

```yaml
# GitHub Actions example
strategy:
  matrix:
    shardIndex: [1, 2, 3, 4]
    shardTotal: [4]
steps:
  - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

**3. Shared framework, isolated ownership per team:**
- One monorepo/shared package for `core/` (BasePage, fixtures, DriverManager) — changes here go through a review process the framework team owns
- Each team owns their `modules/<team>/` folder independently — they can add/modify their own tests without needing sign-off from every other team
- A **contract/versioning discipline** on shared fixtures — breaking changes to a shared fixture require a deprecation notice, not a silent break across every team's tests

**4. Environment strategy:**
- PR pipeline runs against an ephemeral/preview environment (or a shared QA env with per-PR data isolation) so teams don't block each other on environment availability
- Nightly runs against a stable staging environment that mirrors production config

**5. Reporting and ownership routing:**
- Centralized dashboard (Allure/HTML report published per run) so any team can see cross-team health, not just their own
- Failures auto-route/notify the owning team (via tags mapped to a Slack channel/JIRA component) rather than dumping every failure on one central QA inbox

**6. Guardrails to prevent one team's flaky test from blocking everyone:**
- Per-test flake-rate tracking; a test crossing a flake threshold gets auto-quarantined (tagged `@quarantine`, excluded from the blocking PR gate, but still tracked) until its owning team fixes it
- `retries` configured in CI (`process.env.CI ? 2 : 0`) as a safety net, not a substitute for fixing real flakiness

**Interview-ready summary:** "The strategy has three layers: tiered execution so PR feedback stays fast while nightly still gets full coverage, sharding/parallelism so 'full suite' doesn't mean 'slow suite', and clear ownership boundaries — shared core with governance, per-team modules with autonomy — so the framework scales in *teams* the same way it scales in *tests*."

---

## 34. Playwright Interview Q&A — Real-World Answers (4+ Years Experience)

> Source: personal interview prep notes (framed as answers you'd actually give in an interview, not just definitions).

### 34.1 Framework & Design

**1. How do you design a scalable Playwright automation framework from scratch?**

Design the framework in layers so tests contain business scenarios rather than low-level implementation details.

Typical structure:

```
playwright-framework/
├── tests/
│   ├── ui/
│   ├── api/
│   └── regression/
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── testFixtures.ts
├── utils/
│   ├── apiClient.ts
│   ├── testData.ts
│   └── logger.ts
├── data/
│   ├── users.json
│   └── testData.json
├── api/
│   └── endpoints.ts
├── playwright.config.ts
├── package.json
└── reports/
```

Key principles:
- Use Page Object Model for UI abstraction
- Use fixtures for common setup and dependency injection
- Keep test data separate from test logic
- Create reusable API clients/utilities
- Support multiple environments through configuration
- Enable parallel execution
- Capture traces/screenshots/videos on failures
- Generate CI-friendly reports
- Avoid hard waits
- Keep tests independent and deterministic

> The most important goal is **maintainability and isolation**, not simply creating a large number of utility classes.

**2. How do you implement Page Object Model in Playwright?**

Each page gets a class containing locators and page-specific actions:

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
```

```typescript
test('valid login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('admin', 'password');
  await expect(page).toHaveURL(/dashboard/);
});
```

> Prefer exposing business-level methods such as `login()`, `createOrder()`, `checkout()` rather than exposing every click and locator to the test.

**3. How do you manage test data in Playwright?**

Different mechanisms depending on the type of data:
- **JSON** — static test data
- **CSV** — data-driven scenarios
- **Environment variables** — credentials/configuration
- **API** — dynamically create test data
- **Database** — when application architecture allows controlled DB access
- **Fixtures** — reusable generated data

```typescript
import users from '../data/users.json';

test('login', async ({ page }) => {
  await loginPage.login(
    users.validUser.username,
    users.validUser.password
  );
});
```

> For large suites, prefer **API-generated test data** — it reduces UI setup time and makes tests more independent.

**4. How do you implement environment-based execution?**

```bash
ENV=qa npx playwright test
```

```typescript
const environments = {
  dev:  { baseURL: 'https://dev.example.com' },
  qa:   { baseURL: 'https://qa.example.com' },
  prod: { baseURL: 'https://example.com' }
};

const env = process.env.ENV || 'qa';

export default defineConfig({
  use: { baseURL: environments[env].baseURL }
});
```

> Never hardcode passwords — use CI secrets or environment variables.

**5. How do you handle multi-environment configurations in `playwright.config.ts`?**

Keep environment-specific values in a configuration object or external files:

```typescript
const config = {
  dev:  { baseURL: 'https://dev.example.com',  apiURL: 'https://dev-api.example.com' },
  qa:   { baseURL: 'https://qa.example.com',   apiURL: 'https://qa-api.example.com' },
  prod: { baseURL: 'https://prod.example.com', apiURL: 'https://api.example.com' }
};

const environment = process.env.ENV ?? 'qa';

export default defineConfig({
  use: { baseURL: config[environment].baseURL }
});
```

> Also validate that required environment variables exist so a CI job doesn't accidentally run against the wrong environment.

**6. How do you structure large test suites?**

Organize by business domain rather than dumping hundreds of tests into one directory:

```
tests/
├── authentication/
├── customers/
├── orders/
├── payments/
├── reports/
└── regression/
```

Principles:
- Tests should be independent
- Reusable functionality goes into pages/services/helpers
- Common setup goes into fixtures
- Test data stays outside test logic
- Tag smoke/regression/API tests
- Avoid deeply nested inheritance
- Avoid putting assertions exclusively inside page objects

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

**7. How do you implement custom utilities/helpers?**

Create utilities only for genuinely reusable functionality:

```typescript
export async function waitForApiResponse(page: Page, url: string) {
  return page.waitForResponse(response =>
    response.url().includes(url) && response.ok()
  );
}
```

> Avoid creating generic helpers like `clickElement()`, `enterText()`, `wait()` for every simple Playwright operation — that hides Playwright's built-in functionality and makes debugging harder.

---

### 34.2 API + UI Integration

**1. How do you perform API testing in Playwright?**

Playwright provides `request`:

```typescript
test('GET customer', async ({ request }) => {
  const response = await request.get('/api/customers/123');
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(123);
});
```

POST:

```typescript
const response = await request.post('/api/customers', {
  data: { name: 'John', email: 'john@test.com' }
});
expect(response.status()).toBe(201);
```

**2. How do you reuse API responses in UI tests?**

Create data via API, then validate through the UI — much faster than creating an order entirely through the UI:

```typescript
const response = await request.post('/api/orders', {
  data: { productId: 100, quantity: 2 }
});
const order = await response.json();

await page.goto('/orders');
await expect(page.getByText(order.orderNumber)).toBeVisible();
```

**3. How do you handle authentication using API?**

```typescript
const response = await request.post('/api/login', {
  data: { username: process.env.USERNAME, password: process.env.PASSWORD }
});
const { token } = await response.json();

await request.get('/api/orders', {
  headers: { Authorization: `Bearer ${token}` }
});
```

> For browser authentication, generally prefer generating a valid authenticated `storageState` when possible.

**4. How do you mock API responses using `route.fulfill()`?**

```typescript
await page.route('**/api/products', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      products: [{ id: 1, name: 'Mock Product', price: 100 }]
    })
  });
});

await page.goto('/products');
```

Useful for testing: error responses, empty states, slow APIs, rare backend conditions, and UI behavior independent of backend availability.

**5. Difference between `APIRequestContext` and `page.request`?**

- `APIRequestContext` (`request`) is designed for direct HTTP/API operations: `await request.get('/api/users')`
- `page` is primarily for browser/UI automation
- `page.request` provides an API request context associated with the browser context

> API requests don't require browser rendering, DOM interaction, or navigation.

---

### 34.3 Advanced Locators & Selectors

**1. Difference between `locator()` and `page.$()`?**

`locator()` is the preferred modern approach:

```typescript
const button = page.getByRole('button', { name: 'Submit' });
await button.click();
```

`page.$()` returns an `ElementHandle`:

```typescript
const button = await page.$('#submit');
```

Locator provides: auto-waiting, retryability, better handling of dynamic DOM, better assertions, lazy evaluation.

> Prefer Locator APIs over ElementHandles for normal UI automation.

**2. What is auto-waiting?**

Playwright automatically waits for elements to become actionable before performing actions:

```typescript
await page.getByRole('button', { name: 'Submit' }).click();
```

It checks: element exists, is visible, is enabled, is stable, and can receive the click — significantly reducing explicit synchronization code.

**3. How do you handle dynamic elements?**

Avoid brittle selectors like `div:nth-child(7)`. Use semantic locators instead:

```typescript
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Email');
page.getByPlaceholder('Enter email');
page.getByTestId('submit-button');

// Dynamic text
page.getByText(/Order #\d+/);

// Collections
const rows = page.locator('table tbody tr');
await expect(rows).toHaveCount(5);
```

**4. How do you handle Shadow DOM?**

Playwright locators generally work through **open** Shadow DOM automatically:

```typescript
await page.locator('my-component').getByRole('button').click();

// Chaining locators
const component = page.locator('my-component');
await component.getByText('Submit').click();
```

> Closed Shadow DOM generally cannot be accessed through normal DOM selectors.

**5. How do you create custom locator strategies?**

Prefer built-in semantic locators first. If the app consistently provides a custom attribute:

```html
<button data-testid="checkout-button">
```

```typescript
page.getByTestId('checkout-button');
```

If the app uses a different attribute, configure a custom test ID:

```typescript
use: { testIdAttribute: 'data-qa' }
```

```typescript
page.getByTestId('checkout-button');
```

---

### 34.4 Synchronization

**1. Difference between `waitForSelector()`, `waitForLoadState()`, `waitForTimeout()`?**

| Method | Purpose |
|--------|---------|
| `waitForSelector()` (via `locator().waitFor()`) | Waits for a particular DOM element/state |
| `waitForLoadState()` | Waits for a page loading state |
| `waitForTimeout()` | Fixed delay — avoid in normal automation |

```typescript
// waitForSelector-equivalent
await page.locator('#result').waitFor({ state: 'visible' });

// waitForLoadState
await page.waitForLoadState('networkidle');
```

> Don't use `networkidle` blindly — modern apps may continuously make network requests.

```typescript
// waitForTimeout — avoid; creates unnecessary delay and can still be flaky
await page.waitForTimeout(3000);
```

**2. Why is hard wait discouraged?**

```typescript
await page.waitForTimeout(5000);
```

If the app is ready after 500ms, you waste 4.5 seconds. If it needs 6 seconds, the test still fails. Instead, wait for a meaningful condition:

```typescript
await expect(page.getByText('Order created')).toBeVisible();
// or
await page.waitForResponse('**/api/orders');
```

**3. How does Playwright handle implicit waits?**

Playwright auto-waits for actions and assertions:

```typescript
await page.getByRole('button', { name: 'Save' }).click(); // waits until actionable

await expect(page.getByText('Success')).toBeVisible(); // retries until timeout expires
```

---

### 34.5 Parallel Execution & Performance

**1. How does Playwright achieve parallel execution?**

Playwright Test uses worker processes; tests run concurrently across workers:

```bash
npx playwright test --workers=4
```

Each worker gets its own isolated test environment per Playwright's test isolation model.

**2. Difference between Workers and Projects?**

| Concept | Purpose |
|---------|---------|
| **Workers** | Control parallel execution capacity (`--workers=4`) |
| **Projects** | Represent different configurations (browser, device, environment, config variation) |

```typescript
projects: [
  { name: 'chromium', use: { browserName: 'chromium' } },
  { name: 'firefox',  use: { browserName: 'firefox' } }
]
```

**3. How do you control test execution threads?**

```bash
npx playwright test --workers=4
```

```typescript
workers: process.env.CI ? 2 : 4
```

> For CI, choose worker count based on available CPU/memory and test behavior.

**4. How do you run tests in sharding mode?**

```bash
npx playwright test --shard=1/4
```

Then run four CI jobs in parallel: `--shard=1/4`, `--shard=2/4`, `--shard=3/4`, `--shard=4/4` — distributing the suite across CI machines.

**5. How do you reduce test execution time?**

- Run independent tests in parallel
- Use API setup instead of UI setup
- Reuse authenticated `storageState`
- Avoid `waitForTimeout`
- Avoid unnecessary navigation
- Block unnecessary resources where appropriate
- Use sharding in CI
- Keep smoke tests separate from full regression
- Optimize test data creation
- Avoid testing the same workflow repeatedly through the UI

---

### 34.6 Network Handling

**1. How do you intercept network requests?**

```typescript
await page.route('**/api/users', async route => {
  console.log(route.request().method());
  await route.continue();
});
```

Modify requests:

```typescript
await page.route('**/api/users', async route => {
  const headers = { ...route.request().headers(), 'x-test': 'true' };
  await route.continue({ headers });
});
```

**2. How do you validate an API response in UI tests?**

```typescript
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/orders') && response.request().method() === 'POST'
);

await page.getByRole('button', { name: 'Place Order' }).click();

const response = await responsePromise;
expect(response.status()).toBe(201);

const body = await response.json();
expect(body.status).toBe('created');
```

**3. How do you simulate network failure or slow network?**

Failure:

```typescript
await page.route('**/api/products', async route => {
  await route.abort();
});
```

Slow response:

```typescript
await page.route('**/api/products', async route => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  await route.continue();
});
```

Then verify the UI displays the correct loading/error state.

**4. How do you block specific requests?**

```typescript
// Block images
await page.route('**/*', async route => {
  if (route.request().resourceType() === 'image') {
    await route.abort();
  } else {
    await route.continue();
  }
});
```

> This can improve performance in certain scenarios, but shouldn't be done globally if image loading itself is under test.

---

### 34.7 Authentication & Session

**1. How do you handle login once and reuse the session?**

Use `storageState`. A setup test logs in once:

```typescript
await page.goto('/login');
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('password');
await page.getByRole('button', { name: 'Login' }).click();

await page.context().storageState({ path: 'playwright/.auth/admin.json' });
```

Then configure:

```typescript
use: { storageState: 'playwright/.auth/admin.json' }
```

> This avoids logging in through the UI for every test.

**2. What is `storageState`?**

Stores browser authentication state — cookies and local storage — letting a new browser context start already authenticated:

```typescript
storageState: 'playwright/.auth/user.json'
```

> Particularly useful for large test suites. The generated auth file should be treated as sensitive and excluded from source control.

**3. How do you implement SSO login?**

First determine whether the identity provider supports a stable non-interactive authentication mechanism for automation. Possible approaches:
- Pre-authenticated `storageState`
- API-based authentication
- Dedicated test identity provider/environment
- OAuth/token-based setup
- Browser-based SSO flow when necessary

> Avoid automating real MFA/SSO infrastructure in every test if a secure test authentication mechanism is available.

**4. How do you handle multi-user scenarios?**

Create separate authentication states:

```
.auth/
├── admin.json
├── customer.json
└── manager.json
```

```typescript
test.use({ storageState: 'playwright/.auth/admin.json' });
```

For two users interacting simultaneously, create two separate browser contexts:

```typescript
const adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
const userContext  = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
```

---

### 34.8 CI/CD

**1. How do you integrate Playwright with Jenkins, GitHub Actions or Azure DevOps?**

```
Checkout code → Install dependencies → Install Playwright browsers →
Set env vars/secrets → Run tests → Publish report → Upload artifacts
```

```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

> In CI, configure retries and artifacts appropriately.

**2. How do you generate reports in CI?**

```typescript
reporter: [
  ['html'],
  ['junit', { outputFile: 'results.xml' }]
]
```

HTML is useful for human investigation; JUnit is useful for CI systems that consume XML test results.

**3. How do you store artifacts?**

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure'
}
```

CI then uploads: `playwright-report/`, `test-results/`, `screenshots/`, `videos/`, `traces/`.

**4. How do you run Playwright in Docker?**

Use the official Playwright Docker image or build one with the required Node.js and browser dependencies:

```dockerfile
FROM mcr.microsoft.com/playwright:<version>

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "playwright", "test"]
```

> Pin the Playwright version so browser binaries and test dependencies stay consistent.

---

### 34.9 Debugging & Stability

**1. How do you debug flaky tests?**

Systematic process:
1. Check the trace
2. Check screenshots/video
3. Identify whether failure is timing, locator, data, or environment related
4. Look at network/API failures
5. Run the test repeatedly
6. Run it under CI-like conditions
7. Remove unnecessary waits and replace with condition-based waits
8. Verify test isolation
9. Check whether another test modifies shared state

> Don't just add retries and consider the problem solved.

**2. What is Trace Viewer?**

Records detailed test execution info: actions, DOM snapshots, screenshots, network activity, console info, timing.

```bash
npx playwright show-trace trace.zip
```

> One of the first tools to reach for when investigating CI-only failures.

**3. How do you capture screenshots/videos on failure?**

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure'
}
```

> Keeps artifacts manageable while preserving evidence for failed tests.

**4. What is `--debug` mode?**

```bash
npx playwright test --debug
npx playwright test tests/login.spec.ts --debug
```

Launches tests in a debugging-friendly mode allowing inspection of actions and locators. For deeper investigation, use the Playwright Inspector and Trace Viewer.

---

### 34.10 Cross-Browser & Mobile

**1. How do you run tests on Chromium, Firefox and WebKit?**

```typescript
projects: [
  { name: 'chromium', use: { browserName: 'chromium' } },
  { name: 'firefox',  use: { browserName: 'firefox' } },
  { name: 'webkit',   use: { browserName: 'webkit' } }
]
```

```bash
npx playwright test                      # all
npx playwright test --project=chromium   # only chromium
```

**2. How do you emulate mobile devices?**

```typescript
import { devices } from '@playwright/test';

projects: [
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }
]
```

**3. What is device emulation?**

Simulates device characteristics: screen size, user agent, device scale factor, touch support, mobile viewport behavior.

> Not identical to testing on a real physical device — for critical mobile behavior, complement it with real-device coverage where required.

---

### 34.11 File Handling

**1. How do you handle file upload?**

```typescript
await page.getByLabel('Upload file').setInputFiles('test-data/sample.pdf');

// Via file chooser
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByRole('button', { name: 'Upload' }).click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles('test-data/sample.pdf');
```

**2. How do you handle file download and validate content?**

```typescript
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download').click();
const download = await downloadPromise;

const path = await download.path();
await download.saveAs('test-results/report.pdf');
```

For CSV/text files, read and validate contents:

```typescript
import fs from 'fs';

const content = fs.readFileSync('test-results/report.csv', 'utf-8');
expect(content).toContain('Order ID');
```

---

### 34.12 Advanced Scenarios

**1. How do you handle iframes?**

```typescript
const frame = page.frameLocator('#payment-frame');
await frame.getByLabel('Card Number').fill('4111111111111111');

// For a frame object
const frame2 = page.frame({ name: 'payment-frame' });
```

> Prefer `frameLocator()` for locator-based interactions.

**2. How do you handle multiple tabs/windows?**

```typescript
const newPagePromise = page.context().waitForEvent('page');
await page.getByText('Open Report').click();
const newPage = await newPagePromise;

await newPage.waitForLoadState();
await expect(newPage).toHaveTitle(/Report/);

// For a popup
const popupPromise = page.waitForEvent('popup');
await page.getByText('Open').click();
const popup = await popupPromise;
```

**3. How do you handle alerts/popups?**

Playwright auto-handles dialogs only when there's no dialog listener; generally handle expected dialogs explicitly:

```typescript
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});

// For confirmation dismiss
page.once('dialog', async dialog => {
  await dialog.dismiss();
});
```

**4. How do you test drag and drop?**

```typescript
// If supported by the application
await page.locator('#source').dragTo(page.locator('#target'));

// For complex custom drag-and-drop
await page.locator('#source').hover();
await page.mouse.down();
await page.locator('#target').hover();
await page.mouse.up();
```

**5. How do you handle infinite scrolling?**

```typescript
while (!(await page.getByText('Target Item').isVisible())) {
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(500);
}
```

> For a production framework, prefer waiting on a meaningful loading indicator/API response rather than a fixed timeout — e.g. wait for the next API response and continue scrolling until the target appears.

**6. How do you validate table data dynamically?**

```typescript
const rows = page.locator('table tbody tr');
const count = await rows.count();

for (let i = 0; i < count; i++) {
  const row = rows.nth(i);
  console.log(await row.innerText());
}

// For a specific condition
const row = page.locator('table tbody tr').filter({ hasText: 'John' });
await expect(row).toContainText('Active');
```

> Prefer locator filtering rather than relying on hard-coded row indexes.

---

### 34.13 Real-Time Scenarios

**1. Test is failing randomly — how will you debug?**

```
Reproduce → Check trace → Check screenshot/video → Check network/API →
Check locator stability → Check synchronization → Check test data →
Check test isolation → Run under CI conditions
```

Ask: Is the locator unstable? Is the backend response delayed? Is data shared between tests? Is there a race condition? Is the test dependent on execution order? Is the environment overloaded?

> Only after identifying the cause would I consider increasing retries.

**2. How will you automate OTP-based login?**

Prefer a controlled test-environment solution:
- Test-only OTP bypass
- API endpoint that generates/retrieves a test OTP
- Dedicated test OTP service
- Database/API retrieval if explicitly supported by the test environment

> Don't try to bypass production security mechanisms. If the test env exposes `POST /test/otp`, retrieve the OTP via Playwright's API request and enter it into the UI.

**3. How will you test CAPTCHA-protected pages?**

Don't attempt to solve or bypass a real CAPTCHA programmatically. Request instead:
- CAPTCHA disabled in the test environment
- Official test mode provided by the CAPTCHA vendor
- A controlled test bypass
- Dedicated non-CAPTCHA authentication path

> The objective is to test the application's business flow without undermining the security control.

**4. How will you test a payment flow?**

Use the payment provider's sandbox/test environment:

```
Create test customer/order via API → Open checkout UI →
Use provider's test card/data → Submit payment →
Wait for payment API response → Validate UI confirmation →
Validate backend/payment status
```

Also test: successful payment, declined payment, expired card, 3DS/test authentication scenarios, timeout, duplicate submission, payment cancellation.

> Never use real payment credentials or real transactions in automation.

**5. How do you handle flaky elements in CI but not locally?**

Compare: browser/version, CPU/memory, network, environment, timing, test order, parallelism. Then inspect the trace.

Common causes: race conditions, weak locators, backend delays, shared test data, resource contention, missing synchronization.

Replace timing assumptions with condition-based synchronization:

```typescript
// Instead of:
await page.waitForTimeout(3000);
await button.click();

// Use:
await expect(button).toBeEnabled();
await button.click();
```

**6. How do you implement retry mechanism?**

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0
});
```

> Use retries mainly as a safety net, not as a solution for broken tests. Strategy: local = 0 retries, CI = 1–2 retries. If a test passes only after repeated retries, treat it as a flaky test requiring investigation.

---

### 34.14 Coding-Based Questions

**1. Write code to login and validate dashboard**

```typescript
import { test, expect } from '@playwright/test';

test('login and validate dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Username').fill(process.env.USERNAME!);
  await page.getByLabel('Password').fill(process.env.PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

**2. Wait for API response**

```typescript
const responsePromise = page.waitForResponse(
  response =>
    response.url().includes('/api/orders') &&
    response.request().method() === 'GET' &&
    response.status() === 200
);

await page.getByRole('button', { name: 'Orders' }).click();

const response = await responsePromise;
const body = await response.json();
expect(body.orders).toBeDefined();
```

> Important: create the `waitForResponse()` promise **before** triggering the action.

**3. Upload file**

```typescript
await page.getByLabel('Choose file').setInputFiles('test-data/sample.pdf');
await expect(page.getByText('sample.pdf')).toBeVisible();
```

**4. Handle dropdown**

```typescript
// Native <select>
await page.getByLabel('Country').selectOption('IN');

// Custom dropdown
await page.getByRole('combobox', { name: 'Country' }).click();
await page.getByRole('option', { name: 'India' }).click();
```

> Implementation depends on whether the app uses a native select or a custom component.

**5. Write a reusable function for common actions**

A good reusable function represents a meaningful operation:

```typescript
async function login(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}
```

```typescript
test('admin login', async ({ page }) => {
  await login(page, process.env.ADMIN_USER!, process.env.ADMIN_PASSWORD!);
});
```

---

### 34.15 High-Value Interview Follow-Up Questions

For a 4+ years Playwright role, interviewers often go beyond definitions and ask architectural follow-ups.

**Why Playwright over Selenium?**

Playwright provides modern browser automation with built-in auto-waiting, browser-context isolation, network interception, API testing, tracing, multi-browser support, and strong parallel execution. It also provides first-class support for Chromium, Firefox, and WebKit from one framework.

**Why POM?**

POM separates test intent from UI implementation — if a locator changes, update the page object instead of dozens of tests. However, avoid overengineering POM; keep business workflows and assertions at the appropriate layer.

**Why API + UI combination?**

UI tests are expensive and slower. Use APIs to prepare data and authentication, then use the UI only to validate user-facing behavior — this gives better speed and test isolation.

**How do you make automation reliable?**

Reliable automation comes from deterministic test data, independent tests, stable locators, condition-based synchronization, isolated browser contexts, controlled environments, API-based setup, meaningful assertions, and good failure diagnostics. Retries should be a safety net, not the primary stability mechanism.

**What would your ideal framework contain?**

```
                Playwright Framework
                        │
       ┌────────────────┼────────────────┐
       │                │                │
      UI               API           Fixtures
       │                │                │
 Page Objects      API Clients    Auth/Data Setup
       │                │                │
       └────────────────┼────────────────┘
                         │
                Test Specifications
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Chromium        Firefox        WebKit
          │              │              │
          └──────────────┼──────────────┘
                         │
                       CI/CD
                         │
              Reports + Trace + Artifacts
```

---

### 34.16 A Concise Interview Strategy

For a 4+ year interview, don't answer only with definitions. A strong pattern is:

> **Concept → Why → Implementation → Real project example → Trade-off**

Example, for `storageState`:

> "`storageState` stores browser authentication state such as cookies and local storage. I use it to avoid repeating UI login in every test. In my framework, a setup project authenticates the user once and generates an auth state file. Tests consume that state through `use.storageState`. For multi-user scenarios, I maintain separate states or create separate browser contexts. The main consideration is that authentication state is sensitive, so it should not be committed to source control."

> That style demonstrates hands-on framework experience, rather than simply knowing Playwright syntax.


