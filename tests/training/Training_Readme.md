# Playwright Automation Training — Complete Notes
**Course:** QA Masters Playwright SDET Training  
**Source:** https://qamasters-playwright-sdet-training.netlify.app  
**Duration:** 12 Weeks | JS + TypeScript | From Zero to SDET-Ready

---

## 📁 Training Files Index

| File | Week | Topics |
|------|------|--------|
| `W1_JavaScript_Foundations.spec.js`   | Week 1  | Variables, Data Types, Conditionals, Loops, Arrays |
| `W2_ES6_Async_Programming.spec.js`    | Week 2  | Arrow Functions, Destructuring, Spread/Rest, Promises, Async/Await, Classes |
| `W3_TypeScript_Essentials.spec.js`    | Week 3  | Types, Interfaces, Enums, Generics, Access Modifiers, Design Patterns |
| `W4_Playwright_Setup_Architecture.spec.js` | Week 4 | Browser/Context/Page, Config, Fixtures, Hooks |
| `W5_Locators_Element_Commands.spec.js` | Week 5 | CSS, XPath, Role, Text, Filter, Chain, Auto-wait |
| `W6_Forms_Tables_Waits.spec.js`       | Week 6  | Checkboxes, Dropdowns, Tables, Waits, Alerts, File Upload |
| `W7_Actions_Browser_Contexts.spec.js` | Week 7  | Mouse, Keyboard, Drag-Drop, Scroll, Multi-tab, Cookies, LocalStorage |
| `W8_Complex_UI_Scenarios.spec.js`     | Week 8  | iFrames, Shadow DOM, Calendars, AJAX, Network, Trace, Debug |
| `W9_API_Testing.spec.js`              | Week 9  | GET, POST, PUT, DELETE, Mock, Auth, Hybrid |
| `W10_Framework_Design_BDD.spec.js`    | Week 10 | POM, Data-driven, Fixtures, BDD/Cucumber concepts |
| `W11_E2E_Live_Project.spec.js`        | Week 11 | Full e-commerce automation project |
| `W12_CICD_Docker_Cloud.spec.js`       | Week 12 | GitHub Actions, Jenkins, Docker, BrowserStack |

---

## 🚀 Quick Start

```bash
# Run all training tests
npx playwright test tests/training/

# Run specific week
npx playwright test tests/training/W1

# Run with UI (headed)
npx playwright test tests/training/W1 --headed

# Run with debug mode
npx playwright test tests/training/W1 --debug

# View HTML report
npx playwright show-report
```

---

## WEEK 1 — JavaScript Foundations

### Variables
```js
var oldStyle  = 'function scoped, avoid';  // ❌ old way
let mutable   = 'block scoped, reassignable'; // ✅ 
const fixed   = 'block scoped, constant';     // ✅ prefer const
```
> **Rule:** Always use `const` by default. Use `let` only when you need to reassign. Never use `var`.

### Data Types
| Type | Example | typeof |
|------|---------|--------|
| String | `'hello'` | `"string"` |
| Number | `42`, `3.14` | `"number"` |
| Boolean | `true`, `false` | `"boolean"` |
| null | `null` | `"object"` (JS quirk) |
| undefined | `undefined` | `"undefined"` |
| Array | `[1,2,3]` | `"object"` |
| Object | `{key: val}` | `"object"` |

> **Key:** Use `===` (strict equality) not `==` (loose equality). `5 == '5'` is `true` but `5 === '5'` is `false`.

### Loops
```js
// for loop
for (let i = 0; i < 5; i++) { }

// forEach (no break/continue)
arr.forEach(item => console.log(item));

// for...of (preferred for arrays, supports break)
for (const item of arr) { }

// for...in (for objects)
for (const key in obj) { }
```

