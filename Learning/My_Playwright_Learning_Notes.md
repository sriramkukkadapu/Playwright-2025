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

## 4. Fixtures

Fixtures are Playwright's dependency injection system. They provide pre-configured objects to your tests automatically.

### Built-in Fixtures

| Fixture | Description |
|---------|-------------|
| `page` | A `Page` object representing a single browser tab, ready for interaction |
| `context` | A `BrowserContext` — acts like an isolated incognito session |
| `browser` | A `Browser` instance (Chromium, Firefox, or WebKit) |
| `request` | An `APIRequestContext` for making direct HTTP calls (API testing or fast setup) |
| `browserName` | A string indicating which browser is currently running |

### Custom Fixtures

You can create custom fixtures by extending the default Playwright test:

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

**Using the custom fixture in a test file:**

```typescript
// tests/25TestDataFromFixture.spec.js
import { expect } from '@playwright/test';
import { test as testWithFixture } from './utils/test-base';

testWithFixture('End to end journey with Special locators', async ({ page, testDataForLogin }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  await page.getByPlaceholder("email@example.com").fill(testDataForLogin.email);
  await page.getByPlaceholder("enter your passsword").fill(testDataForLogin.password);
  await page.getByRole("button", { name: "Login" }).click();
  console.log(await page.title());
});
```

**Key points:**
- Import `test` from your custom fixture file (not from `@playwright/test`)
- The fixture name (`testDataForLogin`) becomes available as a parameter in your test function
- Playwright injects it automatically — no manual setup needed

**Real-world use case:** Perform login before every test using a fixture so you don't repeat login steps in every test file.

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
