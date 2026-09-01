# Playwright Learning Notes

A comprehensive guide covering Playwright fundamentals, advanced features, and AI-powered test automation.

---

## Table of Contents

0. [What is Playwright?](#0-what-is-playwright)
1. [Why Playwright?](#1-why-playwright)
2. [Architecture — Why Playwright is Faster](#2-architecture--why-playwright-is-faster)
3. [Setup & Installation](#3-setup--installation)
4. [Fixtures](#4-fixtures)
5. [Running Tests](#5-running-tests)
6. [Locating Elements](#6-locating-elements)
7. [Actions & Interactions](#7-actions--interactions)
8. [Assertions](#8-assertions)
9. [Handling Special Scenarios](#9-handling-special-scenarios)
10. [Test Data Management](#10-test-data-management)
11. [Page Object Model (POM)](#11-page-object-model-pom)
12. [Configuration & Browser Setup](#12-configuration--browser-setup)
13. [Parallel Execution](#13-parallel-execution)
14. [Tags & Filtering](#14-tags--filtering)
15. [API Testing with Playwright](#15-api-testing-with-playwright)
16. [Playwright MCP + AI Agents](#16-playwright-mcp--ai-agents)
17. [Playwright CLI for Coding Agents](#17-playwright-cli-for-coding-agents)
18. [JavaScript for Playwright — Cheat Sheet](#javascript-for-playwright--cheat-sheet--quick-notes)

---

## 0. What is Playwright?

### Overview

**Playwright** is an open-source end-to-end testing and browser automation framework that allows you to programmatically control web browsers (Chromium, Firefox, and WebKit) with a single API. It's designed for reliable, fast, and capable cross-browser testing of modern web applications.

### Who Created It?

Playwright was created by **Microsoft** and first released in **January 2020**. The team behind it is the same group of engineers who originally built **Puppeteer** at Google — led by **Andrey Lushnikov** and **Dmitry Gozman**.

When these engineers moved from Google to Microsoft, they took their experience and learnings from Puppeteer and built Playwright from the ground up to solve the limitations they had encountered.

### The Background Story — Why Was It Created?

| Timeline | Event |
|----------|-------|
| **2017** | Google releases **Puppeteer** — a Node.js library to control headless Chrome via DevTools Protocol. Great for Chrome, but single-browser only. |
| **2019** | The core Puppeteer team (Andrey Lushnikov, Dmitry Gozman, and others) moves to **Microsoft**. |
| **Jan 2020** | Microsoft announces **Playwright** — a spiritual successor to Puppeteer with multi-browser support from day one. |
| **2020–2021** | Playwright evolves rapidly: adds Test Runner, auto-waiting, tracing, codegen, and becomes a full E2E framework. |
| **2022+** | Becomes one of the fastest-growing testing frameworks, adopted widely for its reliability and developer experience. |

### Problems Playwright Was Built to Solve

The testing landscape before Playwright had several pain points:

1. **Selenium was slow and flaky** — HTTP-based protocol (JSON Wire/W3C WebDriver) added latency. Required separate browser drivers. No built-in waiting logic led to `sleep()` everywhere.

2. **Puppeteer was Chrome-only** — Great tool but limited to Chromium. No cross-browser testing without switching tools.

3. **No first-class auto-waiting** — Existing tools required manual explicit/implicit waits, leading to timing issues and flaky tests.

4. **Multi-tab and multi-context testing was painful** — Selenium made it difficult to handle multiple tabs, incognito windows, or isolated sessions.

5. **Network interception required external tools** — Selenium needed proxy servers (like BrowserMob) for mocking APIs.

### What Playwright Brought to the Table

Playwright was designed to address all of these from scratch:

- **Multi-browser from day one** — Chromium, Firefox, and WebKit (Safari's engine) with a single API
- **WebSocket-based communication** — Direct connection to browser internals via DevTools Protocol (no HTTP server, no drivers)
- **Auto-waiting built into every action** — Click, fill, assert — all wait for actionability automatically
- **Browser Contexts** — Lightweight isolated sessions (like incognito windows) that are fast to create and destroy
- **Network interception as a first-class feature** — Mock APIs, block resources, modify responses natively
- **Tracing & debugging tools** — Trace Viewer, Codegen, Inspector built right in
- **Multi-language support** — JavaScript, TypeScript, Python, Java, C#

### Playwright vs Puppeteer — Why the Fork?

| Aspect | Puppeteer | Playwright |
|--------|-----------|-----------|
| Creator | Google | Microsoft (same team) |
| Browsers | Chromium only | Chromium + Firefox + WebKit |
| Protocol | Chrome DevTools Protocol | CDP + custom protocol for Firefox/WebKit |
| Test Runner | None (library only) | Built-in `@playwright/test` |
| Auto-waiting | Limited | Full actionability checks |
| Contexts | Basic | First-class isolated BrowserContexts |
| Mobile | Chrome emulation only | Full mobile emulation including Safari iOS |

Think of Playwright as **"Puppeteer 2.0 — multi-browser edition with batteries included."**

### Key Facts

- **License:** Apache 2.0 (fully open source)
- **Repository:** [github.com/microsoft/playwright](https://github.com/microsoft/playwright)
- **First Stable Release:** January 2020
- **Current Adoption:** Used by Microsoft, Google, Netflix, Shopify, and thousands of companies worldwide
- **npm Downloads:** 10M+ weekly downloads (as of 2024)

---

## 1. Why Playwright?

### Core Strengths

| Feature | Description |
|---------|-------------|
| **Reliable E2E Testing** | Built-in auto-wait capability — no flaky `sleep()` calls needed. [Actionability docs](https://playwright.dev/docs/actionability) |
| **Cross-Browser** | Supports Chromium, Edge, Firefox, Safari (WebKit), Opera |
| **Multi-Platform** | Runs on Windows, macOS, Linux. Native mobile emulation for Chrome Android & Safari iOS |
| **Multi-Language** | JavaScript, TypeScript, Python, Java, C# |

### Advanced Features

1. **Tracing & Debugging** — Screenshots, logs, video recordings via Playwright Test Runner
2. **Network Interception** — Mock/intercept API calls using Playwright's built-in routing
3. **Browser Context Management** — Save and transfer browser state between tests (e.g., login once, reuse session in incognito)
4. **Codegen Tool** — Auto-generates test scripts by recording your actions (record & playback)

---

## 2. Architecture — Why Playwright is Faster

**Selenium/WebDriver architecture (slower):**

```
Test Script → WebDriver Client → WebDriver Server → Browser Driver → Browser
                          (HTTP client/server protocol)
```

**Playwright architecture (faster):**

```
Test Script → Playwright → Browser
                (WebSocket - direct connection)
```

Playwright eliminates the WebDriver server layer entirely and communicates directly with the browser via DevTools Protocol over WebSocket. This means:

- No HTTP overhead between test and browser
- No separate driver binaries to manage
- Direct access to browser internals (network, console, DOM)
- Built-in auto-waiting, live locators, and lightweight parallel execution

> Reference: [Playwright Architecture Deep Dive](https://www.linkedin.com/pulse/interview-373-playwright-do-you-know-architecture-rgqdc/)

---

## 3. Setup & Installation

**Prerequisites:**
- Node.js installed
- Editor: VS Code (recommended with Playwright Test extension)

**Create a new project:**

```bash
# Create a new folder for your project, then run:
npm init playwright@latest
```

This scaffolds a complete project with example tests, config file, and installs browsers.

**Core import:**

```typescript
// @playwright/test module launches the browser and provides a fresh page to each test
const { test, expect } = require('@playwright/test');
```

### Your First Test — Hello World Script

```typescript
// tests/hello.spec.ts
import { test, expect } from '@playwright/test';

test('navigate to Google', async ({ page }) => {
  // Go to Google's homepage
  await page.goto('https://www.google.com');

  // Verify the page title contains "Google"
  await expect(page).toHaveTitle(/Google/);
});
```

**Run it:**

```bash
npx playwright test tests/hello.spec.ts --headed
```

### Breaking Down the Script

```typescript
test('navigate to Google', async ({ page }) => {
//                                    ^^^^^^
//                                    This is the PAGE FIXTURE
```

**What is the `page` fixture?**

`{ page }` is a **fixture** — a pre-built object that Playwright automatically creates and provides to your test. You don't need to launch a browser, create a context, or open a tab yourself.

Behind the scenes, when you write `{ page }`, Playwright does all of this for you:

```
1. Launches a browser (Chromium by default)
2. Creates a new BrowserContext (like an incognito session)
3. Opens a new Page (a tab) inside that context
4. Passes that page to your test function
5. After the test finishes → closes the page, context, and cleans up
```

**Without the fixture (old/manual way — DON'T do this):**

```typescript
// Manual approach — verbose and error-prone
const { chromium } = require('playwright');

async function first_test() {
  const browser = await chromium.launch();       // Step 1: Launch browser
  const context = await browser.newContext();    // Step 2: Create context
  const page = await context.newPage();         // Step 3: Open tab
  await page.goto('https://www.google.com');    // Step 4: Navigate
  await browser.close();                        // Step 5: Cleanup
}

first_test();
```

**With the fixture (the Playwright way — use this):**

```typescript
// Playwright handles ALL of the above automatically
test('navigate to Google', async ({ page }) => {
  await page.goto('https://www.google.com');
  // That's it. No setup, no teardown, no cleanup.
});
```

**Why fixtures matter:**
- Zero boilerplate — no browser launch/close code
- Automatic isolation — each test gets a fresh page (no shared state)
- Automatic cleanup — even if the test fails, resources are properly closed
- Parallel-safe — each worker gets its own browser instance

---

## 4. Fixtures (In-Depth)

### 1. What is a Fixture?

- Fixtures are **reusable pieces of code** that set up preconditions and share them across multiple tests
- They help in managing test data, test environment, browser, context, pages, and other resources
- Fixtures keep tests clean, DRY (Don't Repeat Yourself), and easy to maintain

### 2. Why Use Fixtures?

- ✓ Avoid code duplication
- ✓ Improves readability and maintainability
- ✓ Centralized setup and teardown
- ✓ Share resources between tests
- ✓ Better organization and scalability

### 3. Built-in Fixtures

| Fixture | Description |
|---------|-------------|
| `browser` | Browser instance (shared by all tests in the worker) |
| `context` | BrowserContext (isolated session) |
| `page` | Page object (new page in a context) |
| `request` | APIRequestContext for API testing |
| `testInfo` | Information about the current test |
| `workerInfo` | Information about the worker |

### 4. Fixture Hierarchy

```
Test
 ↓
Worker (once per worker)
 ↓
Test (each test)
```

- **Worker fixtures** → run once per worker
- **Test fixtures** → run for each test
- **Auto fixtures** → run automatically for each test

### 5. Using Built-in Fixtures Example

```typescript
// Using built-in fixtures
import { test, expect } from '@playwright/test';

test('Visit Playwright website', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

### 6. Creating Custom Fixtures

```typescript
import { test as base } from '@playwright/test';

type MyFixtures = {
  login: (username: string, password: string) => Promise<void>
};

export const test = base.extend<MyFixtures>({
  login: async ({ page }, use) => {
    // setup
    await page.goto('https://example.com/login');
    await page.fill('#username', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // provide the fixture to tests
    await use(async (username, password) => {
      // custom login logic if needed
    });

    // teardown (optional)
    await page.goto('about:blank');
  }
});
```

**How fixtures work:**
- Code **before** `use()` = **Setup** (runs before the test)
- What you pass to `use()` = **What the test receives**
- Code **after** `use()` = **Teardown** (runs after the test, even if test fails)

### 7. Using Custom Fixture in Tests

```typescript
import { test, expect } from './fixtures';

test('Products page after login', async ({ page, login }) => {
  await login('standard_user', 'secret_sauce');
  await expect(page.locator('.title')).toHaveText('Products');
});
```

### 8. Fixture Scope

| Scope | Runs | Use Case | Default |
|-------|------|----------|---------|
| `test` | Once for each test | Most tests | Yes |
| `worker` | Once per worker process | Expensive setup (DB, auth, etc.) | No |
| `auto` | Automatically for every test | Global setup (rarely used) | No |

> Default scope for custom fixtures is `"test"`.

### 9. Worker Scope Fixture Example

Worker-scoped fixtures run **once per worker** — useful for expensive setup like database connections:

```typescript
export const test = base.extend({
  db: [async ({}, use) => {
    const connection = await createDBConnection();  // Runs once
    await use(connection);                          // Shared across tests in this worker
    await connection.close();                       // Cleanup once per worker
  }, { scope: 'worker' }],
});
```

### 10. Auto-use Fixture

Auto fixtures run for **every test automatically** — no need to reference them in the test function:

```typescript
export const test = base.extend({
  setViewport: [async ({ page }, use) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await use();   // Runs for every test automatically
  }, { auto: true }],
});
```

The test doesn't need to declare `setViewport` as a parameter — it just runs automatically before every test.

### 11. TestInfo Fixture

Access test metadata (name, status, etc.) using `testInfo`:

```typescript
import { test } from '@playwright/test';

test('Screenshot on failure', async ({ page }, testInfo) => {
  // ... test steps

  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`
    });
  }
});
```

### 12. Fixtures File Structure (Best Practice)

```
tests/
├── fixtures/
│   ├── index.ts          // Export custom fixtures
│   ├── auth.fixture.ts   // Authentication fixture
│   └── db.fixture.ts     // Database fixture
├── example.spec.ts       // Test files import from fixtures
└── playwright.config.ts
```

**Tips:**
- Keep fixtures small and focused
- Export `test` from fixtures file
- Reuse across tests

### 13. Test Data Fixture (How I use it)

```typescript
// utils/test-base.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  testDataForLogin: async ({}, use) => {
    await use({
      email: "sriramkukkadapu@gmail.com",
      password: "Test1234!"
    });
  }
});
```

**Using in a test:**

```typescript
import { expect } from '@playwright/test';
import { test as testWithFixture } from './utils/test-base';

testWithFixture('End to end journey', async ({ page, testDataForLogin }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  await page.getByPlaceholder("email@example.com").fill(testDataForLogin.email);
  await page.getByPlaceholder("enter your passsword").fill(testDataForLogin.password);
  await page.getByRole("button", { name: "Login" }).click();
  console.log(await page.title());
});
```

### 14. Do's and Don'ts

**Do's ✓**
- Use fixtures to remove duplication
- Keep setup and teardown in fixtures
- Use proper scope (test/worker/auto)
- Keep fixtures independent
- Close connections and clean resources

**Don'ts ✗**
- Don't put assertions in fixtures
- Don't create complex logic in fixtures
- Don't share mutable data via fixtures
- Don't ignore teardown
- Don't use heavy worker fixtures unnecessarily

### Fixture Lifecycle (Visual Flow)

```
Setup (Preconditions) → Provide to Tests (Using Fixtures) → Run Tests (Using Resources) → Teardown (Cleanup) → Better Tests (Clean & Reusable)
```

> **Fixtures make your tests cleaner, maintainable and scalable. Use them wisely!**

---

## 5. Running Tests

### Basic Commands

```bash
# Run all tests (headless by default)
npx playwright test

# Run a specific test file
npx playwright test tests/example.spec.js

# Run tests for a specific browser
npx playwright test --project=chromium

# Run in headed mode (see the browser)
npx playwright test --headed
npx playwright test tests/example.spec.js --headed

# Run in debug mode (opens Playwright Inspector)
npx playwright test --debug

# Open Playwright UI Test Runner
npx playwright test --ui

# Show HTML report of the latest execution
npx playwright show-report
```

### Code Generator (Record & Playback)

```bash
# Record actions and generate test code
npx playwright codegen <URL> -o <output-path>

# Example:
npx playwright codegen https://www.amazon.in -o ./tests/codegen_example.spec.js
```

### Passing Environment Variables

```bash
# Pass BASE_URL during execution
BASE_URL=https://www.jobcurator.in npx playwright test tests/22BaseURL.spec.js
```

### Using Custom Config Files

```bash
# Use a non-default config file
npx playwright test tests/mytest.spec.js --config playwright-safari.config.js

# Run specific project from multi-project config
npx playwright test tests/mytest.spec.js --config playwright-multiple-projects.config.js --project=safari
```

### Configuring Retries

In your config file — keep `retries` at the **top level** (NOT inside `use`):

```javascript
const config = ({
  retries: 2, // 0 = no retries. Don't put this under `use` — it applies globally.
  // ...rest of config
});

module.exports = config;
```

### Headed Mode in Config

By default tests run **headless** (no browser UI). To show the browser, set `headless: false` inside `use`:

```javascript
const config = ({
  use: {
    headless: false, // Set to true for CI, false for local debugging
  }
});

module.exports = config;
```

Or override via CLI without changing config:

```bash
npx playwright test --headed
```

---

## Playwright Codegen — Your Fastest Start, Not the Finish Line

> Record. Generate. Understand. Optimize.

### What is Codegen?

Codegen is a Playwright tool that **automatically generates test scripts** for the actions you perform in the browser. It opens a browser, records your interactions, and converts them into Playwright code in real-time.

### How Codegen Works

```
Run Codegen  →  Browser Opens  →  Code Generates  →  Save & Use
```

1. **Run Codegen** — `npx playwright codegen`
2. **Browser Opens** — You interact with the application (click, type, navigate)
3. **Code Generates** — Playwright code is generated in real-time as you interact
4. **Save & Use** — Save the script and enhance it further

### Command

```bash
# Basic usage
npx playwright codegen

# With a specific URL
npx playwright codegen https://practice.automationtesting.in/

# Save output to a file
npx playwright codegen https://www.amazon.in -o ./tests/codegen_example.spec.js
```

### Why Do We Use It?

- Quick test script creation
- Explore locators easily
- Understand Playwright syntax
- Great for learning & prototyping
- Speed up initial test development

### How is It Helpful?

- Saves time in writing repetitive steps
- Helps identify the right locators
- Real-time code generation boosts confidence
- Ideal for POCs and demo scenarios
- A great learning companion for beginners

### Codegen Output Example

When you interact with a login form, Codegen generates:

```javascript
test('example test', async ({ page }) => {
  await page.goto('https://practice.automationtesting.in/');
  await page.locator('#username').fill('testuser');
  await page.locator('#password').fill('password');
  await page.locator('#rememberme').check();
  await page.locator('#submit').click();
});
```

### Why Shouldn't We Use It Very Often?

- Generates **non-maintainable** code
- Locators may be too specific or flaky
- **No validations or assertions** added
- No structure (like POM, reusable methods)
- Hard to maintain in the long run
- Not scalable for real-world frameworks

### Raw Codegen vs Refactored Code

**Raw Codegen output (not ideal for production):**

```javascript
test('example test', async ({ page }) => {
  await page.goto('https://practice.automationtesting.in/');
  await page.locator('#username').fill('testuser');
  await page.locator('#password').fill('password');
  await page.locator('#rememberme').check();
  await page.locator('#submit').click();
});
```

**Refactored for Maintainability (what you should do):**

```javascript
test('valid login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('testuser', 'password');
  await expect(loginPage.welcomeText).toBeVisible();
});
```

| Raw Codegen | Refactored |
|-------------|-----------|
| Hard to maintain | ✓ Reusable |
| No structure | ✓ Readable |
| Fragile locators | ✓ Maintainable |
| No assertions | ✓ Scalable |

### Pro Tip

> Use Codegen to **accelerate your start**, but always refactor the code to make it clean, reusable, and framework-ready.

### Key Takeaway

Playwright Codegen is a **powerful assistant, not a replacement** for good automation practices. Use it smartly, refactor wisely, and build frameworks that last!

---

## 6. Locating Elements

### Single Element

```typescript
const userName = page.locator("#username");
```

### Multiple Elements (List)

**Method 1 — Using `locator.all()`:**

```typescript
// Wait until all options are loaded
await expect(page.locator("#state option")).toHaveCount(37);

// Get all elements as an array of locators
const states = await page.locator("#state option").all();
console.log("States count: " + states.length);

for (const state of states) {
  console.log(await state.textContent());
}
```

**Method 2 — Using `page.$$()`** (legacy, prefer `locator.all()`):

```typescript
let states = await page.$$("option");
console.log("States count: " + states.length);

for (const state of states) {
  console.log(await state.textContent());
}
```

### Playwright Special Locators (Recommended)

These are more resilient and readable than CSS/XPath:

| Locator | Example | Use Case |
|---------|---------|----------|
| `page.getByRole()` | `page.getByRole("button", { name: "Submit" })` | ARIA roles — most reliable |
| `page.getByText()` | `page.getByText("Success! Form submitted")` | Visible text content |
| `page.getByLabel()` | `page.getByLabel("Employed")` | Form labels |
| `page.getByPlaceholder()` | `page.getByPlaceholder("Password")` | Input placeholders |
| `page.getByTestId()` | `page.getByTestId("submit-btn")` | `data-testid` attributes |
| `page.getByAltText()` | `page.getByAltText("Logo")` | Image alt text |
| `page.getByTitle()` | `page.getByTitle("Close")` | Title attributes |

### Chaining Locators

```typescript
// Find a specific card, then click its Add button
await page.locator("app-card")
  .filter({ hasText: "iphone X" })
  .getByRole("button", { name: "Add" })
  .click();
```

### Find Element by Text

```typescript
// Playwright-specific text locator
await page.locator("text=Checkout").click();
```

### Handling Visible vs Hidden Elements

When a locator matches multiple elements (one visible, one hidden):

```typescript
// Click only the visible one
await page.locator("li a[href='lifetime-access']:visible").click();
```

---

## 7. Actions & Interactions

### Text Input

```typescript
// Fill — clears existing text and enters new value (instant)
await page.locator("#username").fill("sriramkukkadapu@gmail.com");

// Type sequentially — mimics real user typing (key by key)
await page.locator("input[placeholder='Select Country']").pressSequentially("India");
```

### Click Actions

```typescript
// Standard click
await page.locator("#loginBtn").click();

// Double-click
await page.getByRole('button', { name: 'Double Click Me' }).dblclick();

// Right-click
await page.getByText('Item').click({ button: 'right' });

// Shift + Right-click (modifier keys)
await page.getByText('Item').click({
  button: 'right',
  modifiers: ['Shift']
});
```

### Dropdown Selection

```typescript
// By visible label (preferred — most stable)
await page.locator('select#country-dropdown').selectOption({ label: 'India' });

// By value attribute
await page.locator("#state").selectOption({ value: 'Goa' });

// By index
await page.locator("#state").selectOption({ index: 4 });

// By option text directly
await dropdown.selectOption("Consultant");

// Multiple selections
await page.locator("#hobbies").selectOption(['Singing', 'Dancing']);
```

**Get the currently selected option:**

```typescript
// Method 1: Using inputValue()
console.log(await page.locator('#state').inputValue());

// Method 2: Using evaluate() for text content
const dropdownLocator = page.locator('#state');
const selectedOptionText = await dropdownLocator.evaluate((selectElement) => {
  const index = selectElement.selectedIndex;
  return selectElement.options[index].textContent;
});
console.log("Selected: " + selectedOptionText);
```

**Get all selected options from a multi-select:**

```typescript
const dropdownLocator = page.locator("#hobbies");
const optionsSelected = await dropdownLocator.evaluate((selectElement) => {
  const elements = selectElement.selectedOptions;
  const selectedValues = [];
  for (let i = 0; i < elements.length; i++) {
    selectedValues.push(elements[i].textContent);
  }
  return selectedValues;
});
```

### Checkbox & Radio Button

```typescript
// Check a checkbox or radio button
await page.locator("//…locator").check();

// Click to toggle
await userCheckbox.click();
```

### Navigation

```typescript
// Go to URL
await page.goto("https://example.com");

// Go back / forward
await page.goBack();
await page.goForward();
```

### Hover

```typescript
await page.locator("#mousehover").hover();
```

### Focus

```typescript
await page.locator("input[placeholder='Search the web']").focus();
```

### Keyboard Events

```typescript
await page.keyboard.press("ArrowLeft");
await page.keyboard.down("Shift");
await page.keyboard.up("Shift");
await page.keyboard.press("Backspace");
```

### Drag and Drop

```typescript
// Method 1: Using dragTo()
const source = page.locator('#draggable');
const target = page.locator('#droppable');
await source.dragTo(target);

// Method 2: Using mouse events (for complex cases)
await page.locator('#source').hover();
await page.mouse.down();
await page.locator('#target').hover();
await page.mouse.up();
```

### Getting Text & Values

```typescript
// Get text from a label/div/span
const text = await page.locator("#username").textContent();

// Get value from an input field (filled dynamically)
const value = await page.locator("#username").inputValue();

// Get all text contents from a list of elements
const titles = await page.locator(".card-body h5 b").allTextContents();
```

### Iterating Over Element Lists

```typescript
const allListItems = page.locator('ul > li');
const items = await allListItems.all();

for (const itemLocator of items) {
  console.log(await itemLocator.textContent());
}
```

---

## 8. Assertions

Playwright assertions come with **built-in auto-wait and retry logic** — they keep polling until the condition is met or timeout expires.

```typescript
// Visibility
await expect(page.locator("#displayed-text")).toBeVisible();
await expect(page.locator("#displayed-text")).toBeHidden();

// Text content
await expect(locator).toHaveText("Welcome");

// Input value
await expect(locator).toHaveValue("John");

// Page title
await expect(page).toHaveTitle("Home Page");

// Checkbox state
await expect(userCheckbox).toBeChecked();
expect(await terms.isChecked()).toBeFalsy(); // Unchecked

// Attribute check
await expect(documentsLink).toHaveAttribute("class", "blinkingText");

// Element count
await expect(page.locator("#state option")).toHaveCount(37);
```

---

## 9. Handling Special Scenarios

### Waiting for Elements

Playwright auto-waits for most actions, but sometimes explicit waits are needed:

```typescript
// Wait for last element in a list to load
await page.locator(".card-body h5").last().waitFor();
await page.locator(".card-body b").last().waitFor({ state: 'visible' });

// Wait for specific nth element
await page.locator("div li").nth(3).waitFor();

// Wait for first element
await page.locator("div li").first().waitFor();
```

### Pause Execution (Debugging)

```typescript
// Opens Playwright Inspector (interactive debugger)
await page.pause();

// Hard wait — NOT recommended for production tests
await page.waitForTimeout(2000);
```

### Alert / Dialog Handling

**Alert dialog:**

```typescript
// Set up dialog handler BEFORE triggering the alert
page.on("dialog", dialog => {
  console.log(dialog.message());
  dialog.accept(); // or dialog.dismiss()
});

// Now click the button that triggers the alert
await page.locator("#alertbtn").click();
```

**Confirm dialog:**

```typescript
page.on("dialog", d => {
  expect(d.type()).toContain("confirm");
  expect(d.message()).toEqual("I am a JS Confirm");
  d.accept(); // or d.dismiss() to click Cancel
});

await page.getByRole("button", { name: "Click for JS Confirm" }).click();
```

**Prompt dialog:**

```typescript
page.on("dialog", d => {
  expect(d.type()).toContain("prompt");
  expect(d.message()).toEqual("I am a JS prompt");
  d.accept("Test Input"); // Pass text input to the prompt
});

await page.getByRole("button", { name: "Click for JS Prompt" }).click();
```

### Frames / iFrames

```typescript
await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

// Get the frame using frameLocator
const subPage = page.frameLocator("#courses-iframe");

// Interact with elements inside the frame
await subPage.locator("li a[href='lifetime-access']:visible").click();

const text = await subPage.locator(".text h2").textContent();
console.log("No of Subscribers: " + text.split(" ")[1].trim());
```

### Child Window / New Tab Handling

```typescript
await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

const documentsLink = page.locator("a[href*='documents']");

// Wait for new page event and click simultaneously
const [newPage] = await Promise.all([
  context.waitForEvent('page'),    // Wait for new tab to open
  documentsLink.click()            // Click opens new tab
]);

// Now interact with the new tab
const redText = newPage.locator("p[class='im-para red']");
const text = await redText.textContent();
console.log(text);
```

### Multiple Tabs (e.g., Facebook link opens new tab)

```typescript
await page.goto("https://freelance-learn-automation.vercel.app/login");

const [newPage] = await Promise.all([
  context.waitForEvent("page"),
  page.locator("//a[contains(@href,'facebook')][1]").first().click()
]);

// Interact with the new tab
await newPage.locator("//input[@name='email' and @type='text']").fill("user@example.com");
```

### Autosuggestions / Autocomplete

```typescript
await page.goto("https://www.amazon.in/");
await page.locator("input[id='twotabsearchtextbox']").type("iPhone");

// Wait for suggestions to appear
const suggestionContainer = page.locator('.autocomplete-results-container');
await expect(suggestionContainer).toBeVisible({ timeout: 2000 });

// Get all suggestion texts
const suggestions = await page.locator('.s-suggestion-container .s-suggestion').allTextContents();
console.log("Suggestions count: " + suggestions.length);

for (const suggestion of suggestions) {
  console.log("Suggestion: " + suggestion);
}

// Click a specific suggestion
await page.locator("div[aria-label='iphone 17 pro']").click();
```

### File Upload

```typescript
// Single file upload
await page.locator("#file-upload").setInputFiles("/path/to/upload_file.png");

// Multiple files
await page.locator("#file-upload").setInputFiles(["file1.txt", "file2.txt"]);
```

### File Download

```typescript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#downloadBtn')
]);

// Save to specific path
await download.saveAs('downloads/report.pdf');

// Get download info
console.log(await download.suggestedFilename());
const path = await download.path();

// Verify download succeeded
expect(path).not.toBeNull();

const fs = require('fs');
expect(fs.existsSync(path)).toBeTruthy();
```

---

## 10. Test Data Management

### Read from JSON File (Single User)

```json
// testData/loginTestData.json
{
  "email": "sriramkukkadapu@gmail.com",
  "password": "Test1234!"
}
```

```typescript
import testData from '../testData/loginTestData.json';

test('Login test', async ({ page }) => {
  await page.getByPlaceholder("email@example.com").fill(testData.email);
  await page.getByPlaceholder("enter your passsword").fill(testData.password);
});
```

### Data-Driven Tests (Multiple Users from JSON)

```json
// testData/loginTestDataMultipleusers.json
[
  { "email": "sriramkukkadapu@gmail.com", "password": "Test1234!" },
  { "email": "invalid@gmail.com", "password": "Test1234!" }
]
```

```typescript
import users from '../testData/loginTestDataMultipleusers.json';

for (const user of users) {
  test(`Login Test with User ${user.email}`, async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(user.email);
    await page.getByPlaceholder("enter your passsword").fill(user.password);
    await page.getByRole("button", { name: "Login" }).click();
    console.log(await page.title());
  });
}
```

### Test Data as Fixture

```typescript
// utils/test-base.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  testDataForLogin: async ({}, use) => {
    await use({
      email: "sriramkukkadapu@gmail.com",
      password: "Test1234!"
    });
  }
});
```

```typescript
// tests/login.spec.ts
import { expect } from '@playwright/test';
import { test as testWithFixture } from './utils/test-base';

testWithFixture('Login with fixture data', async ({ page, testDataForLogin }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  await page.getByPlaceholder("email@example.com").fill(testDataForLogin.email);
  await page.getByPlaceholder("enter your passsword").fill(testDataForLogin.password);
  await page.getByRole("button", { name: "Login" }).click();
});
```

---

## 11. Page Object Model (POM)

### POM with Fixture (Recommended Pattern)

**Page Object Manager as Fixture:**

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

**Using in Tests:**

```typescript
// tests/e2e.spec.ts
import { test } from "./pageObjects/POFixture";

test('End to end journey', async ({ poManager }) => {
  const { loginPage, dashboardPage } = poManager;
  await loginPage.gotoLoginPage();
  await loginPage.validLogin("sriramkukkadapu@gmail.com", "Test1234!");
  await dashboardPage.searchProductAndAddtoCart("ZARA COAT 3");
});
```

**Benefits:**
- Each page has its own class with locators and methods
- Fixture injects all pages automatically — no manual instantiation
- Easy to add new pages without changing test files
- Clean separation of test logic from page interaction logic

---

## 12. Configuration & Browser Setup

### Maximize Browser Window

**In config (global):**

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1728, height: 864 }
      },
    }
  ]
});
```

**Launch maximized (full screen):**

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    viewport: null, // Removes fixed viewport
    launchOptions: {
      args: ["--start-maximized"],
    }
  }
});
```

**Per-test override:**

```typescript
test.use({ viewport: { width: 1500, height: 700 } });
```

### Full Config Example

This is the actual config used in this project (`playwright.config.js`):

```javascript
// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
  workers: 10,            // Number of parallel worker threads
  testDir: './tests',     // Directory where tests live
  fullyParallel: true,    // Each test in spec file runs independently
  timeout: 60 * 1000,    // Test timeout across entire project (60 seconds)
  expect: {
    timeout: 30 * 1000   // Timeout only for expect assertions (30 seconds)
  },
  reporter: 'html',       // Generate HTML report
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
    viewport: null,                   // null = allows --start-maximized to work
    launchOptions: {
      args: [
        "--start-maximized",
        "--disable-features=PrivateNetworkAccessPermissionPrompt"
      ],
    }
  }
});

module.exports = config;  // Export config to be available across entire project
```

### Config Settings Explained

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
| `viewport` | `null` | Removes fixed viewport — needed for `--start-maximized` to work |
| `baseURL` | `process.env.BASE_URL` | Set via env variable, defaults to google.com |

**Important notes:**
- `retries` should be at the **top level**, NOT inside `use` — it applies globally
- `viewport: null` + `--start-maximized` together = full screen browser
- Pass `BASE_URL` at runtime: `BASE_URL=https://mysite.com npx playwright test`
- `ignoreHttpsErrors: true` — useful when testing on staging with self-signed certs

### Multi-Browser Projects

```typescript
export default defineConfig({
  projects: [
    {
      name: "safari",
      use: {
        browserName: 'webkit',
        headless: true,
      }
    },
    {
      name: "chrome",
      use: {
        browserName: 'chromium',
        headless: true,
      }
    }
  ]
});
```

### BASE URL Configuration

```typescript
// In config:
use: {
  baseURL: process.env.BASE_URL || 'http://www.google.com',
}

// In test — navigate to base URL:
await page.goto('/');

// Override at runtime:
// BASE_URL=https://www.jobcurator.in npx playwright test tests/mytest.spec.js
```

---

## 13. Parallel Execution

### Method 1 — Per Spec File (Inline)

```typescript
// Add at the top of a specific test file
test.describe.configure({ mode: 'parallel' }); // Tests in THIS file run in parallel
// Default mode is 'serial' (sequential)
```

### Method 2 — Global Config

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4,            // Number of parallel worker threads
  fullyParallel: true,   // Each test in every spec file runs independently
});
```

**Key difference:**
- `workers: 4` — Up to 4 test files execute simultaneously
- `fullyParallel: true` — Individual tests within a file also run in parallel (not just files)

---

## 14. Tags & Filtering

Use tags in test names to categorize and selectively run tests:

```typescript
// Tag a test with @journey
test('@journey End to end journey with Special locators', async ({ browser, page }) => {
  // ...
});
```

**Running tagged tests:**

```bash
# Run only tests tagged with @journey
npx playwright test --grep @journey
```

**Use cases for tags:**
- `@smoke` / `@regression` — test suite type
- `@api` / `@ui` — test category
- `@login` / `@checkout` — module-wise grouping
- Multiple tags can be used per test

---

## 15. API Testing with Playwright

Playwright can make API calls directly using `APIRequestContext` — no need for external libraries like Axios.

```typescript
const loginPayload = {
  userEmail: "sriramkukkadapu@gmail.com",
  userPassword: "Test1234!"
};

// Login via API
const loginResponse = await apiContext.post(
  "https://rahulshettyacademy.com/api/ecom/auth/login",
  { data: loginPayload }
);
expect(loginResponse.ok()).toBeTruthy();

// Extract token from response
const { token } = await loginResponse.json();

// Create order with auth token
const createOrderPayload = {
  orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }]
};

const orderResponse = await apiContext.post(
  "https://rahulshettyacademy.com/api/ecom/order/create-order",
  {
    data: createOrderPayload,
    headers: {
      'authorization': token,
      'content-type': 'application/json'
    }
  }
);
expect(orderResponse.ok()).toBeTruthy();
```

**Why use API calls in Playwright tests?**
- Fast test setup (create data via API instead of clicking through UI)
- Test API endpoints directly
- Combine API + UI in one test (API for setup, UI for verification)

---

## 16. Playwright MCP + AI Agents

### What is MCP?

**MCP (Model Context Protocol)** is a standard for communication between LLMs and external tools/data sources (like browsers, Excel files, Jira tickets, etc.).

```
AI/LLM  ↔  MCP Server (like a USB-C port)  ↔  Your Application (Browser)
```

In the context of Playwright:
- Playwright runs as an **MCP server** (background process)
- The AI agent communicates via MCP tools like `mcp_playwright_browser_click`, `mcp_playwright_browser_snapshot`
- Configured in `mcp.json` or similar config files

**Playwright MCP tools expose browser actions:**
- `click`, `type`, `close`, `press_key`, `navigate`, `hover`, `scroll`, etc.
- The LLM says "click on the login button" → Playwright MCP calls the respective action

### The Agent Trio (Built-in Test Agents)

Playwright provides **3 built-in test agents:**

| Agent | Role |
|-------|------|
| **Planner** | Explores app, analyzes DOM, understands test goals, creates a test plan |
| **Generator** | Converts the test plan into actual Playwright test code with actions & assertions |
| **Healer** | Executes tests, analyzes failures, and auto-fixes broken tests |

### Setup Steps

**Prerequisites:**
- Playwright version: latest
- VS Code: > 1.105

```bash
# 1. Create a new project
npm init playwright@latest

# 2. Initialize agents for VS Code
npx playwright init-agents --loop=vscode
```

**`--loop` options:**
- `--loop=vscode` — For VS Code-based agents (Copilot, Kiro)
- `--loop=claude` — For Claude Code (terminal-based)
- `--loop=cursor` — For Cursor IDE
- `--loop=windsurf` — For Windsurf IDE

**After running, 3 agent files are created:**

```
.github/agents/
├── playwright-test-planner.agent.md
├── playwright-test-generator.agent.md
└── playwright-test-healer.agent.md
```

### MCP Server Command

```bash
# Start the MCP server (used by AI agents)
npx playwright run-test-mcp-server
```

### Workflow

```
AI Agent (LLM)  →  via MCP Protocol (JSON-RPC tool calls)  →  Playwright MCP Server  →  Browser (Your app)
```

### Using with Kiro IDE

1. Activate the 3 agents from `.github/agents` folder
2. Create a `seed.spec.js` file — the agent performs these steps first (e.g., launch URL, login), then generates tests from that state

### Sample Prompt for LLM

```
I need to write a new test for the OrangeHRM dashboard.
https://opensource-demo.orangehrmlive.com/

Please act as the Orchestrator and follow this strict lifecycle:

First, read the rules in @playwright-test-planner.agent.md. Analyze the target 
page and output a step-by-step strategy for the test. Stop and wait for my approval.

Once I approve the plan, switch your context to @playwright-test-generator.agent.md.
Use those specific guidelines to write the actual Playwright Javascript code based 
on the plan.

After you write the code, I will execute the test locally. If the test fails and I 
paste an error log into this chat, immediately assume the role of 
@playwright-test-healer.agent.md to analyze the trace and patch the code.

Before generating tests - Ensure a playwright.config.ts exists in the project root.
If it does not, create one with testDir pointing to the test output directory.
```

### How It Works (Step by Step)

1. **LLM reads planner agent** → opens browser headlessly, analyzes DOM → generates test plan → waits for approval
2. **You approve** → LLM switches to generator agent → generates test scripts → says "tests generated, want me to run?"
3. **If tests fail** → LLM switches to healer agent → analyzes failures and auto-fixes them

### Risks & Limitations of AI-Generated Tests

| Risk | Description |
|------|-------------|
| **Test Explosion** | AI makes it easy to write tests, but may bloat the suite with overlapping/unnecessary tests, creating CI bottlenecks |
| **Hallucinations** | Agents may invent elements or misinterpret DOM — creating "green" tests that assert wrong things. (e.g., AI adds a dropdown option via JS that doesn't actually exist in the app) |
| **Business Logic Gaps** | AI doesn't understand business rules, edge cases, or domain-specific limitations |

> **Always keep a Human in the Loop** — review AI-generated tests for correctness and relevance.

---

## 17. Playwright CLI for Coding Agents

### What is Playwright CLI?

A command-line interface for browser automation designed specifically for **coding agents**. It uses token-efficient commands and installable skills, allowing agents to balance browser automation with large codebases within limited context windows.

### Playwright CLI vs Playwright MCP

| Feature | Playwright CLI (`@playwright/cli`) | Playwright MCP (`@playwright/mcp`) |
|---------|-------------------------------------|--------------------------------------|
| **Data Storage** | Saves snapshots & screenshots as local files on disk | Streams data inline into LLM context window |
| **Token Efficiency** | ~27,000 tokens per session (highly efficient) | ~114,000 tokens per session (up to 4x higher) |
| **Interface Type** | Standard terminal/shell commands (bash) | Structured tool calls via MCP JSON protocol |
| **Ideal Agents** | Repository-aware coding agents (Claude Code, Cursor, Copilot) | Autonomous, sandboxed agents or custom orchestrators |
| **Best Used For** | Fast test generation, CI/CD pipelines, bulk automation | Dynamic UI exploration, self-healing tests, long reasoning |

**Key difference:** CLI stores browser state on disk (files), while MCP streams it live into the LLM's context window.

### Installation

```bash
npm install @playwright/cli@latest
npx playwright-cli --help

# Install browser (downloads automatically on first use)
playwright-cli install-browser               # Default (Chromium)
playwright-cli install-browser firefox       # Specific browser
playwright-cli install-browser --with-deps   # With system dependencies

# Install skills (predefined automation patterns)
playwright-cli install --skills
```

### Using with Claude Code / Kiro CLI

You can give prompts like this to a terminal-based agent:

```
Use playwright-cli skill to run the below test case and generate automation 
script file for the same.

TC-003: Cancel a single booking from the detail page.
Test data:
Username: sriramkukkadapu@gmail.com, Password: Test1234!
Preconditions: User is logged in "https://eventhub.rahulshettyacademy.com/login"
User has at least 1 confirmed booking

Steps:
1. Navigate to 'https://eventhub.rahulshettyacademy.com/bookings'
2. Click on cancel booking
3. Click on confirm in dialog box "Yes, Cancel it"
4. Observe redirect and bookings list.

Expected result: Booking should be cancelled successfully and cancelled booking 
should no longer appear in the list.
```

### Watch Execution in Real-Time

```bash
# See what the agent is doing in the browser
npx playwright-cli show
```

### Key Takeaway

- **Playwright CLI** = best for coding agents in terminals (Claude Code, Copilot CLI, Kiro CLI) — low token cost, fast
- **Playwright MCP** = best for IDE-integrated agents that need live browser context — richer but more expensive

---

## Trace Viewer

Trace viewer helps to debug tests **step by step**. It records a full timeline of everything that happened — DOM snapshots, network calls, console messages, and screenshots.

**Run test with trace:**

```bash
npx playwright test --trace on
```

**Then open the trace:**

```bash
npx playwright show-trace
```

This opens the Trace Viewer in the browser where you can:
- See a timeline of all actions
- Inspect DOM snapshots before/after each action
- View network requests and responses
- Check console messages
- See screenshots at each step

> Helps in debugging test failures!

**Configure in config:**

```javascript
const config = ({
  use: {
    trace: 'on',                  // Always record
    // trace: 'retain-on-failure', // Only keep if test fails
    // trace: 'on-first-retry',    // Record only on retry
  }
});
module.exports = config;
```

---

## Retry & Failures

Retry helps in handling flaky tests. When a test fails, Playwright can automatically re-run it.

**Config example:**

```javascript
const config = ({
  retries: 2,   // Retry failed tests up to 2 times
  use: {
    actionTimeout: 10000,       // Timeout for each action (click, fill, etc.) — 10s
    navigationTimeout: 30000,   // Timeout for page navigation — 30s
  }
});
module.exports = config;
```

**Key Points:**
- `retries: 2` — retry a failing test 2 more times before marking it failed
- `actionTimeout` — max time to wait for a single action (click, fill)
- `navigationTimeout` — max time to wait for `page.goto()` to complete
- Keep `retries` at top level, NOT inside `use`

---

## Environment Variables

Use a `.env` file for storing sensitive or environment-specific data. Keeps secrets out of your code.

**.env file:**

```
BASE_URL=https://example.com
USERNAME=admin
PASSWORD=admin123
```

**Access in config or tests using `process.env.VARIABLE_NAME`:**

```javascript
// In playwright.config.js
const config = ({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  }
});
module.exports = config;
```

```javascript
// In test file
test('login test', async ({ page }) => {
  await page.fill('#username', process.env.USERNAME);
  await page.fill('#password', process.env.PASSWORD);
});
```

**To load `.env` files automatically, install dotenv:**

```bash
npm install dotenv
```

Then in your config:

```javascript
require('dotenv').config();
```

Or pass variables directly in the command:

```bash
BASE_URL=https://staging.myapp.com npx playwright test
```

---

## Global Setup

Global setup runs **once before all tests** start. Useful for tasks like seeding a database, creating auth tokens, or any one-time setup.

**Create a global-setup file:**

```typescript
// global-setup.ts
export default async function globalSetup() {
  console.log('Running global setup...');
  // Example: Login and save auth state
  // Example: Seed test database
  // Example: Start a mock server
}
```

**Register it in playwright.config.ts:**

```javascript
// playwright.config.js
const config = ({
  globalSetup: 'path/to/global-setup.ts',
  // ...rest of config
});
module.exports = config;
```

**Common use cases:**
- Authenticate once and save `storageState` for all tests to reuse
- Set up test data via API before the suite runs
- Start external services or mock servers

**There's also `globalTeardown`** — runs once after all tests finish:

```javascript
const config = ({
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
});
```

---

## Best Practices

Follow these to write reliable, maintainable Playwright tests:

1. **Use meaningful test names** — describe what the test verifies, not how
2. **Follow Page Object Model** — separate locators and actions from test logic
3. **Keep tests independent** — no test should depend on another test's outcome or order
4. **Avoid hard waits** — never use `page.waitForTimeout()`; rely on auto-waiting and assertions
5. **Use assertions properly** — always verify expected outcomes; a passing test without assertions proves nothing
6. **Maintain test data separately** — use JSON files, fixtures, or API setup; don't hardcode data in tests
7. **Use proper locators** — prefer `getByRole()`, `getByText()`, `getByTestId()` over fragile CSS/XPath
8. **Clean up after tests** — delete created data, close connections
9. **Run tests in parallel** — design for isolation so tests can run concurrently
10. **Keep tests fast** — use API for setup, block unnecessary resources, reuse auth state

> Good practices → Reliable Tests.

---

## Useful Links

| Resource | URL |
|----------|-----|
| Official Docs | [https://playwright.dev/](https://playwright.dev/) |
| GitHub Repo | [https://github.com/microsoft/playwright](https://github.com/microsoft/playwright) |
| Playwright API Reference | [https://playwright.dev/docs/api/class-playwright](https://playwright.dev/docs/api/class-playwright) |
| Locators Guide | [https://playwright.dev/docs/locators](https://playwright.dev/docs/locators) |
| Auto-Waiting | [https://playwright.dev/docs/actionability](https://playwright.dev/docs/actionability) |
| Trace Viewer | [https://playwright.dev/docs/trace-viewer](https://playwright.dev/docs/trace-viewer) |

---

## VS Code Extension

The **Playwright Test for VSCode** extension provides:
- A dedicated test panel in VS Code showing all tests
- Run/debug tests directly from the editor
- Click-to-run individual tests
- Integrated trace viewer and report

Install from VS Code Extensions marketplace: search "Playwright Test for VSCode"

---

## Quick Reference — Debug Commands

| Command | What it does |
|---------|-------------|
| `npx playwright test --debug` | Run in debug mode (headed + Inspector) |
| `npx playwright codegen <URL>` | Auto-generate test script by recording |
| `npx playwright test --ui` | Open interactive UI test runner |
| `npx playwright show-report` | View HTML test report |
| `npx playwright show-trace trace.zip` | Open Trace Viewer for a specific trace |
| `await page.pause()` | Pause execution and open Inspector mid-test |

---

*Happy Testing! "Automate Smarter, Not Harder!"*


---

## JavaScript for Playwright — Cheat Sheet & Quick Notes

> Learn less JavaScript — learn the JavaScript that actually helps you write better Playwright code.

**Topics Covered:** Variables, Data Types, Functions, Arrays, Loops, Async/Await, Destructuring, Modules, Error Handling

---

### 01. Variables

Start with `const`. Use `let` when the value changes.

| Keyword | Scope | Reassign? | Notes |
|---------|-------|-----------|-------|
| `var` | Function scoped | Yes | Avoid in modern code |
| `let` | Block scoped | Yes | Can be reassigned |
| `const` | Block scoped | No | Cannot be reassigned |

```javascript
const browser = "chromium";
let retryCount = 0;
retryCount++;
```

**How this helps in Playwright:**
Use `const` for stable locators, page references, and test data.

---

### 02. Data Types

Know your data before you validate it.

| Type | Example |
|------|---------|
| String | `"Hello"` |
| Number | `123` |
| Boolean | `true` / `false` |
| Null | `null` |
| Undefined | `undefined` |
| Object | `{ id: 1 }` |
| Array | `[1, 2, 3]` |

```javascript
let str = "Hello";          // string
let num = 123;              // number
let ok = true;              // boolean
const user = { id: 1 };    // object
const items = [1, 2, 3];   // array
```

**How this helps in Playwright:**
UI values are often strings; API/calculated values may be numbers. Know what you're comparing.

---

### 03. Functions

Write once. Reuse everywhere.

- Functions reduce duplicate code
- Parameters make helpers reusable
- Return values let helpers send data back

```javascript
function login(username, password) {
  // reusable Playwright action
}

login("admin", "admin123");
```

**How this helps in Playwright:**
Create reusable login, navigation, and validation helpers.

---

### 04. Arrays

Store lists and process them efficiently.

- `push()`, `pop()`, `forEach()`, `map()`
- `filter()`, `find()`, `includes()`
- Arrays are perfect for collections of test data or UI items

```javascript
const browsers = ["Chrome", "Firefox", "Edge"];
browsers.includes("Edge"); // true
```

**How this helps in Playwright:**
Validate menus, tables, search results, and API collections with arrays.

---

### 05. Loops

Repeat smarter, not harder.

| Loop | Use Case |
|------|----------|
| `for` | When you need the index |
| `for...of` | When you need the value |
| `forEach()` | Process every item |
| `break` | Stop / continue → Skip |

```javascript
for (const menu of menus) {
  await expect(page.locator(menu)).toBeVisible();
}
```

**How this helps in Playwright:**
Loops eliminate repeated Playwright assertions.

---

### 06. Async / Await

The JavaScript concept you will see **everywhere** in Playwright.

- `async` allows `await`
- `await` waits for asynchronous operations
- Missing `await` can create confusing or flaky failures

```javascript
async function login(page) {
  await page.fill("#username", "admin");
  await page.click("#loginBtn");
}
```

**How this helps in Playwright:**
Await browser actions for predictable executions. Every Playwright action returns a Promise — always `await` it.

---

### 07. Destructuring & Spread

Less repetition. More readable test data.

- **Destructuring:** Extracts values cleanly
- **Spread:** Copies or merges arrays and objects

```javascript
const user = { name: "Ravi", age: 28 };
const { name, age } = user;

const updated = { ...user, role: "Admin" };
```

**How this helps in Playwright:**
Keep test data readable and create modified payloads without mutation.

---

### 08. Modules

Build a framework from small reusable files.

- Named export → import with `{ }`
- Default export → import without `{ }`
- Use modules for Page Objects, helpers, fixtures, and data

```javascript
// auth.js
export function login() { ... }

// test.spec.js
import { login } from "./auth.js";
```

**How this helps in Playwright:**
Organize Page Objects, helpers, fixtures, and data into separate modules.

---

### 09. Error Handling

Handle failures intentionally.

| Keyword | Purpose |
|---------|---------|
| `try` | Risky code |
| `catch` | Handle or log the error |
| `finally` | Cleanup (always runs) |
| `throw new Error()` | Create meaningful custom error |

```javascript
try {
  await page.click("#login");
} catch (error) {
  console.error(error.message);
} finally {
  console.log("Cleanup");
}
```

**How this helps in Playwright:**
Use meaningful errors and cleanup, but don't swallow real test failures.

---

### 10. Practical Playwright Pattern

Combine the fundamentals:

- Use **objects** for test data
- Use **functions** for reusable actions
- Use **await** for browser actions
- Use **modules** to organize the framework

```javascript
async function login(page, user) {
  const { username, password } = user;
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click("#loginBtn");
}
```

**How this helps in Playwright:**
These fundamentals combine into cleaner, maintainable Playwright code.

---

### Quick Reference Checklist

Use this while writing Playwright tests:

- [x] `const` by default
- [x] Functions for reusable behavior
- [x] Objects for related data
- [x] Arrays for collections
- [x] Loops for repetition
- [x] Always `await` async Playwright actions
- [x] Destructuring for cleaner data
- [x] Spread to copy/merge
- [x] Modules for scalable structure
- [x] `try/catch/finally` for intentional error handling

> **Practice. Automate. Improve. Repeat.**

---

## 19. Playwright Interview Q&A — Real-World Answers (4+ Years Experience)

> Source: personal interview prep notes (framed as answers you'd actually give in an interview, not just definitions).

### 19.1 Framework & Design

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

### 19.2 API + UI Integration

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

### 19.3 Advanced Locators & Selectors

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

### 19.4 Synchronization

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

### 19.5 Parallel Execution & Performance

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

### 19.6 Network Handling

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

### 19.7 Authentication & Session

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

### 19.8 CI/CD

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

### 19.9 Debugging & Stability

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

### 19.10 Cross-Browser & Mobile

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

### 19.11 File Handling

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

### 19.12 Advanced Scenarios

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

### 19.13 Real-Time Scenarios

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

### 19.14 Coding-Based Questions

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

### 19.15 High-Value Interview Follow-Up Questions

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

### 19.16 A Concise Interview Strategy

For a 4+ year interview, don't answer only with definitions. A strong pattern is:

> **Concept → Why → Implementation → Real project example → Trade-off**

Example, for `storageState`:

> "`storageState` stores browser authentication state such as cookies and local storage. I use it to avoid repeating UI login in every test. In my framework, a setup project authenticates the user once and generates an auth state file. Tests consume that state through `use.storageState`. For multi-user scenarios, I maintain separate states or create separate browser contexts. The main consideration is that authentication state is sensitive, so it should not be committed to source control."

> That style demonstrates hands-on framework experience, rather than simply knowing Playwright syntax.