### Array Methods (Most Used in Tests)
```js
arr.find(x => x > 5)           // first match
arr.filter(x => x > 5)         // all matches
arr.map(x => x * 2)            // transform
arr.includes(5)                 // check existence
arr.some(x => x > 5)           // any match?
arr.every(x => x > 0)          // all match?
arr.reduce((acc, x) => acc + x, 0)  // accumulate
```

---

## WEEK 2 — ES6+ & Async Programming

### Arrow Functions
```js
// Traditional
function add(a, b) { return a + b; }

// Arrow (implicit return for single expression)
const add = (a, b) => a + b;

// Arrow with body
const add = (a, b) => {
    const result = a + b;
    return result;
};
```

### Destructuring (Used heavily in Playwright)
```js
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age } = user;

// Rename
const { name: userName } = user;

// Default values
const { role = 'admin' } = user;
```

### Spread & Rest
```js
// Spread — expand array/object
const merged = [...arr1, ...arr2];
const updated = { ...defaults, ...overrides };

// Rest — collect remaining
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
```

### Async/Await (Core of Playwright)
```js
// Every Playwright action is async — ALWAYS await it
test('example', async ({ page }) => {
    await page.goto('https://example.com');    // ✅
    page.goto('https://example.com');          // ❌ won't wait!
});

// Error handling
try {
    await page.goto(url, { timeout: 5000 });
} catch (error) {
    console.log('Failed:', error.message);
}
```

> **Common Mistake:** Forgetting `await` on Playwright actions is the #1 cause of flaky tests.

---

## WEEK 3 — TypeScript Essentials

### Basic Types in TypeScript
```typescript
let name: string = 'Sriram';
let age: number = 30;
let active: boolean = true;
let scores: number[] = [90, 85];
let tuple: [string, number] = ['Alice', 25];
let anything: any = 'skip type checking';  // ❌ avoid
```

### Interfaces
```typescript
interface User {
    id: number;
    name: string;
    email?: string;  // optional with ?
    readonly createdAt: Date;  // can't be modified
}
```

### Enums
```typescript
enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }
enum Priority { Low = 1, Medium = 2, High = 3 }

const ticket = { status: Status.Active, priority: Priority.High };
```

### Design Patterns Used in Test Automation

**Singleton** — one shared instance (e.g., config, database connection)
```js
class Config {
    constructor() {
        if (Config._instance) return Config._instance;
        this.baseUrl = process.env.BASE_URL;
        Config._instance = this;
    }
}
```

**Builder** — construct test data step by step
```js
const user = new UserBuilder()
    .setName('Test User')
    .setEmail('test@test.com')
    .setRole('admin')
    .build();
```

**Page Object Model** — encapsulate page interactions (Week 10)

---

## WEEK 4 — Playwright Setup & Architecture

### Core Architecture
```
Browser (Chrome/Firefox/Safari)
  └── BrowserContext (like incognito — isolated session)
       └── Page (single tab)
```

> **Key Insight:** Each test gets its own `BrowserContext` by default — this is why Playwright tests are isolated without any extra setup.

### playwright.config.js Key Settings
```js
export default defineConfig({
    testDir:       './tests',
    timeout:       30 * 1000,       // 30s per test
    retries:       process.env.CI ? 2 : 0,
    workers:       process.env.CI ? 4 : undefined,
    fullyParallel: true,

    use: {
        baseURL:    'https://your-app.com',
        headless:   true,
        screenshot: 'only-on-failure',
        video:      'retain-on-failure',
        trace:      'on-first-retry'
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    ]
});
```

### Fixtures
```js
// Built-in fixtures
test('example', async ({ page, browser, context, browserName }) => {});

// Custom fixtures
export const test = base.extend({
    loginPage: async ({ page }, use) => {
        const lp = new LoginPage(page);
        await lp.goto();
        await use(lp);  // provide to test
        // cleanup after test (if needed)
    }
});
```

### Test Hooks Order
```
beforeAll → [beforeEach → test → afterEach] × n → afterAll
```

---

