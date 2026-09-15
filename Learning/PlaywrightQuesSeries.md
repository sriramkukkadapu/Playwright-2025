# Playwright Q&A Series — Beginner to Intermediate Notes

A cleaned-up version of a personal Playwright learning journal, organized into a 7-day learning path — each day builds on the previous one, moving from fundamentals to framework design and debugging.

---

## Table of Contents

**[Day 1: Getting Started with Playwright](#day-1-getting-started-with-playwright)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;1. [What is Playwright?](#1-what-is-playwright)<br>
&nbsp;&nbsp;&nbsp;&nbsp;2. [Why Use Playwright?](#2-why-use-playwright)<br>
&nbsp;&nbsp;&nbsp;&nbsp;3. [Key Advantages of Playwright](#3-key-advantages-of-playwright)<br>
&nbsp;&nbsp;&nbsp;&nbsp;4. [Limitations of Playwright](#4-limitations-of-playwright)<br>

**[Day 2: Language & Architecture Basics](#day-2-language--architecture-basics)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;5. [JavaScript vs TypeScript in Playwright](#5-javascript-vs-typescript-in-playwright)<br>
&nbsp;&nbsp;&nbsp;&nbsp;6. [Playwright vs Selenium — Architecture](#6-playwright-vs-selenium--architecture)<br>
&nbsp;&nbsp;&nbsp;&nbsp;7. [Browser, BrowserContext & Page](#7-browser-browsercontext--page)<br>
&nbsp;&nbsp;&nbsp;&nbsp;8. [JavaScript Basics You Need](#8-javascript-basics-you-need)<br>

**[Day 3: Project Setup & the Test Runner](#day-3-project-setup--the-test-runner)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;9. [The Playwright Configuration File](#9-the-playwright-configuration-file)<br>
&nbsp;&nbsp;&nbsp;&nbsp;10. [The @playwright/test Package & Test Runner](#10-the-playwrighttest-package--test-runner)<br>
&nbsp;&nbsp;&nbsp;&nbsp;11. [Fixtures in Playwright](#11-fixtures-in-playwright)<br>

**[Day 4: Finding and Interacting with Elements](#day-4-finding-and-interacting-with-elements)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;12. [Locators — locator() vs page.$()](#12-locators--locator-vs-page)<br>
&nbsp;&nbsp;&nbsp;&nbsp;13. [Waits & Timeouts](#13-waits--timeouts)<br>
&nbsp;&nbsp;&nbsp;&nbsp;14. [Common Actions & Interactions](#14-common-actions--interactions)<br>

**[Day 5: API Testing & Execution Strategy](#day-5-api-testing--execution-strategy)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;15. [API Testing & Network Interception](#15-api-testing--network-interception)<br>
&nbsp;&nbsp;&nbsp;&nbsp;16. [Parallel Execution & Sharding](#16-parallel-execution--sharding)<br>
&nbsp;&nbsp;&nbsp;&nbsp;17. [Mobile Device Emulation](#17-mobile-device-emulation)<br>

**[Day 6: Sessions, Auth & Framework Design](#day-6-sessions-auth--framework-design)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;18. [Cookies & Authentication State](#18-cookies--authentication-state)<br>
&nbsp;&nbsp;&nbsp;&nbsp;19. [Multiple Browser Contexts (Worked Example)](#19-multiple-browser-contexts-worked-example)<br>
&nbsp;&nbsp;&nbsp;&nbsp;20. [Authentication Flows — UI Login vs Token Login](#20-authentication-flows--ui-login-vs-token-login)<br>
&nbsp;&nbsp;&nbsp;&nbsp;21. [OOP Concepts Used in Playwright Frameworks](#21-oop-concepts-used-in-playwright-frameworks)<br>

**[Day 7: Debugging, CI/CD & Reference](#day-7-debugging-cicd--reference)**<br>
&nbsp;&nbsp;&nbsp;&nbsp;22. [Debugging Real-World Scenarios](#22-debugging-real-world-scenarios)<br>
&nbsp;&nbsp;&nbsp;&nbsp;23. [Docker Integration](#23-docker-integration)<br>
&nbsp;&nbsp;&nbsp;&nbsp;24. [Miscellaneous Testing Concepts](#24-miscellaneous-testing-concepts)<br>
&nbsp;&nbsp;&nbsp;&nbsp;25. [Playwright CLI Cheat Sheet](#25-playwright-cli-cheat-sheet)<br>

---

## Day 1: Getting Started with Playwright

---

### 1. What is Playwright?

Playwright is an **open-source browser automation and end-to-end (E2E) testing framework** developed by Microsoft.

It supports three browser engines out of the box:

- **Chromium** — powers Google Chrome, Microsoft Edge, and other Chromium-based browsers
- **Firefox**
- **WebKit** — the engine behind Safari

One test written against Playwright's API can run against all three engines with no extra setup.

---

### 2. Why Use Playwright?

Playwright is a modern end-to-end automation framework built by Microsoft, designed to be **scalable, maintainable, reusable, and CI/CD-friendly**.

- Fast — no HTTP overhead between the test and the browser
- Comes with its own test runner and built-in HTML/JSON/JUnit reporting
- Supports cross-browser and cross-domain testing
- Supports multiple languages (JavaScript, TypeScript, Python, Java, .NET)
- Offers a huge variety of locator strategies (`getByRole`, `getByLabel`, `getByText`, CSS, XPath...)
- Supports both **web (UI)** and **API** testing in the same framework
- Ships with productivity features like **Codegen**, **storage state**, and **Trace Viewer**
- Can mock API responses without hitting a real backend
- Can record video of a test run
- Has a built-in, automatic wait mechanism — no manual `sleep()` calls needed

---

### 3. Key Advantages of Playwright

| # | Advantage | Details |
|---|-----------|---------|
| a | **Cross-browser support** | One API drives Chromium, Firefox, and WebKit |
| b | **Automatic waiting** | Waits for elements to be ready before acting, reducing flaky tests |
| c | **Fast execution** | Uses a modern browser automation protocol instead of HTTP round-trips |
| d | **Parallel testing** | Runs multiple tests simultaneously to cut total execution time |
| e | **Multi-language support** | JavaScript, TypeScript, Java, Python, .NET |
| f | **Built-in debugging tools** | Screenshots, videos, traces, and detailed error reports |
| g | **Network interception** | Mock, modify, and validate API/network requests |
| h | **Multiple browser contexts** | Isolated sessions without launching multiple browser instances |
| i | **Mobile browser testing** | Emulates phones and tablets |
| j | **CI/CD integration** | Works well with Jenkins, GitHub Actions, Azure DevOps, etc. |
| k | **Reliable automation** | Built for modern, dynamic, JavaScript-heavy web applications |

---

### 4. Limitations of Playwright

No tool is perfect — here's what to keep in mind:

**a. Steeper learning curve (especially coming from simpler tools)**
If you're coming from basic testing tools or manual QA, concepts like fixtures, context isolation, and parallel execution take some time to fully grasp. Powerful, but not always beginner-friendly on day one.

**b. Smaller ecosystem than Selenium**
Selenium has been around much longer, so it has a bigger community and more third-party plugins.

**c. Heavier resource usage**
Playwright launches real browser instances (Chromium, Firefox, WebKit). Running many tests in parallel can consume significant CPU and memory, especially in CI pipelines.

**d. Limited legacy browser support**
No support for older browsers like Internet Explorer, and no direct support for real Safari (WebKit is used as a stand-in engine instead).

**e. Debugging can still get complex**
Playwright provides good debugging tools (traces, screenshots), but failures in asynchronous flows or genuinely flaky UI tests can still be tricky to diagnose.

---

## Day 2: Language & Architecture Basics

---

### 5. JavaScript vs TypeScript in Playwright

Playwright works equally well in JavaScript or TypeScript — TypeScript is simply a superset of JavaScript that adds optional static typing. Here's why many teams choose it:

- **Type safety (fewer bugs)** — TypeScript catches type-related errors before the test even runs.
- **Better IntelliSense & auto-completion** — editors like VS Code offer smart suggestions, method hints, and parameter info.
- **Easier debugging** — type errors surface immediately instead of at runtime.
- **Improved code maintainability** — self-documenting function signatures make a large framework easier to navigate.
- **Better refactoring support** — renaming a method updates every usage safely.
- **Native integration** — Playwright itself is built in TypeScript, so TypeScript support works out of the box with no extra setup.

> You don't need TypeScript to use Playwright well — plain JavaScript is fully supported and often the simpler starting point for beginners.

---

### 6. Playwright vs Selenium — Architecture

Playwright uses a **single WebSocket connection** to control the browser directly, offering faster execution and better reliability compared to Selenium's WebDriver protocol, which relies on HTTP requests for every command.

```
Selenium:   Test Script → WebDriver Client → HTTP → Browser Driver → Browser
Playwright: Test Script → Playwright Library → WebSocket → Browser
```

Because Playwright skips the HTTP request/response cycle for every action, it avoids the network latency that Selenium's protocol introduces.

---

### 7. Browser, BrowserContext & Page

Before writing your first test, it helps to understand Playwright's three core building blocks:

| Concept | What it is |
|---------|-----------|
| **Browser** | An actual running browser instance (e.g. Chromium), launched with a method like `chromium.launch()` |
| **BrowserContext** | An **isolated session** within that browser — like an incognito window. Has its own cookies, storage, and permissions, which makes it ideal for running tests in parallel without cross-test interference |
| **Page** | A single tab/window inside a `BrowserContext`, where your test actually interacts with the web application |

```javascript
const { chromium } = require('playwright');

const browser = await chromium.launch();       // 1. Launch a browser
const context = await browser.newContext();    // 2. Create an isolated context
const page = await context.newPage();          // 3. Open a page (tab) inside it

await page.goto('https://example.com');
```

---

### 8. JavaScript Basics You Need

A handful of core JavaScript concepts come up constantly in Playwright tests — worth being solid on these before diving deeper.

### `===` (Strict Equality)

`===` compares both **value and data type**, without performing any type conversion — unlike `==`, which does convert types before comparing.

```javascript
1 === 1        // true
1 === '1'      // false — different types, no conversion happens
```

### `const`

`const` declares a variable whose **reference** cannot be reassigned after it's created. This is the default choice for most variables in a Playwright test (page objects, locators, fixed values).

```javascript
const baseUrl = 'https://example.com'; // cannot be reassigned later
```

### What is a Promise?

A **Promise** is a placeholder for a value that will be available now, later, or never — it represents the eventual result of an asynchronous operation.

A Promise has three states:

| State | Meaning |
|-------|---------|
| **Pending** | The operation is still running |
| **Fulfilled** | The operation completed successfully |
| **Rejected** | The operation failed with an error |

Almost every Playwright action (`page.goto()`, `locator.click()`, etc.) returns a Promise, which is why we `await` them.

### Async vs Sync Execution

**Async execution:**
- Uses non-blocking execution — other tasks can run while waiting for an operation to finish
- Follows the asynchronous programming model
- Requires `async` functions and the `await` keyword
- Offers better performance for parallel execution and large automation suites
- Slightly more complex, since asynchronous code must be handled correctly
- Best suited for large automation frameworks, parallel execution, and CI/CD pipelines

**Sync execution:**
- Uses blocking execution — each statement waits for the previous one to finish
- Follows the synchronous programming model
- Does not use `async`/`await`
- Simpler to understand, but less efficient for heavy parallel operations
- Best suited for small scripts, learning, or quick one-off automation tasks

### `async` vs `await`

**`async`:**
- Declares a function as asynchronous
- An `async` function **always returns a Promise**, even if it returns a plain value
- Lets asynchronous operations be written in a cleaner, more readable way
- An `async` function can exist even without an `await` inside it

**`await`:**
- Used **inside** an `async` function to pause execution until a Promise resolves
- Instead of returning the Promise object itself, it returns the *resolved value*
- Cannot be used outside an `async` function (except in environments that support top-level `await`)

```javascript
async function login(page) {
  await page.goto('https://example.com/login'); // pauses here until navigation finishes
  await page.fill('#username', 'admin');
}
```

### Promise vs Promise Chaining

**A single Promise:**
- Represents the result of **one** asynchronous operation
- Common methods: `.then()`, `.catch()`, `.finally()`
- Flow: `Operation → Result`
- Simple to use for one task at a time
- Error handling is limited to that specific Promise

**Promise Chaining:**
- Executes multiple asynchronous operations **sequentially**, where each step depends on the previous one
- Uses multiple `.then()` calls linked together
- Flow: `Operation 1 → Operation 2 → Operation 3`
- Useful for workflows with dependent steps
- A single `.catch()` at the end can handle errors from anywhere in the chain

```javascript
fetchUser()
  .then(user => fetchOrders(user.id))
  .then(orders => console.log(orders))
  .catch(error => console.error('Something failed:', error));
```

> In modern Playwright tests, `async`/`await` is almost always preferred over raw `.then()` chaining — it reads top-to-bottom like synchronous code while still being fully asynchronous underneath.

---

## Day 3: Project Setup & the Test Runner

---

### 9. The Playwright Configuration File

The configuration file is the **central place** where you define how your tests should run, so you don't have to repeat the same settings in every test file. It controls things like:

- Browser settings
- Base URL
- Timeouts
- Parallel execution
- Reporters
- Test directories

The typical configuration file name is:

```
playwright.config.js
```

```javascript
// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'https://example.com',
    headless: true,
  },
});
```

---

### 10. The @playwright/test Package & Test Runner

The `@playwright/test` package is Playwright's **official test runner and testing framework**, built on top of the core Playwright library. It gives you everything you need to write, run, and manage automated tests in one place:

- A test runner
- Assertions (`expect`)
- Fixtures (like `page`, `browser`)
- Reporting
- Parallel execution
- Retries
- Test hooks
- Tagging tests

**Benefit of built-in reporters:** reporters like `list`, `html`, or `junit` provide detailed test results and integrate with CI tools for better visibility into a build's pass/fail status.

**Launching a browser:** you launch a browser using a browser-specific launch method, e.g. `chromium.launch()`, `firefox.launch()`, or `webkit.launch()`.

---

### 11. Fixtures in Playwright

Fixtures are Playwright's way of providing **pre-configured, reusable setup** to your tests, instead of repeating the same setup code everywhere.

### Built-in fixtures

The most commonly used built-in fixtures are:

- `page`
- `browser`
- `browserName`
- `context`
- `request`

### Custom fixtures

Beyond the built-ins, teams typically build their own custom fixtures, such as:

- A **token-based fixture** (injects an auth token)
- A **login-credentials fixture** (provides test user data)
- A **data-based fixture** (provides test data)
- **Manual fixtures** (explicitly requested by name in a test)
- **Automatic fixtures** (`{ auto: true }` — run for every test without being named)
- **Dependent fixtures** (one fixture depends on another)

### Overriding a built-in fixture

You can override a built-in fixture (like `page`) using `test.extend()`:

```javascript
const base = require('@playwright/test');

const test = base.test.extend({
  page: async ({ page }, use) => {
    await page.goto('https://example.com');
    await use(page);
  },
});
```

### Designing fixtures for a large test suite

- Separate concerns — keep UI, API, and data fixtures distinct
- Use modular fixtures rather than one giant fixture file
- Prefer **worker-scoped** fixtures for expensive setup (like a shared database connection) so it only runs once per worker, not once per test

### Handling multiple users (admin/user) with fixtures

- Create separate fixtures per role (e.g. `adminPage`, `userPage`)
- Back each one with its own **storage state** so each role stays logged in as itself

### Debugging a failing fixture

- Add logs inside the fixture to see exactly where it's failing
- Check the setup and teardown code separately
- Validate that any fixtures it depends on are working correctly

### Avoiding flaky tests using fixtures

- Do proper setup (API calls, seed data, correct starting state) before the test runs
- Avoid repeating login steps manually in every test — centralize it in a fixture instead
- Keep the test environment controlled and predictable

### What happens if a fixture fails?

- The test that depends on it **fails immediately**
- Any fixtures that depend on the failed one **won't run at all**

### Common mistakes with fixtures

- Overusing fixtures, which makes tests harder to follow
- Sharing mutable state between tests improperly
- Using test-scoped fixtures where a worker-scoped fixture would be more efficient
- Forgetting to clean up resources after the test (teardown)

---

## Day 4: Finding and Interacting with Elements

---

### 12. Locators — `locator()` vs `page.$()`

| Feature | `page.$()` | `locator()` |
|---------|-----------|-------------|
| Return type | `ElementHandle` | `Locator` |
| Auto-waiting | No | Yes |
| Stability | Low | High |
| Handles dynamic UI | Poor | Excellent |
| Recommended | Deprecated style | Best practice |

`locator()` is preferred because it's **lazy** — it doesn't resolve to a specific DOM element immediately. Instead, it re-finds the element every time you use it, which means it automatically survives page re-renders and never goes "stale" the way an `ElementHandle` from `page.$()` can.

```javascript
// Recommended
const button = page.locator('#submit');
await button.click();
```

### Counting elements

```javascript
const { test, expect } = require('@playwright/test');

test('assert element count', async ({ page }) => {
  await page.goto('https://example.com');
  const items = page.locator('.item');
  await expect(items).toHaveCount(5);
});
```

### `getByRole` and `getByLabel`

Playwright also offers **role-based and label-based locators**, which are often more resilient than CSS selectors because they mirror how a real user (or a screen reader) identifies elements:

```javascript
await page.getByRole('textbox', { name: 'search' }).fill('playwright');
await page.getByLabel('search').fill('playwright');
```

---

### 13. Waits & Timeouts

Playwright automatically waits for elements to be actionable before performing most actions, but you can also configure or apply explicit timeouts where needed.

**Example timeout configuration** (values you choose based on your app's needs):

```javascript
module.exports = defineConfig({
  timeout: 60000,            // overall test timeout
  use: {
    navigationTimeout: 30000, // max time for page.goto() etc.
    actionTimeout: 10000,     // max time for actions like click(), fill()
  },
});
```

**Explicit / custom waits when you need finer control:**

```javascript
// Wait up to 5 seconds for this specific click to succeed
await page.click('#button', { timeout: 5000 });

// Wait for an element to reach a specific state
await page.locator('#first-name').waitFor({ state: 'visible' });

// Assertion-level timeout — waits up to 1 second for the condition to become true
await expect(page.locator('#result')).toBeVisible({ timeout: 1000 });
```

---

### 14. Common Actions & Interactions

### Scrolling

```javascript
// Scroll a specific element into view
test('scroll down to an element', async ({ page }) => {
  await page.goto('https://example.com');
  const element = page.locator('#target-section');
  await element.scrollIntoViewIfNeeded();
});

// Scroll the whole page
await page.evaluate(() => {
  window.scrollBy(0, 500);
});
```

### File upload and download

```javascript
// Upload
await page.locator('input[type="file"]').setInputFiles('test.pdf');

// Download
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#download-button'),
]);
await download.saveAs('./downloads/' + download.suggestedFilename());
```

### Taking a screenshot

```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### Checking whether an element is visible

```javascript
const isVisible = await page.locator('#login').isVisible();
```

### Finding an element inside Shadow DOM

Playwright's locators **automatically pierce open shadow roots** — no special API is needed for open shadow DOM, which covers the vast majority of component libraries:

```javascript
await page.locator('#login').locator('button').click();
```

(Closed shadow roots, which deliberately block outside access, generally can't be reached this way — that's a rarer, intentional restriction in the app itself.)

### Navigation

```javascript
await page.goBack();
await page.goForward();
```

### `pause()` — halting execution for debugging

```javascript
await page.pause();
```

This opens the Playwright Inspector and pauses the test, letting you step through actions manually.

### Capturing console logs and JavaScript errors

```javascript
// Capture console messages
test('Capture console logs', async ({ page }) => {
  page.on('console', msg => {
    console.log(`Console ${msg.type()}: ${msg.text()}`);
  });
  await page.goto('https://example.com');
});

// Capture uncaught JavaScript errors on the page
test('Capture JS errors', async ({ page }) => {
  page.on('pageerror', error => {
    console.log('JavaScript Error:', error.message);
  });
  await page.goto('https://example.com');
});
```

### Handling dialogs vs HTTP authentication popups

These are two **different** mechanisms and are handled differently:

```javascript
// Native browser dialogs — alert(), confirm(), prompt()
page.on('dialog', dialog => dialog.accept());

// HTTP Basic Authentication popup (a browser-level login prompt, not a JS dialog)
const context = await browser.newContext({
  httpCredentials: { username: 'user', password: 'password' },
});
```

### Drag and drop

```javascript
// Method 1: built-in helper
await page.dragAndDrop('#source', '#target');

// Method 2: manual mouse control (for custom drag-and-drop widgets)
const source = page.locator('#source');
const target = page.locator('#target');

await source.hover();
await page.mouse.down();
await target.hover();
await page.mouse.up();
```

---

## Day 5: API Testing & Execution Strategy

---

### 15. API Testing & Network Interception

Playwright isn't just for UI testing — it has built-in support for making and validating HTTP requests directly, and for intercepting requests the browser itself makes.

### Making a request

```javascript
const response = await page.request.get('https://api.example.com/users');
console.log(await response.json());
```

### Validating an API response

```javascript
const response = await page.request.get('https://api.example.com/users/1');
expect(response.status()).toBe(200);

const body = await response.json();
expect(body.name).toBe('John Doe');
```

When validating API responses, it's common to check:

- HTTP status code
- Response body
- Response headers
- Response time (if required)
- JSON schema or specific fields

### Mocking an API response

```javascript
await page.route('**/api/data', route =>
  route.fulfill({ json: mockData })
);
```

### Intercepting and controlling requests

| Method | Purpose |
|--------|---------|
| `page.route()` | Intercept requests matching a URL pattern |
| `route.fulfill()` | Return a mocked response |
| `route.continue()` | Send the request on to the real server (optionally modified) |
| `route.abort()` | Block the request entirely |
| `page.waitForResponse()` | Wait for and validate a specific network response |

### Simulating network failures

```javascript
// Simulate a complete outage for matching requests
await page.route('**/api/**', route => route.abort());

// Simulate a server error
await page.route('**/api/**', route =>
  route.fulfill({ status: 500, body: 'Server Error' })
);

// Simulate the browser losing internet connectivity entirely
await context.setOffline(true);
```

---

### 16. Parallel Execution & Sharding

**Sharding** is a way to split your test suite into smaller chunks and run them across multiple machines or processes in parallel. Each "shard" runs a portion of the total tests, which reduces overall execution time for large suites.

To control how many tests run in parallel on one machine, set `workers` in the configuration file:

```javascript
module.exports = defineConfig({
  workers: 4, // run up to 4 tests in parallel
});
```

---

### 17. Mobile Device Emulation

Playwright ships with a library of predefined device profiles (viewport size, user agent, touch support, device scale factor) that you can apply to a browser context:

```javascript
const { devices } = require('@playwright/test');

const context = await browser.newContext({
  ...devices['iPhone 13'],
});
```

This is useful for testing how a site behaves on mobile without needing a real device.

---

## Day 6: Sessions, Auth & Framework Design

---

### 18. Cookies & Authentication State

Cookies in Playwright are managed through the `BrowserContext`:

```javascript
// Read current cookies
const cookies = await context.cookies();

// Add a cookie manually
await context.addCookies([
  { name: 'session', value: 'abc123', url: 'https://example.com' },
]);

// Clear all cookies
await context.clearCookies();
```

**Reusing a logged-in session across tests:** instead of logging in through the UI before every test, save the browser's storage state (cookies + local storage) once, then reuse it:

```javascript
// Save state after logging in once
await context.storageState({ path: 'auth.json' });
```

```javascript
// Reuse it in other tests — no login step needed
test.use({ storageState: 'auth.json' });
```

This speeds up execution, avoids repeated logins, and makes tests more stable.

---

### 19. Multiple Browser Contexts (Worked Example)

Since each `BrowserContext` is fully isolated, you can simulate multiple independent users in a single test — without launching multiple browser instances.

```javascript
const { test, expect } = require('@playwright/test');

test('Multiple browser contexts', async ({ browser }) => {
  // User 1
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  // User 2
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();

  await page1.goto('https://example.com/login');
  await page2.goto('https://example.com/login');

  // User 1 logs in
  await page1.fill('#username', 'admin');
  await page1.fill('#password', 'admin123');
  await page1.click('button[type="submit"]');

  // User 2 logs in
  await page2.fill('#username', 'worker');
  await page2.fill('#password', 'worker123');
  await page2.click('button[type="submit"]');

  await expect(page1).toHaveURL(/dashboard/);
  await expect(page2).toHaveURL(/dashboard/);

  await context1.close();
  await context2.close();
});
```

---

### 20. Authentication Flows — UI Login vs Token Login

Both UI login and token-based authentication have a place, depending on the purpose of the test:

- **UI login** — used to validate the login functionality itself, verifying the end-to-end authentication flow as a real user would experience it.
- **Token/API-based login** (or Playwright's `storageState`) — used for regression and functional tests where login isn't what's being tested. This lets tests start in an already-authenticated state, reducing execution time and avoiding unnecessary dependency on the login page.

A common, practical approach: keep a **small number** of dedicated UI login tests to verify the login flow itself, and use `storageState` for the rest of the suite to improve speed, reliability, and maintainability.

---

### 21. OOP Concepts Used in Playwright Frameworks

When building a Playwright automation framework in TypeScript or JavaScript, several Object-Oriented Programming concepts show up naturally to keep the code maintainable, reusable, and scalable:

- **Class** — a blueprint for a page or component
- **Object** — an instance of a class, e.g. a specific `LoginPage` for the current test
- **Inheritance** — sharing common behavior via a base class
- **Encapsulation** — keeping locators and internal logic contained inside a class
- **Abstraction** — exposing simple methods (`login()`) while hiding the underlying steps
- **Polymorphism** — different page classes implementing a shared interface/shape differently

```javascript
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
  }
}

class LoginPage extends BasePage { // inheritance
  async login(username, password) {
    await this.page.locator('#username').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#login-button').click();
  }
}
```

---

## Day 7: Debugging, CI/CD & Reference

---

### 22. Debugging Real-World Scenarios

### "A test passed locally but fails in CI. What will you do?"

A solid, systematic approach:

- Check for environment differences (URLs, test data, browser versions)
- Look at logs and traces from the CI run
- Consider timing issues — CI machines can be slower or more resource-constrained
- Check whether resource limits (CPU/memory) on the CI runner are affecting the run

### "10 tests fail consistently, though the locators are correct. What's your approach?"

- Check logs for the actual failure reason, not just the surface error
- Check for API failures underlying the UI behavior
- Check for test data issues (missing/invalid data)
- Check for synchronization/timing issues
- Re-examine the assertions themselves — are they checking the right thing?
- Check for conflicts between tests running in parallel (shared state, shared data)

---

### 23. Docker Integration

Playwright can be integrated with Docker by using the **official Playwright Docker image**, which already contains the browsers and required dependencies pre-installed. The typical approach is to create a `Dockerfile` that installs project dependencies, copies in the test scripts, and runs the tests inside the container.

```dockerfile
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npx", "playwright", "test"]
```

---

### 24. Miscellaneous Testing Concepts

### What is RY (Run Yield)?

In automation testing, **RY** usually stands for **Run Yield** — a metric measuring how many automated test executions completed successfully compared to the total number executed.

```
Run Yield (RY) = Passed Test Runs / Total Test Runs
```

### What is fuzz testing?

**Fuzz testing** (or fuzzing) is a technique where an application is fed large amounts of random, unexpected, or malformed input to uncover:

- Crashes
- Security vulnerabilities
- Memory leaks
- Buffer overflows
- Other unexpected behavior

---

### 25. Playwright CLI Cheat Sheet

A quick reference for commonly used Playwright CLI commands.

**Install Playwright**
```bash
npm init playwright@latest
```

**Install Playwright manually**
```bash
npm install -D @playwright/test
npx playwright install
```

**Run all tests**
```bash
npx playwright test
```

**Run a specific file**
```bash
npx playwright test example.spec.js
```

**Run a specific test by name**
```bash
npx playwright test -g "login test"
```

**Run in different browsers**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Headed / headless mode**
```bash
npx playwright test --headed
npx playwright test --headless
```

**Debug mode**
```bash
npx playwright test --debug
```

**Codegen — record actions into a script**
```bash
npx playwright codegen https://example.com
```

**Show the HTML report**
```bash
npx playwright show-report
```

**Open the trace viewer**
```bash
npx playwright show-trace trace.zip
```

**Install browsers**
```bash
npx playwright install
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

**Update Playwright**
```bash
npm install -D @playwright/test@latest
npx playwright install
```

**Run tests in parallel**
```bash
npx playwright test --workers=4
```

**Retry failed tests**
```bash
npx playwright test --retries=2
```

**Run tests by tag**
```bash
npx playwright test --grep @smoke
```

**List all tests without running them**
```bash
npx playwright test --list
```

**Force-reinstall browsers (clear cache)**
```bash
npx playwright install --force
```

**Run only previously failed tests**
```bash
npx playwright test --last-failed
```