## WEEK 5 — Locators & Element Commands

### Locator Priority (Best to Worst)
| Priority | Strategy | Example |
|----------|----------|---------|
| 1st ✅ | Role-based | `getByRole('button', { name: 'Submit' })` |
| 2nd ✅ | Placeholder | `getByPlaceholder('Email')` |
| 3rd ✅ | Text | `getByText('Login')` |
| 4th ✅ | Label | `getByLabel('Username')` |
| 5th ⚠️ | CSS ID/Class | `locator('#username')` |
| 6th ⚠️ | XPath | `locator('//input[@id="user"]')` |
| Last ❌ | Index | `locator('input').nth(0)` |

### Locator Chaining
```js
// Find element INSIDE another element
const zaraCard = page.locator('.card').filter({ hasText: 'ZARA' });
const addBtn   = zaraCard.locator('button', { hasText: 'Add' });
```

### Auto-waiting
Playwright automatically waits for elements to be:
- ✅ Attached to DOM
- ✅ Visible
- ✅ Stable (not animating)
- ✅ Enabled
- ✅ Editable (for fill)

```js
// NO need for explicit waits in most cases!
await page.locator('#btn').click(); // auto-waits until clickable
```

---

## WEEK 6 — Forms, Tables & Waits

### Dropdown Handling
```js
// HTML <select> element
await page.locator('select').selectOption('value');           // by value
await page.locator('select').selectOption({ label: 'Text' }); // by label
await page.locator('select').selectOption({ index: 2 });      // by index

// Custom dropdown (non-select)
await page.locator('.dropdown-toggle').click();
await page.locator('.dropdown-menu li', { hasText: 'Option' }).click();
```

### Wait Strategies
```js
// ✅ Best — wait for specific state
await element.waitFor({ state: 'visible' });
await element.waitFor({ state: 'hidden' });
await element.waitFor({ state: 'attached' });

// ✅ URL wait
await page.waitForURL('**/dashboard');
await page.waitForURL(/dashboard/);

// ✅ Network wait
await page.waitForLoadState('networkidle');

// ❌ Avoid — time-based waits are flaky
await page.waitForTimeout(2000);
```

### Dialog Handling
```js
// Must register handler BEFORE action that triggers dialog
page.once('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept();   // OK button
    // await dialog.dismiss(); // Cancel button
});
await page.locator('#alertBtn').click();
```

---

## WEEK 7 — Actions & Browser Contexts

### Mouse Actions
```js
await element.hover();            // mouse over
await element.click();            // left click
await element.dblclick();         // double click
await element.click({ button: 'right' }); // right click
await element.dragTo(target);     // drag and drop
```

### Keyboard Actions
```js
await element.fill('text');            // fast fill (no key events)
await element.pressSequentially('text', { delay: 50 }); // char by char
await element.press('Enter');
await element.press('Control+a');
await page.keyboard.press('Tab');
```

### Multi-tab Handling
```js
// Wait for new tab BEFORE the action that opens it
const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[target="_blank"]').click()
]);
await newPage.waitForLoadState();
console.log(newPage.url());
```

### Auth State (Skip Login)
```js
// Save auth state after first login
await context.storageState({ path: '.auth/user.json' });

// Reuse in subsequent tests
const context = await browser.newContext({
    storageState: '.auth/user.json'
});
```

---

## WEEK 8 — Complex UI Scenarios

### iFrame Handling
```js
// Method 1: frameLocator (recommended)
const iframe = page.frameLocator('#my-iframe');
await iframe.locator('button').click();

// Method 2: frame object
const frame = page.frame('frame-name');
await frame.locator('button').click();
```

### Network Interception
```js
// Mock API response
await page.route('**/api/users', async route => {
    await route.fulfill({
        status: 200,
        body: JSON.stringify({ users: [] })
    });
});

// Block resources (speed up tests)
await page.route('**/*.{png,jpg,css,font}', route => route.abort());

// Monitor requests
page.on('request',  req  => console.log(req.url()));
page.on('response', resp => console.log(resp.status()));
```

### Trace Viewer
```bash
# Record trace
PLAYWRIGHT_TRACE=on npx playwright test

# View trace
npx playwright show-trace test-results/trace.zip
```

---

## WEEK 9 — API Testing

### API Request Context
```js
// Option 1: Use request fixture in test
test('api test', async ({ request }) => {
    const response = await request.get('/api/users');
    expect(response.status()).toBe(200);
});

// Option 2: Create global API context
const apiContext = await request.newContext({
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: { Authorization: `Bearer ${token}` }
});
```

### Response Assertions
```js
expect(response.status()).toBe(200);
expect(response.ok()).toBe(true);          // status < 400
expect(response.headers()['content-type']).toContain('json');

const body = await response.json();
expect(body.users).toHaveLength(10);
expect(body.users[0]).toHaveProperty('email');
```

### API + UI Hybrid Pattern
```js
test('hybrid', async ({ page, request }) => {
    // 1. Setup via API (fast)
    const token = await loginViaApi(request);

    // 2. Inject token in browser
    await page.evaluate(token => localStorage.setItem('token', token), token);

    // 3. Navigate directly to protected page (skip UI login)
    await page.goto('/dashboard');

    // 4. Verify in UI
    await expect(page.locator('.products')).toBeVisible();
});
```

---

## WEEK 10 — Framework Design + BDD

### POM Structure
```
tests/
  pageObjects/
    BasePage.js          ← shared methods (navigate, waitFor, etc.)
    LoginPage.js         ← login page locators + actions
    DashboardPage.js     ← dashboard locators + actions
    POManager.js         ← factory for all pages
  fixtures/
    customFixtures.js    ← extend base test with pages
  data/
    testData.json        ← test data
  specs/
    login.spec.js        ← test files use pages, not locators
```

### POM Best Practices
```js
class LoginPage {
    constructor(page) {
        this.page     = page;
        // ✅ Define all locators in constructor
        this.email    = page.getByPlaceholder('email@example.com');
        this.password = page.getByPlaceholder('enter your passsword');
        this.loginBtn = page.getByRole('button', { name: 'Login' });
    }

    async goto() {
        await this.page.goto('/client');
    }

    async login(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}
```

### Cucumber BDD Gherkin
```gherkin
Feature: User Login
  
  @smoke @critical
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    And I click Login
    Then I should see the dashboard
    And "ZARA COAT 3" should be visible
  
  @negative
  Scenario Outline: Invalid login attempts
    When I login with "<email>" and "<password>"
    Then I should see error "<message>"
    
    Examples:
      | email          | password  | message              |
      | wrong@test.com | WrongPass | Incorrect email       |
      |                | Test1234! | Email is required     |
```

---

## WEEK 11 — Live Project

### E-Commerce Project Structure
```
ecommerce-tests/
  pageObjects/
    LoginPage.js
    DashboardPage.js
    CartPage.js
    CheckoutPage.js
    OrdersPage.js
    POManager.js
  fixtures/
    authFixture.js     ← pre-login fixture
  data/
    users.json         ← test users
    products.json      ← test products
  tests/
    smoke/
      login.spec.js
      products.spec.js
    e2e/
      purchaseFlow.spec.js
      orderHistory.spec.js
    api/
      ordersApi.spec.js
  playwright.config.js
  .env                 ← TEST_EMAIL, TEST_PASS (gitignored)
```

### Test Data Management
```js
// External JSON
import testData from '../data/users.json';
const { email, password } = testData.validUser;

// Environment variables (CI-friendly)
const email = process.env.TEST_EMAIL || 'default@test.com';

// Builder pattern for complex data
const order = new OrderBuilder()
    .setProduct('ZARA COAT 3')
    .setCountry('India')
    .setQuantity(1)
    .build();
```

---

## WEEK 12 — CI/CD, Docker & Cloud

### GitHub Actions Quick Setup
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report
          path: playwright-report/
```

### Docker Quick Setup
```dockerfile
FROM mcr.microsoft.com/playwright:v1.51.1-noble
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "playwright", "test"]
```

```bash
docker build -t my-tests .
docker run --rm -v $(pwd)/reports:/app/playwright-report my-tests
```

### BrowserStack Integration
```js
// browserstack.config.js
module.exports = {
    src: ['tests/**/*.spec.js'],
    capabilities: [{
        browser: 'chrome',
        os: 'Windows', os_version: '11',
        name: 'E2E Tests'
    }],
    username:  process.env.BS_USERNAME,
    accessKey: process.env.BS_ACCESS_KEY
};
```

---

## 📝 Common Playwright Assertions

```js
// URL
await expect(page).toHaveURL('https://example.com/dashboard');
await expect(page).toHaveURL(/dashboard/);

// Title
await expect(page).toHaveTitle('My App');
await expect(page).toHaveTitle(/My App/);

// Element visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();
await expect(element).toBeAttached();

// Element state
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();
await expect(element).not.toBeChecked();

// Text
await expect(element).toHaveText('Exact text');
await expect(element).toHaveText(/partial/);
await expect(element).toContainText('substring');

// Value (inputs)
await expect(input).toHaveValue('expected value');

// Count
await expect(page.locator('.item')).toHaveCount(5);

// Attribute
await expect(element).toHaveAttribute('href', '/home');
await expect(element).toHaveClass(/active/);
```

---

## ⚠️ Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Forgetting `await` | Always `await` every Playwright action |
| Using `waitForTimeout` | Use `waitFor()`, `waitForURL()`, `waitForLoadState()` |
| Using `==` instead of `===` | Always use strict equality |
| Hardcoded credentials | Use environment variables |
| Brittle selectors (index, XPath) | Prefer `getByRole`, `getByPlaceholder` |
| No test isolation | Each test should be independent |
| Missing `await context.close()` | Always await close calls |
| Test data in test files | Keep data in JSON files or env vars |
| Ignoring flaky tests | Fix root cause, don't just retry |
| No error messages in assertions | Add `expect(x, 'Error message').toBe(y)` |

---

## 🎯 Interview Preparation

### Most Asked Playwright Questions

1. **What is the difference between Browser, Context and Page?**
   - Browser = browser process, Context = isolated session (own cookies), Page = single tab

2. **How does Playwright auto-waiting work?**
   - Playwright waits for element to be attached, visible, stable, enabled before acting

3. **How do you handle iFrames?**
   - `page.frameLocator('#id').locator('selector')` or `page.frame('name')`

4. **How do you run tests in parallel?**
   - `fullyParallel: true` in config, each test gets its own context automatically

5. **What is a fixture in Playwright?**
   - A function that sets up and tears down test resources (page objects, auth state, etc.)

6. **How do you handle authentication in tests?**
   - Login once, save with `context.storageState()`, reuse with `storageState: '.auth/file.json'`

7. **How do you mock an API in Playwright?**
   - `page.route('**/api/endpoint', route => route.fulfill({ body: mockData }))`

8. **What is POM and why use it?**
   - Page Object Model: separate locators/actions from test logic for reusability and maintainability

9. **How do you handle dynamic elements?**
   - `element.waitFor({ state: 'visible' })` or `page.waitForSelector()`

10. **How do you set up CI/CD for Playwright?**
    - GitHub Actions with Node setup, browser install step, test run, artifact upload

---

## 📚 Resources

- [Playwright Official Docs](https://playwright.dev/docs/intro)
- [QA Masters Training](https://qamasters-playwright-sdet-training.netlify.app)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

---

*Notes created from QA Masters Playwright SDET Training Syllabus*  
*Training files location: `tests/training/`*
