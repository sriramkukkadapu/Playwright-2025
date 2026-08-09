# Playwright Automation Interview Questions & Answers

## 3 Rounds | Coding + Managerial

If you're preparing for a QA Automation / SDET / Playwright interview, this guide covers questions across Playwright, debugging, framework design, API mocking, Java coding, and real-world QA scenarios.

Playwright preparation should go beyond basic locators — topics like fixtures, network interception, POM, parallel execution, and CI/CD are equally important.

---

## ROUND 1 — Playwright Technical (20–30 Mins)

---

### 1. Introduction / Tell me about yourself

**Sample Answer:**

"I'm a QA Automation Engineer with X years of experience in test automation. I specialize in building end-to-end test frameworks using Playwright with TypeScript. In my current role, I design and maintain automation frameworks covering UI, API, and accessibility testing.

My day-to-day work involves:
- Writing and maintaining Playwright test suites for web applications
- Implementing Page Object Model patterns for scalability
- Setting up CI/CD pipelines with parallel test execution
- Collaborating with developers on testability and shift-left testing

I chose Playwright because of its auto-wait capabilities, multi-browser support, and excellent debugging tools like Trace Viewer."

**Tips:**
- Keep it concise (60–90 seconds)
- Highlight relevant tools: Playwright, TypeScript/JavaScript, CI/CD, API testing
- Mention a measurable achievement (e.g., "Reduced test execution time by 60%")
- Tailor to the role's requirements

---

### 2. How do you capture network requests & responses in Playwright?

**Answer:**

Playwright provides built-in network interception via `page.on('request')` and `page.on('response')` events, plus the `page.route()` API for more control.

**Capturing all requests and responses:**

```typescript
import { test, expect } from '@playwright/test';

test('capture network traffic', async ({ page }) => {
  const requests: string[] = [];
  const responses: { url: string; status: number }[] = [];

  // Listen to all requests
  page.on('request', (request) => {
    requests.push(`${request.method()} ${request.url()}`);
  });

  // Listen to all responses
  page.on('response', (response) => {
    responses.push({ url: response.url(), status: response.status() });
  });

  await page.goto('https://example.com');

  console.log('Requests:', requests);
  console.log('Responses:', responses);
});
```

**Waiting for a specific network request:**

```typescript
test('wait for specific API call', async ({ page }) => {
  // Wait for a specific API response
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes('/api/users') && response.status() === 200
  );

  await page.click('#load-users');
  const response = await responsePromise;
  const data = await response.json();

  expect(data.users).toHaveLength(10);
});
```

**Capturing request/response bodies:**

```typescript
test('capture request body', async ({ page }) => {
  page.on('request', (request) => {
    if (request.url().includes('/api/submit')) {
      console.log('Request body:', request.postData());
      console.log('Headers:', request.headers());
    }
  });

  page.on('response', async (response) => {
    if (response.url().includes('/api/submit')) {
      const body = await response.json();
      console.log('Response body:', body);
    }
  });

  await page.goto('https://example.com/form');
  await page.fill('#name', 'John');
  await page.click('#submit');
});
```

**Key Points:**
- `page.on('request')` fires for every outgoing request
- `page.on('response')` fires for every received response
- `page.waitForResponse()` is useful for asserting on specific API calls
- You can filter by URL, method, status code, or content type
- HAR file recording is also available via `page.routeFromHAR()` for replay

---

### 3. How can you mock API responses using Playwright?

**Answer:**

Playwright's `page.route()` intercepts network requests and allows you to fulfill them with mock data, modify them, or abort them entirely.

**Basic API mocking:**

```typescript
test('mock API response', async ({ page }) => {
  // Intercept the API call and return mock data
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
      }),
    });
  });

  await page.goto('https://example.com/users');
  await expect(page.locator('.user-card')).toHaveCount(2);
});
```

**Mocking error responses:**

```typescript
test('mock 500 error', async ({ page }) => {
  await page.route('**/api/data', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  await page.goto('https://example.com');
  await expect(page.locator('.error-message')).toBeVisible();
});
```

**Modifying the actual response (partial mock):**

```typescript
test('modify real API response', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    // Fetch the real response
    const response = await route.fetch();
    const json = await response.json();

    // Modify it
    json.products[0].price = 0;

    await route.fulfill({
      response,
      body: JSON.stringify(json),
    });
  });

  await page.goto('https://example.com/products');
});
```

**Aborting requests (e.g., block analytics):**

```typescript
test('block third-party scripts', async ({ page }) => {
  await page.route('**/*google-analytics*/**', (route) => route.abort());
  await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort()); // Block images

  await page.goto('https://example.com');
});
```

**Using HAR files for mocking:**

```typescript
test('mock from HAR file', async ({ page }) => {
  // Route requests using a recorded HAR file
  await page.routeFromHAR('tests/mocks/api.har', {
    url: '**/api/**',
    update: false, // Set to true to record new responses
  });

  await page.goto('https://example.com');
});
```

**Key Points:**
- `page.route()` uses glob or regex patterns for URL matching
- `route.fulfill()` returns a custom response without hitting the server
- `route.fetch()` + `route.fulfill()` lets you modify real responses
- `route.abort()` blocks requests entirely
- `route.continue()` lets the request proceed (optionally with modified headers)
- Mocks are scoped to the page; use `browserContext.route()` for context-wide mocks

---

### 4. How do you take screenshots & videos in Playwright?

**Answer:**

Playwright supports screenshots (full page, element-level, clipped) and video recording out of the box.

**Screenshots:**

```typescript
// Full page screenshot
await page.screenshot({ path: 'screenshots/fullpage.png', fullPage: true });

// Viewport-only screenshot
await page.screenshot({ path: 'screenshots/viewport.png' });

// Element screenshot
const element = page.locator('.hero-banner');
await element.screenshot({ path: 'screenshots/banner.png' });

// Clipped area screenshot
await page.screenshot({
  path: 'screenshots/clipped.png',
  clip: { x: 0, y: 0, width: 300, height: 200 },
});
```

**Configure screenshots on failure (playwright.config.ts):**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure', // 'on', 'off', 'only-on-failure'
  },
});
```

**Video recording (playwright.config.ts):**

```typescript
export default defineConfig({
  use: {
    video: 'on-first-retry', // 'on', 'off', 'on-first-retry', 'retain-on-failure'
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
  },
});
```

**Accessing video in test:**

```typescript
test('record video', async ({ page }, testInfo) => {
  await page.goto('https://example.com');
  // ... perform actions

  // Video is automatically attached to test results
  // Access the video path after the test
  const video = page.video();
  if (video) {
    const path = await video.path();
    console.log('Video saved at:', path);
    // Attach to test report
    await testInfo.attach('video', { path, contentType: 'video/webm' });
  }
});
```

**Key Points:**
- Screenshots can be PNG or JPEG format
- `fullPage: true` captures the entire scrollable page, not just the viewport
- Videos are saved as `.webm` files
- `retain-on-failure` keeps videos only for failed tests (saves disk space)
- Screenshots/videos are automatically attached to HTML reports
- Use `testInfo.attach()` for custom attachments in reports

---

### 5. How do you handle authentication in Playwright?

**Answer:**

Playwright supports multiple authentication strategies. The recommended approach is to authenticate once and reuse the session state.

#### Basic Auth (HTTP Authentication):

```typescript
import { test } from '@playwright/test';

// Method 1: Via browser context
test('basic auth via context', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'password123',
    },
  });
  const page = await context.newPage();
  await page.goto('https://example.com/protected');
});

// Method 2: Via config
// playwright.config.ts
export default defineConfig({
  use: {
    httpCredentials: {
      username: 'admin',
      password: 'password123',
    },
  },
});
```

#### Token-based Authentication:

```typescript
// Save authenticated state to reuse across tests
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login via UI
  await page.goto('https://example.com/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password');
  await page.click('#login-button');

  // Wait for login to complete
  await page.waitForURL('**/dashboard');

  // Save storage state (cookies + localStorage)
  await page.context().storageState({ path: './auth/storageState.json' });
  await browser.close();
}

export default globalSetup;
```

```typescript
// playwright.config.ts — Reuse saved auth state
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    storageState: './auth/storageState.json',
  },
});
```

```typescript
// Inject token directly via API
test('token-based auth via API', async ({ page }) => {
  // Get token via API call
  const response = await page.request.post('https://api.example.com/auth/login', {
    data: { username: 'user', password: 'pass' },
  });
  const { token } = await response.json();

  // Set token in localStorage before navigating
  await page.addInitScript((token) => {
    localStorage.setItem('authToken', token);
  }, token);

  await page.goto('https://example.com/dashboard');
});
```

#### OAuth Authentication:

```typescript
// For OAuth flows, save the session state after manual/API login
test.describe('OAuth tests', () => {
  test.use({ storageState: './auth/oauth-state.json' });

  test('access protected resource', async ({ page }) => {
    await page.goto('https://example.com/protected');
    // Already authenticated via saved state
  });
});

// Setup OAuth state (run once)
async function setupOAuth() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://example.com/login');
  await page.click('#login-with-google');

  // Handle OAuth popup/redirect
  await page.fill('#email', 'user@gmail.com');
  await page.click('#next');
  await page.fill('#password', 'password');
  await page.click('#submit');

  // Wait for redirect back to app
  await page.waitForURL('**/dashboard');
  await context.storageState({ path: './auth/oauth-state.json' });
  await browser.close();
}
```

**Key Points:**
- `storageState` saves cookies and localStorage — the fastest way to reuse sessions
- Global setup runs once before all tests, reducing redundant logins
- For multi-role testing, create separate storage state files per role
- API-based login is faster than UI-based login for setup
- Use `test.use({ storageState: ... })` to scope auth to specific test files

---

### 6. How do you configure retries/test retries in Playwright?

**Answer:**

Playwright has built-in retry support at the configuration and test level.

**Global retry configuration (playwright.config.ts):**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2, // Retry failed tests up to 2 times

  // Different retries for CI vs local
  retries: process.env.CI ? 2 : 0,
});
```

**Per-project retries:**

```typescript
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      retries: 2,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      retries: 1,
    },
  ],
});
```

**Per-test retry:**

```typescript
test.describe('flaky suite', () => {
  test.describe.configure({ retries: 3 });

  test('network-dependent test', async ({ page }) => {
    // This test gets 3 retries
  });
});
```

**Detecting retries in test code:**

```typescript
test('retry-aware test', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    console.log(`Retry attempt: ${testInfo.retry}`);
    // Clear cache, reset state, etc.
  }

  await page.goto('https://example.com');
});
```

**CLI override:**

```bash
npx playwright test --retries=3
```

**Key Points:**
- Retries re-run the entire test including `beforeEach` hooks
- `testInfo.retry` gives the current retry count (0 = first run)
- Combine with `video: 'on-first-retry'` to capture video only on retries
- Retries apply to the worker, so each retry gets a fresh browser context
- In CI, retries help absorb transient infrastructure flakiness without hiding real bugs

---

---

## ROUND 2 — Advanced Playwright (30–45 Mins)

---

### 1. What strategies do you use to debug flaky Playwright tests?

**Answer:**

Flaky tests are tests that sometimes pass and sometimes fail without code changes. Here's a systematic approach to debugging them:

**1. Enable Trace Viewer:**

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Captures trace only on retry
  },
});
```

```bash
# View the trace after a failure
npx playwright show-trace trace.zip
```

**2. Use retries strategically to identify flaky tests:**

```bash
# Run test multiple times to confirm flakiness
npx playwright test --repeat-each=10 --reporter=list tests/flaky-test.spec.ts
```

**3. Common causes and solutions:**

| Cause | Solution |
|-------|----------|
| Timing issues | Use `await expect(locator).toBeVisible()` instead of hard waits |
| Race conditions | Use `page.waitForResponse()` or `page.waitForLoadState()` |
| Shared state between tests | Ensure test isolation with fresh contexts |
| Animation interference | Use `{ animations: 'disabled' }` in config |
| Network instability | Mock unreliable external APIs |
| Viewport differences | Set consistent viewport in config |

**4. Debug mode:**

```bash
# Run in headed mode with slow motion
npx playwright test --headed --debug

# Pause at a specific point in test
await page.pause(); // Opens Playwright Inspector
```

**5. Add verbose logging:**

```typescript
test('debugging test', async ({ page }) => {
  page.on('console', (msg) => console.log('BROWSER:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err.message));
  page.on('requestfailed', (req) => console.log('FAILED:', req.url()));
});
```

**6. Isolate the test:**

```bash
# Run only the flaky test in isolation
npx playwright test tests/specific-test.spec.ts --workers=1
```

**Key Principles:**
- Never use `page.waitForTimeout()` (hard waits) — use auto-waiting assertions
- Ensure each test is independent and doesn't depend on test execution order
- Mock external dependencies to eliminate network flakiness
- Use `test.describe.configure({ mode: 'serial' })` only when absolutely necessary

---

### 2. How do you optimize test execution speed?

**Answer:**

**1. Parallel execution (default in Playwright):**

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : undefined, // undefined = half of CPU cores
  fullyParallel: true, // Run tests in each file in parallel
});
```

**2. Reuse authentication state:**

```typescript
// Authenticate once, reuse across all tests
export default defineConfig({
  globalSetup: './global-setup.ts',
  use: {
    storageState: './auth/state.json',
  },
});
```

**3. Block unnecessary resources:**

```typescript
test.beforeEach(async ({ page }) => {
  await page.route('**/*.{png,jpg,gif,svg,woff,woff2}', (route) => route.abort());
  await page.route('**/analytics/**', (route) => route.abort());
});
```

**4. Use API for setup instead of UI:**

```typescript
test('create order test', async ({ page, request }) => {
  // Setup via API (fast) instead of clicking through UI
  const response = await request.post('/api/orders', {
    data: { product: 'Widget', quantity: 1 },
  });
  const { orderId } = await response.json();

  // Only use UI for what you're actually testing
  await page.goto(`/orders/${orderId}`);
  await expect(page.locator('.order-status')).toHaveText('Pending');
});
```

**5. Use test.step for logical grouping (not speed, but readability):**

```typescript
test('checkout flow', async ({ page }) => {
  await test.step('Add item to cart', async () => {
    await page.goto('/products');
    await page.click('.add-to-cart');
  });

  await test.step('Complete checkout', async () => {
    await page.goto('/checkout');
    await page.fill('#card', '4242424242424242');
    await page.click('#pay');
  });
});
```

**6. Smart test sharding for CI:**

```bash
# Split tests across CI machines
npx playwright test --shard=1/4  # Machine 1
npx playwright test --shard=2/4  # Machine 2
npx playwright test --shard=3/4  # Machine 3
npx playwright test --shard=4/4  # Machine 4
```

**7. Disable unnecessary features:**

```typescript
export default defineConfig({
  use: {
    video: 'off',         // Only enable when needed
    screenshot: 'off',    // Only on failure
    trace: 'off',         // Only on retry
  },
});
```

**Summary of speed gains:**
- Parallel execution: 3-4x faster with 4 workers
- Auth reuse: Saves 2-5 seconds per test
- Resource blocking: Saves 1-3 seconds per page load
- API setup: Saves 5-15 seconds per test that needs preconditions
- Sharding: Linear scaling across CI machines

---

### 3. How do you handle dynamic elements?

**Answer:**

Dynamic elements are those that appear/disappear, change content, or have non-deterministic attributes. Playwright handles these well due to its auto-waiting mechanism.

**1. Wait for element to appear:**

```typescript
// Playwright auto-waits, but you can be explicit
await expect(page.locator('.loading-spinner')).toBeHidden();
await expect(page.locator('.data-table')).toBeVisible();
```

**2. Dynamic IDs/attributes — use text or role locators:**

```typescript
// Bad: dynamic ID
await page.locator('#btn-abc123xyz'); // Changes every render

// Good: text-based
await page.getByRole('button', { name: 'Submit' });
await page.getByText('Submit Order');
await page.getByTestId('submit-button'); // data-testid is stable
```

**3. Waiting for dynamic content to load:**

```typescript
// Wait for network request to complete
await page.waitForResponse('**/api/data');

// Wait for specific condition
await expect(page.locator('.results')).toHaveCount(10);
await expect(page.locator('.price')).not.toHaveText('Loading...');
```

**4. Dynamic lists/tables:**

```typescript
// Wait until list has items
const items = page.locator('.list-item');
await expect(items).toHaveCount(5); // Waits until exactly 5 items

// First/last/nth
await items.first().click();
await items.nth(2).click();
await items.last().click();

// Filter by text
await items.filter({ hasText: 'Premium' }).click();
```

**5. Elements that appear after animations:**

```typescript
// Disable animations globally
export default defineConfig({
  use: {
    // Reduce motion for consistency
  },
});

// Or wait for animation to complete
await page.locator('.modal').waitFor({ state: 'visible' });
await expect(page.locator('.modal')).toHaveCSS('opacity', '1');
```

**6. Polling for dynamic values:**

```typescript
// Use expect with polling (retries until condition is met)
await expect(async () => {
  const count = await page.locator('.notification-count').textContent();
  expect(Number(count)).toBeGreaterThan(0);
}).toPass({ timeout: 10000 });
```

**Key Points:**
- Playwright's locators are "lazy" — they re-query the DOM on every action
- Prefer role-based, text-based, or test-id locators over CSS with dynamic attributes
- Use `expect().toPass()` for custom polling assertions
- Auto-waiting handles most dynamic scenarios without explicit waits

---

### 4. locator() vs page.$() — what's the difference?

**Answer:**

| Feature | `page.locator()` | `page.$()` |
|---------|-----------------|------------|
| Return type | Locator (lazy reference) | ElementHandle (eager, resolved immediately) |
| Auto-waiting | Yes — waits for actionability | No — returns null if not found |
| Re-evaluation | Re-queries DOM on every action | Stale after DOM changes |
| Recommended | Yes — modern Playwright API | No — legacy API, may be deprecated |
| Chaining | Supports fluent chaining | Limited |
| Assertions | Works with `expect(locator)` | Requires manual checks |

**page.locator() — Recommended approach:**

```typescript
// Locator is a lazy reference - doesn't query DOM until action
const button = page.locator('#submit');

// Auto-waits for the button to be actionable (visible, enabled, stable)
await button.click();

// Works with web-first assertions (auto-retries)
await expect(button).toBeVisible();
await expect(button).toHaveText('Submit');
```

**page.$() — Legacy approach:**

```typescript
// Returns ElementHandle immediately (or null if not found)
const button = await page.$('#submit');

if (button) {
  await button.click(); // No auto-wait guarantee
}

// Becomes stale if DOM re-renders
// This may fail if the element is re-created:
await page.click('.trigger-rerender');
await button.click(); // Potential stale element error!
```

**Why locator() is superior:**

```typescript
// Locator re-evaluates on each action — never goes stale
const counter = page.locator('.count');
await expect(counter).toHaveText('0');
await page.click('#increment');
await expect(counter).toHaveText('1'); // Re-queries DOM automatically

// Powerful filtering and chaining
const row = page.locator('tr').filter({ hasText: 'Alice' });
await row.locator('button.edit').click();
```

**When might you still use $():**

```typescript
// Rare case: need to check if element exists without waiting
const element = await page.$('.optional-banner');
if (element) {
  // Handle optional element
}

// But even this is better done with locator:
const banner = page.locator('.optional-banner');
if (await banner.count() > 0) {
  // Handle optional element
}
```

**Key Takeaway:** Always use `locator()` in modern Playwright code. It's auto-waiting, auto-retrying, and never goes stale. `page.$()` is a Puppeteer-era holdover.

---

### 5. How do you use Trace Viewer for debugging?

**Answer:**

Trace Viewer is Playwright's most powerful debugging tool. It captures a complete timeline of test execution including DOM snapshots, network calls, console logs, and action screenshots.

**Enable tracing in config:**

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry',    // Record trace only on first retry
    // trace: 'on',             // Always record (more disk space)
    // trace: 'retain-on-failure', // Keep trace only for failed tests
  },
});
```

**Programmatic trace control:**

```typescript
test('complex flow', async ({ page, context }) => {
  // Start tracing
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  await page.goto('https://example.com');
  await page.click('#start-flow');
  // ... more actions

  // Stop and save trace
  await context.tracing.stop({ path: 'traces/complex-flow.zip' });
});
```

**Open Trace Viewer:**

```bash
# After test failure (trace auto-saved)
npx playwright show-trace test-results/test-name/trace.zip

# Or open the HTML report which links to traces
npx playwright show-report
```

**What Trace Viewer shows:**

1. **Timeline** — Visual timeline of all actions with timing
2. **DOM Snapshots** — Full DOM state before and after each action
3. **Network Tab** — All network requests with payloads and responses
4. **Console Tab** — Browser console messages
5. **Source Tab** — Your test code with the current action highlighted
6. **Action Details** — Locator used, actionability checks, element screenshots

**Debugging workflow with Trace Viewer:**

```
1. Run test → fails
2. Open trace → see timeline of actions
3. Click on the failing action
4. Check "Before" snapshot — is the element visible? Correct state?
5. Check network tab — did the API call succeed?
6. Check console tab — any JS errors?
7. Compare "Before" vs "After" snapshots to see what changed
```

**Key Points:**
- Traces are ZIP files containing all captured data
- `on-first-retry` is the best balance of visibility and performance
- Trace Viewer works offline — no server needed
- Each action shows actionability logs (why a click might have waited)
- Traces integrate with CI — artifacts can be downloaded and viewed locally

---

### 6. Share a scenario where Playwright is better than Selenium.

**Answer:**

**Scenario: Testing a real-time collaborative document editor (like Google Docs)**

This requires multiple browser contexts, network interception, and handling of WebSocket connections — areas where Playwright excels over Selenium.

**Why Playwright wins here:**

| Aspect | Playwright | Selenium |
|--------|-----------|----------|
| Multi-browser contexts | Native — create multiple isolated contexts in one test | Requires multiple WebDriver instances |
| Network interception | Built-in `page.route()` | Requires BrowserMob Proxy or CDP bridge |
| WebSocket handling | Native support via `page.on('websocket')` | No built-in support |
| Auto-waiting | Built-in for all actions | Manual waits (WebDriverWait) |
| Speed | Single process, no HTTP protocol overhead | JSON Wire Protocol adds latency |
| Multi-tab testing | Native context/page management | Complex window handle switching |
| iFrame handling | `frameLocator()` — chainable | Requires explicit `switchTo().frame()` |
| Modern web (Shadow DOM) | Native support | Limited, needs JS execution |

**Example — Testing two users collaborating:**

```typescript
test('two users edit same document', async ({ browser }) => {
  // Create two isolated browser contexts (like two separate users)
  const user1Context = await browser.newContext({ storageState: './auth/user1.json' });
  const user2Context = await browser.newContext({ storageState: './auth/user2.json' });

  const user1Page = await user1Context.newPage();
  const user2Page = await user2Context.newPage();

  // Both users open the same document
  await user1Page.goto('/docs/shared-doc');
  await user2Page.goto('/docs/shared-doc');

  // User 1 types something
  await user1Page.locator('.editor').type('Hello from User 1');

  // User 2 sees it in real-time (auto-waits!)
  await expect(user2Page.locator('.editor')).toContainText('Hello from User 1');

  // Clean up
  await user1Context.close();
  await user2Context.close();
});
```

In Selenium, this would require:
- Two separate WebDriver instances (more memory, more complexity)
- Manual synchronization between the two sessions
- No built-in way to intercept the WebSocket connection
- Explicit waits everywhere

**Other scenarios where Playwright is better:**
- Testing file downloads (Playwright handles them natively)
- PDF generation testing
- Testing apps behind authentication (storageState reuse)
- Mobile emulation (built-in device descriptors)
- Accessibility testing with integrated tools

---

### 7. How do you implement Page Object Model (POM) in Playwright?

**Answer:**

POM separates test logic from page interaction logic, improving reusability and maintainability.

**Base Page class:**

```typescript
// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
```

**Login Page:**

```typescript
// pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.navigateTo('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toHaveText(message);
  }
}
```

**Dashboard Page:**

```typescript
// pages/DashboardPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly navMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.locator('.welcome');
    this.navMenu = page.getByRole('navigation');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async expectWelcomeMessage(name: string) {
    await expect(this.welcomeMessage).toContainText(`Welcome, ${name}`);
  }

  async logout() {
    await this.logoutButton.click();
  }
}
```

**Using POM in tests:**

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Login functionality', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('successful login', async () => {
    await loginPage.login('admin', 'password');
    await dashboardPage.expectWelcomeMessage('Admin');
  });

  test('invalid credentials', async () => {
    await loginPage.login('admin', 'wrong');
    await loginPage.expectErrorMessage('Invalid credentials');
  });
});
```

**Advanced: POM with Fixtures (recommended for large projects):**

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

```typescript
// tests/login.spec.ts — using fixtures
import { test, expect } from '../fixtures';

test('successful login', async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login('admin', 'password');
  await dashboardPage.expectWelcomeMessage('Admin');
});
```

**POM Best Practices:**
- Keep page objects focused — one class per page/component
- Locators in constructor, actions as methods
- Return page objects from navigation methods for fluent chaining
- Don't put assertions inside page objects (exception: verification methods)
- Use fixtures to inject page objects — cleaner than manual instantiation

---

### 8. How do you manage test data?

**Answer:**

Test data management is crucial for reliable, maintainable tests. Here are the common strategies:

**1. JSON/fixture files:**

```typescript
// test-data/users.json
{
  "validUser": { "username": "admin", "password": "pass123" },
  "invalidUser": { "username": "bad", "password": "wrong" }
}
```

```typescript
// tests/login.spec.ts
import testData from '../test-data/users.json';

test('login with valid credentials', async ({ page }) => {
  await page.fill('#username', testData.validUser.username);
  await page.fill('#password', testData.validUser.password);
});
```

**2. Data-driven tests (parameterized):**

```typescript
const loginCases = [
  { user: 'admin', pass: 'admin123', expected: 'Dashboard' },
  { user: 'viewer', pass: 'view123', expected: 'Reports' },
  { user: 'editor', pass: 'edit123', expected: 'Editor' },
];

for (const { user, pass, expected } of loginCases) {
  test(`login as ${user} lands on ${expected}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', user);
    await page.fill('#password', pass);
    await page.click('#submit');
    await expect(page.locator('h1')).toHaveText(expected);
  });
}
```

**3. Environment-based data:**

```typescript
// test-data/environments.ts
const environments = {
  dev: {
    baseUrl: 'https://dev.example.com',
    apiKey: process.env.DEV_API_KEY,
  },
  staging: {
    baseUrl: 'https://staging.example.com',
    apiKey: process.env.STAGING_API_KEY,
  },
};

export const env = environments[process.env.TEST_ENV || 'dev'];
```

**4. Dynamic data generation (faker/factories):**

```typescript
import { faker } from '@faker-js/faker';

function generateUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}

test('register new user', async ({ page }) => {
  const user = generateUser();
  await page.fill('#first-name', user.firstName);
  await page.fill('#last-name', user.lastName);
  await page.fill('#email', user.email);
});
```

**5. API-generated test data (setup/teardown):**

```typescript
test.describe('order tests', () => {
  let orderId: string;

  test.beforeAll(async ({ request }) => {
    // Create test data via API
    const response = await request.post('/api/orders', {
      data: { product: 'Test Product', quantity: 1 },
    });
    orderId = (await response.json()).id;
  });

  test.afterAll(async ({ request }) => {
    // Clean up test data
    await request.delete(`/api/orders/${orderId}`);
  });

  test('verify order details', async ({ page }) => {
    await page.goto(`/orders/${orderId}`);
    await expect(page.locator('.product')).toHaveText('Test Product');
  });
});
```

**6. CSV/Excel-driven tests:**

```typescript
import fs from 'fs';
import path from 'path';

function readCSV(filePath: string) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const [header, ...rows] = content.split('\n').map((r) => r.split(','));
  return rows.map((row) => Object.fromEntries(header.map((h, i) => [h.trim(), row[i]?.trim()])));
}

const testCases = readCSV('./test-data/search-terms.csv');

for (const { term, expectedCount } of testCases) {
  test(`search for "${term}" returns ${expectedCount} results`, async ({ page }) => {
    await page.goto('/search');
    await page.fill('#query', term);
    await page.click('#search-btn');
    await expect(page.locator('.result')).toHaveCount(Number(expectedCount));
  });
}
```

**Key Principles:**
- Separate test data from test logic
- Use environment variables for sensitive data (never hardcode secrets)
- Generate unique data for tests that create resources (avoid collisions in parallel)
- Clean up after tests — use `afterAll`/`afterEach` or API cleanup
- Keep test data files versioned alongside tests

---

### 9. Explain Playwright's parallel execution capabilities.

**Answer:**

Playwright runs tests in parallel by default using worker processes. Each worker runs in isolation with its own browser instance.

**How it works:**

```
Test Suite (e.g., 20 tests)
├── Worker 1 → runs tests 1, 5, 9, 13, 17
├── Worker 2 → runs tests 2, 6, 10, 14, 18
├── Worker 3 → runs tests 3, 7, 11, 15, 19
└── Worker 4 → runs tests 4, 8, 12, 16, 20
```

**Configuration:**

```typescript
// playwright.config.ts
export default defineConfig({
  // Number of parallel workers
  workers: process.env.CI ? 4 : undefined, // undefined = 50% of CPU cores

  // Run tests within the same file in parallel
  fullyParallel: true,
});
```

**Parallelism levels:**

```typescript
// 1. File-level parallelism (default)
// Tests in different files run in parallel, tests in same file run sequentially

// 2. Full parallelism — tests in the same file also run in parallel
export default defineConfig({
  fullyParallel: true,
});

// 3. Serial mode — force sequential within a describe block
test.describe.configure({ mode: 'serial' });
test.describe('dependent tests', () => {
  test('step 1', async ({ page }) => { /* ... */ });
  test('step 2', async ({ page }) => { /* ... */ }); // Runs after step 1
});

// 4. Single worker — no parallelism
// CLI: npx playwright test --workers=1
```

**Worker isolation:**

```typescript
// Each worker gets:
// - Its own browser instance
// - Its own BrowserContext per test
// - Independent file system and environment

// Global setup runs ONCE before all workers
// globalSetup.ts
async function globalSetup() {
  // Seed database, create auth state, etc.
}

// Worker setup runs once PER WORKER
// Can use worker-scoped fixtures
const test = base.extend<{}, { workerDatabase: Database }>({
  workerDatabase: [async ({}, use) => {
    const db = await createTestDatabase();
    await use(db);
    await db.cleanup();
  }, { scope: 'worker' }],
});
```

**Sharding (distribute across CI machines):**

```bash
# Split into 4 shards for 4 CI machines
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

**Handling shared resources:**

```typescript
// Use unique identifiers to avoid conflicts
test('create user', async ({ page }, testInfo) => {
  const uniqueEmail = `user-${testInfo.workerIndex}-${Date.now()}@test.com`;
  await page.fill('#email', uniqueEmail);
});
```

**Key Points:**
- Default: tests in different files run in parallel
- `fullyParallel: true` enables intra-file parallelism
- Each worker = isolated browser (no shared state leaks)
- Use `test.describe.configure({ mode: 'serial' })` for dependent tests
- Workers * Shards = total parallelism in CI
- Always design tests to be independent (no shared mutable state)

---

### 10. Difference between Browser, BrowserContext & Page?

**Answer:**

These three form a hierarchy in Playwright's architecture:

```
Browser (one instance, shared)
├── BrowserContext 1 (isolated session — cookies, storage, permissions)
│   ├── Page 1 (a tab)
│   └── Page 2 (another tab)
├── BrowserContext 2 (completely isolated from Context 1)
│   └── Page 3
└── BrowserContext 3
    └── Page 4
```

| Concept | What it is | Lifecycle | Isolation |
|---------|-----------|-----------|-----------|
| **Browser** | A Chromium/Firefox/WebKit instance | One per worker (reused across tests) | Shared process |
| **BrowserContext** | An isolated browser session (like incognito window) | One per test (by default) | Full isolation: cookies, localStorage, cache |
| **Page** | A single tab/window within a context | Created as needed | Shares session with other pages in same context |

**Browser:**

```typescript
// Launched once per worker, reused across tests
const browser = await chromium.launch({ headless: true });

// Configuration happens at launch
const browser = await chromium.launch({
  headless: false,
  slowMo: 100,
  args: ['--disable-gpu'],
});
```

**BrowserContext:**

```typescript
// Each test gets a fresh context (isolated session)
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  locale: 'en-US',
  geolocation: { latitude: 40.7128, longitude: -74.006 },
  permissions: ['geolocation'],
  httpCredentials: { username: 'user', password: 'pass' },
  storageState: './auth/state.json', // Pre-load cookies/localStorage
});

// Contexts are completely isolated from each other
const context1 = await browser.newContext(); // User A session
const context2 = await browser.newContext(); // User B session
// They don't share cookies, localStorage, or any state
```

**Page:**

```typescript
// A tab within a context
const page = await context.newPage();
await page.goto('https://example.com');

// Multiple pages in same context SHARE session
const page1 = await context.newPage();
const page2 = await context.newPage();
// page1 and page2 share cookies, localStorage

// Handling popups (new pages created by the app)
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('#open-popup'),
]);
await popup.waitForLoadState();
```

**In Playwright Test (abstracted):**

```typescript
// The test fixture gives you an isolated page per test
test('test 1', async ({ page, context, browser }) => {
  // page — a fresh tab in a fresh context
  // context — the BrowserContext that owns this page
  // browser — the shared Browser instance
});
```

**Practical implications:**
- **Multi-user testing:** Use separate BrowserContexts (not separate Browsers)
- **Multi-tab testing:** Use multiple Pages within one Context
- **Session reuse:** Apply `storageState` at the Context level
- **Performance:** Creating a new Context is fast (no new process), creating a new Browser is slow

---

### 11. How do you launch browsers in headless vs headed mode?

**Answer:**

**Via configuration (playwright.config.ts):**

```typescript
export default defineConfig({
  use: {
    headless: true, // Default: true (no browser window)
  },

  projects: [
    {
      name: 'headed-debug',
      use: { headless: false },
    },
    {
      name: 'headless-ci',
      use: { headless: true },
    },
  ],
});
```

**Via CLI:**

```bash
# Run in headed mode (shows browser)
npx playwright test --headed

# Run specific project
npx playwright test --project=headed-debug
```

**Via script (non-test usage):**

```typescript
import { chromium } from 'playwright';

// Headless (default)
const browser = await chromium.launch(); // headless: true by default

// Headed
const browser = await chromium.launch({ headless: false });

// Headed with slow motion (great for demos)
const browser = await chromium.launch({
  headless: false,
  slowMo: 500, // 500ms delay between actions
});
```

**Environment-based switching:**

```typescript
export default defineConfig({
  use: {
    headless: !process.env.HEADED, // HEADED=1 npx playwright test
  },
});
```

**Key Points:**
- Headless = faster, no UI, ideal for CI
- Headed = visible browser, useful for debugging and demos
- `--debug` flag automatically opens in headed mode with Playwright Inspector
- CI should always run headless (no display server needed)
- Use `slowMo` with headed mode for visual debugging

---

### 12. What are Playwright Fixtures and why are they useful?

**Answer:**

Fixtures are Playwright's dependency injection mechanism. They provide reusable setup/teardown logic that tests can declare as dependencies.

**Built-in fixtures:**

```typescript
test('example', async ({ page, context, browser, request }) => {
  // page — isolated Page instance (fresh per test)
  // context — BrowserContext owning the page
  // browser — shared Browser instance
  // request — APIRequestContext for HTTP calls
});
```

**Creating custom fixtures:**

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TodoApp } from './pages/TodoApp';

// Define fixture types
type MyFixtures = {
  loginPage: LoginPage;
  todoApp: TodoApp;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  // Simple fixture — instantiate and provide
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Fixture with setup and teardown
  todoApp: async ({ page }, use) => {
    const app = new TodoApp(page);
    await app.goto();
    await app.addDefaultItems(); // Setup
    await use(app);
    await app.cleanup(); // Teardown (runs after test)
  },

  // Fixture depending on another fixture
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#user', 'admin');
    await page.fill('#pass', 'password');
    await page.click('#submit');
    await page.waitForURL('**/dashboard');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

**Using custom fixtures:**

```typescript
import { test, expect } from './fixtures';

test('add todo item', async ({ todoApp }) => {
  await todoApp.addItem('Buy milk');
  await expect(todoApp.items).toHaveCount(4); // 3 default + 1 new
});

test('authenticated user sees dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('h1')).toHaveText('Dashboard');
});
```

**Worker-scoped fixtures (shared across tests in a worker):**

```typescript
type WorkerFixtures = {
  dbConnection: Database;
};

export const test = base.extend<{}, WorkerFixtures>({
  dbConnection: [async ({}, use) => {
    const db = await Database.connect();
    await use(db);
    await db.disconnect();
  }, { scope: 'worker' }], // Shared across tests in this worker
});
```

**Why fixtures are useful:**

1. **Isolation** — Each test gets its own fixture instance (no shared state leaks)
2. **Lazy initialization** — Fixtures only run if the test actually uses them
3. **Composability** — Fixtures can depend on other fixtures
4. **Automatic cleanup** — Teardown runs after `use()`, even if test fails
5. **Type safety** — Full TypeScript support with type inference
6. **Encapsulation** — Complex setup logic is hidden from test code
7. **Parallelism-safe** — Worker-scoped fixtures shared within a worker, test-scoped per test

---

### 13. How do you handle Dropdowns, Frames/iFrames, and Alerts/Dialog boxes?

**Answer:**

#### Dropdowns:

```typescript
// Native <select> element
await page.selectOption('#country', 'US');                    // By value
await page.selectOption('#country', { label: 'United States' }); // By label
await page.selectOption('#country', { index: 2 });             // By index

// Multi-select
await page.selectOption('#colors', ['red', 'blue', 'green']);

// Custom dropdown (non-<select>, e.g., Material UI, Ant Design)
await page.click('.dropdown-trigger');                         // Open dropdown
await page.locator('.dropdown-option').filter({ hasText: 'Option A' }).click();

// Or using role locators
await page.getByRole('combobox').click();
await page.getByRole('option', { name: 'United States' }).click();

// Searchable dropdown
await page.locator('.search-dropdown input').fill('United');
await page.locator('.dropdown-item').filter({ hasText: 'United States' }).click();
```

#### Frames/iFrames:

```typescript
// Using frameLocator (recommended)
const frame = page.frameLocator('#payment-iframe');
await frame.locator('#card-number').fill('4242424242424242');
await frame.locator('#expiry').fill('12/25');
await frame.locator('#submit').click();

// Nested iframes
const outerFrame = page.frameLocator('#outer');
const innerFrame = outerFrame.frameLocator('#inner');
await innerFrame.locator('button').click();

// By frame name or URL
const frame = page.frame({ name: 'editor-frame' });
const frame = page.frame({ url: /editor\.example\.com/ });

// Wait for frame to load
const frameLocator = page.frameLocator('#dynamic-frame');
await frameLocator.locator('.loaded-indicator').waitFor();

// Frame with assertions
await expect(frame.locator('.success')).toBeVisible();
```

#### Alerts/Dialog Boxes:

```typescript
// Handle JavaScript alert()
page.on('dialog', async (dialog) => {
  console.log('Dialog message:', dialog.message());
  await dialog.accept(); // Click OK
});
await page.click('#trigger-alert');

// Handle confirm() — accept or dismiss
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('confirm');
  expect(dialog.message()).toBe('Are you sure?');
  await dialog.accept(); // Click OK
  // or: await dialog.dismiss(); // Click Cancel
});
await page.click('#delete-button');

// Handle prompt() — provide input
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('prompt');
  await dialog.accept('My Answer'); // Enter text and click OK
});
await page.click('#ask-name');

// One-time dialog handler (using once)
page.once('dialog', (dialog) => dialog.accept());
await page.click('#trigger');

// Waiting for dialog explicitly
const dialogPromise = page.waitForEvent('dialog');
await page.click('#trigger');
const dialog = await dialogPromise;
await dialog.accept();
```

**Key Points:**
- `frameLocator()` is the modern, chainable API for frames (replaces `frame()`)
- Dialogs MUST be handled with event listeners set BEFORE the action triggers them
- Custom dropdowns require different strategies than native `<select>` elements
- `page.once('dialog')` handles a single dialog without leaving the listener active

---

### 14. How does Playwright handle waits differently from Selenium?

**Answer:**

This is one of Playwright's biggest advantages. Playwright uses **auto-waiting** built into every action, while Selenium requires explicit wait management.

**Selenium approach (manual waits):**

```java
// Selenium: Explicit waits everywhere
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// Wait for element to be clickable, then click
WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
button.click();

// Wait for element to be visible
WebElement message = wait.until(ExpectedConditions.visibilityOfElementLocated(By.css(".success")));
String text = message.getText();

// Implicit wait (global, applies to all findElement calls)
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

// Thread.sleep — the worst option (but common in practice)
Thread.sleep(3000); // Hard wait
```

**Playwright approach (auto-waiting):**

```typescript
// Playwright: No explicit waits needed for actions
await page.click('#submit');
// Automatically waits for:
// ✓ Element to be attached to DOM
// ✓ Element to be visible
// ✓ Element to be stable (no animations)
// ✓ Element to be enabled
// ✓ Element to receive events (not obscured)

// Assertions auto-retry until timeout
await expect(page.locator('.success')).toBeVisible();
await expect(page.locator('.count')).toHaveText('5');
// Retries every 100ms until condition is met or timeout
```

**Comparison table:**

| Aspect | Selenium | Playwright |
|--------|----------|-----------|
| Click | Must wait for clickable explicitly | Auto-waits for actionability |
| Text assertion | Get text → compare manually | `expect(loc).toHaveText()` auto-retries |
| Element not found | Throws immediately (or after implicit wait) | Waits until timeout, then fails |
| Animations | Must handle manually | Waits for element stability |
| Navigation | `driver.get()` waits for page load only | `page.goto()` waits for `load` event + network idle |
| Network | No built-in network wait | `waitForResponse()`, `waitForLoadState('networkidle')` |

**Playwright's actionability checks (automatic for every action):**

```
Before click():
1. Attached? → Is the element in the DOM?
2. Visible? → Is it rendered and not hidden?
3. Stable? → Has it stopped moving/animating?
4. Enabled? → Is it not disabled?
5. Receives Events? → Is it not covered by another element?
```

**When you DO need explicit waits in Playwright:**

```typescript
// Waiting for navigation
await page.waitForURL('**/dashboard');

// Waiting for network response
await page.waitForResponse('**/api/data');

// Waiting for load state
await page.waitForLoadState('networkidle');

// Custom polling (rare)
await expect(async () => {
  const value = await page.locator('#dynamic').textContent();
  expect(Number(value)).toBeGreaterThan(100);
}).toPass();
```

**What to AVOID (anti-patterns):**

```typescript
// ❌ NEVER use hard waits
await page.waitForTimeout(3000); // Anti-pattern!

// ❌ NEVER manually check then act
const isVisible = await page.locator('#btn').isVisible();
if (isVisible) await page.click('#btn'); // Race condition!

// ✅ Instead, just act — Playwright auto-waits
await page.click('#btn');
```

**Key Takeaway:**
A good Playwright framework should have almost ZERO `waitForTimeout()` calls. If you find yourself adding explicit waits, you're likely fighting against Playwright's design rather than leveraging it.

---

---

## ROUND 3 — Java Coding + Managerial

---

### Coding Question 1: Count and print the number of vowels and consonants in your name.

**Java Solution:**

```java
public class VowelConsonantCounter {
    public static void main(String[] args) {
        String name = "Sriram Kukkadapu";
        int vowels = 0;
        int consonants = 0;

        String lowerName = name.toLowerCase();

        for (int i = 0; i < lowerName.length(); i++) {
            char ch = lowerName.charAt(i);

            if (ch >= 'a' && ch <= 'z') { // Only count alphabets
                if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
                    vowels++;
                } else {
                    consonants++;
                }
            }
        }

        System.out.println("Name: " + name);
        System.out.println("Vowels: " + vowels);
        System.out.println("Consonants: " + consonants);
    }
}
```

**Output:**
```
Name: Sriram Kukkadapu
Vowels: 6 (i, a, u, a, a, u)
Consonants: 9 (S, r, r, m, K, k, k, d, p)
```

**TypeScript/JavaScript Solution:**

```typescript
function countVowelsAndConsonants(name: string): void {
  let vowels = 0;
  let consonants = 0;
  const vowelSet = new Set(['a', 'e', 'i', 'o', 'u']);

  for (const char of name.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      if (vowelSet.has(char)) {
        vowels++;
      } else {
        consonants++;
      }
    }
  }

  console.log(`Name: ${name}`);
  console.log(`Vowels: ${vowels}`);
  console.log(`Consonants: ${consonants}`);
}

countVowelsAndConsonants('Sriram Kukkadapu');
```

**Key Points to mention:**
- Handle spaces and special characters (skip non-alphabetic characters)
- Case insensitivity (convert to lowercase first)
- Time complexity: O(n), Space complexity: O(1)

---

### Coding Question 2: Find unique & duplicate characters in your name WITHOUT using Collections in Java.

**Java Solution:**

```java
public class UniqueDuplicateFinder {
    public static void main(String[] args) {
        String name = "Sriram Kukkadapu";
        String lowerName = name.toLowerCase().replace(" ", ""); // Remove spaces

        // Using an array of 26 to track character frequency (no Collections)
        int[] charCount = new int[26];

        // Count frequency of each character
        for (int i = 0; i < lowerName.length(); i++) {
            char ch = lowerName.charAt(i);
            if (ch >= 'a' && ch <= 'z') {
                charCount[ch - 'a']++;
            }
        }

        // Print unique characters (count == 1)
        System.out.print("Unique characters: ");
        for (int i = 0; i < 26; i++) {
            if (charCount[i] == 1) {
                System.out.print((char) (i + 'a') + " ");
            }
        }
        System.out.println();

        // Print duplicate characters (count > 1)
        System.out.print("Duplicate characters: ");
        for (int i = 0; i < 26; i++) {
            if (charCount[i] > 1) {
                System.out.print((char) (i + 'a') + "(" + charCount[i] + ") ");
            }
        }
        System.out.println();
    }
}
```

**Output:**
```
Unique characters: d i m p s u
Duplicate characters: a(3) k(3) r(2)
```

**Alternative approach — using boolean arrays:**

```java
public class UniqueDuplicateAlt {
    public static void main(String[] args) {
        String name = "SriramKukkadapu".toLowerCase();

        boolean[] seen = new boolean[26];
        boolean[] duplicate = new boolean[26];

        for (int i = 0; i < name.length(); i++) {
            int index = name.charAt(i) - 'a';
            if (seen[index]) {
                duplicate[index] = true;
            } else {
                seen[index] = true;
            }
        }

        System.out.print("Unique: ");
        for (int i = 0; i < 26; i++) {
            if (seen[i] && !duplicate[i]) {
                System.out.print((char) (i + 'a') + " ");
            }
        }

        System.out.print("\nDuplicate: ");
        for (int i = 0; i < 26; i++) {
            if (duplicate[i]) {
                System.out.print((char) (i + 'a') + " ");
            }
        }
    }
}
```

**TypeScript Solution (without Map/Set):**

```typescript
function findUniquesAndDuplicates(name: string): void {
  const lowerName = name.toLowerCase().replace(/[^a-z]/g, '');
  const charCount: number[] = new Array(26).fill(0);

  for (const char of lowerName) {
    charCount[char.charCodeAt(0) - 97]++;
  }

  const unique: string[] = [];
  const duplicate: string[] = [];

  for (let i = 0; i < 26; i++) {
    if (charCount[i] === 1) unique.push(String.fromCharCode(i + 97));
    if (charCount[i] > 1) duplicate.push(`${String.fromCharCode(i + 97)}(${charCount[i]})`);
  }

  console.log('Unique:', unique.join(', '));
  console.log('Duplicate:', duplicate.join(', '));
}

findUniquesAndDuplicates('Sriram Kukkadapu');
```

**Key Points:**
- Use `int[26]` array instead of HashMap — satisfies "no Collections" constraint
- Character-to-index mapping: `ch - 'a'` gives 0–25
- Time complexity: O(n), Space complexity: O(1) (fixed 26-element array)
- Handle case sensitivity and spaces

---

### Coding Question 3: Find the Longest Substring without repeating characters.

**Java Solution (Sliding Window approach):**

```java
public class LongestSubstring {
    public static void main(String[] args) {
        String input = "abcabcbb";
        System.out.println("Input: " + input);
        System.out.println("Longest substring length: " + lengthOfLongestSubstring(input));
        System.out.println("Longest substring: " + findLongestSubstring(input));
    }

    // Returns the LENGTH of the longest substring
    public static int lengthOfLongestSubstring(String s) {
        int[] lastIndex = new int[128]; // ASCII characters
        java.util.Arrays.fill(lastIndex, -1);

        int maxLength = 0;
        int start = 0;

        for (int end = 0; end < s.length(); end++) {
            char ch = s.charAt(end);

            // If character was seen and is within current window
            if (lastIndex[ch] >= start) {
                start = lastIndex[ch] + 1; // Move start past the duplicate
            }

            lastIndex[ch] = end;
            maxLength = Math.max(maxLength, end - start + 1);
        }

        return maxLength;
    }

    // Returns the ACTUAL longest substring
    public static String findLongestSubstring(String s) {
        int[] lastIndex = new int[128];
        java.util.Arrays.fill(lastIndex, -1);

        int maxLength = 0;
        int maxStart = 0;
        int start = 0;

        for (int end = 0; end < s.length(); end++) {
            char ch = s.charAt(end);

            if (lastIndex[ch] >= start) {
                start = lastIndex[ch] + 1;
            }

            lastIndex[ch] = end;

            if (end - start + 1 > maxLength) {
                maxLength = end - start + 1;
                maxStart = start;
            }
        }

        return s.substring(maxStart, maxStart + maxLength);
    }
}
```

**Output:**
```
Input: abcabcbb
Longest substring length: 3
Longest substring: abc
```

**More examples:**
```
"bbbbb" → 1 ("b")
"pwwkew" → 3 ("wke")
"dvdf" → 3 ("vdf")
"" → 0 ("")
```

**TypeScript Solution:**

```typescript
function longestSubstringWithoutRepeating(s: string): { length: number; substring: string } {
  const lastIndex = new Map<string, number>();
  let maxLength = 0;
  let maxStart = 0;
  let start = 0;

  for (let end = 0; end < s.length; end++) {
    const char = s[end];

    if (lastIndex.has(char) && lastIndex.get(char)! >= start) {
      start = lastIndex.get(char)! + 1;
    }

    lastIndex.set(char, end);

    if (end - start + 1 > maxLength) {
      maxLength = end - start + 1;
      maxStart = start;
    }
  }

  return {
    length: maxLength,
    substring: s.slice(maxStart, maxStart + maxLength),
  };
}

// Test
console.log(longestSubstringWithoutRepeating('abcabcbb')); // { length: 3, substring: 'abc' }
console.log(longestSubstringWithoutRepeating('bbbbb'));     // { length: 1, substring: 'b' }
console.log(longestSubstringWithoutRepeating('pwwkew'));    // { length: 3, substring: 'wke' }
```

**Explanation of the Sliding Window approach:**
1. Maintain a window `[start, end]` that represents the current substring without duplicates
2. Expand the window by moving `end` forward
3. If a duplicate is found within the window, shrink by moving `start` past the previous occurrence
4. Track the maximum window size seen

**Complexity:**
- Time: O(n) — single pass through the string
- Space: O(min(n, 128)) — for the character index tracking (constant for ASCII)

---

### Managerial Question 4: The deadline is near. How would you distribute tasks among your teammates?

**Answer:**

This is a situational leadership question. Here's a structured approach:

**1. Assess the situation (30 minutes):**
- What's the remaining scope? List all pending tasks
- What's the actual deadline (hard vs soft)?
- What are the blockers and risks?
- What's the team's current capacity and workload?

**2. Prioritize ruthlessly:**
- **Must-have (P0):** Critical path items that block release (e.g., core functionality, showstopper bugs)
- **Should-have (P1):** Important but not release-blocking (e.g., edge case coverage, minor UI fixes)
- **Nice-to-have (P2):** Can be deferred (e.g., additional test coverage, documentation polish)

**3. Match tasks to strengths:**

| Factor | Assignment Strategy |
|--------|-------------------|
| Domain expertise | Assign complex tasks to people who know that area |
| Learning opportunity | Only if timeline allows |
| Dependency chain | Assign dependent tasks to same person or pair them |
| Risk level | High-risk tasks to senior members |
| Parallelism | Identify tasks that can run concurrently |

**4. Distribute and communicate:**

```
Example distribution (team of 4, 3 days left):
- Person A (senior): Critical payment flow tests + review others' PRs
- Person B (mid): API regression suite + mock setup
- Person C (mid): UI smoke tests + cross-browser validation
- Person D (junior): Test data preparation + documentation
- Me (lead): Blockers resolution, CI pipeline fixes, stakeholder updates, fill gaps
```

**5. Create visibility:**
- Daily 15-min standups (morning sync on progress/blockers)
- Shared board (Jira/Trello) with clear ownership and status
- End-of-day brief status messages

**6. Risk mitigation:**
- Identify the single biggest risk and assign it first
- Have a backup plan: "If X isn't done, we can still ship with Y"
- Communicate scope cuts early to stakeholders — it's better to cut scope transparently than miss a deadline silently
- Offer to help remove blockers personally

**7. What I would NOT do:**
- Assign tasks arbitrarily without considering skills
- Overload one person while others are idle
- Skip communication — silence breeds misalignment
- Compromise quality by rushing without a plan
- Work overtime without first trying to reduce scope

**Sample answer in interview:**

> "When a deadline is tight, I first list all remaining work and ruthlessly prioritize into must-have vs nice-to-have. I then match tasks to team members based on their strengths and domain knowledge — this isn't the time for stretch assignments. I assign the highest-risk items first to the most experienced people, and take on blocker-resolution and gap-filling myself. I set up a daily sync to surface issues early and communicate transparently with stakeholders about what's realistic. If needed, I negotiate scope — it's better to deliver fewer things well than everything poorly."

**Framework to use:** STAR (Situation, Task, Action, Result) if you have a real example from past experience.

---

## Summary & Tips for Interview Success

1. **Demonstrate depth, not just breadth** — For any Playwright question, give the "why" not just the "how"
2. **Code on screen** — Practice writing code without IDE autocomplete
3. **Think aloud** — Interviewers want to see your problem-solving process
4. **Ask clarifying questions** — Shows maturity and real-world experience
5. **Relate to real projects** — "In my last project, we faced X, and solved it with Y"
6. **Know the trade-offs** — Every decision has pros and cons; show you understand both sides
7. **Stay current** — Mention recent Playwright features (component testing, UI mode, trace viewer improvements)

---

*Good luck with your interview preparation!*

---

## BONUS ROUND — Additional Interview Questions

---

### 1. Introduce Yourself (Tailored for Playwright/SDET Role)

**Sample Answer:**

"Hi, I'm [Your Name], a QA Automation Engineer with X years of experience in test automation. I currently work at [Company] where I'm responsible for building and maintaining our end-to-end test automation framework using Playwright with TypeScript.

**My key responsibilities include:**
- Designing and implementing the Page Object Model architecture
- Writing UI and API automation tests using Playwright
- Setting up CI/CD pipelines for automated test execution
- Mentoring junior team members on automation best practices
- Collaborating with developers on testability and defect triage

**Project highlights:**
- Built a Playwright framework from scratch covering 200+ test scenarios
- Reduced regression suite execution time by 60% using parallel execution and API-based test setup
- Implemented network mocking to eliminate third-party service dependencies in tests

**Tech stack I work with:** Playwright, TypeScript, JavaScript, Git, Jenkins/GitHub Actions, Docker, REST APIs, and Postman for exploratory API testing."

**Tips:**
- Keep it 60–90 seconds
- Structure: Intro → Current role → Key skills → Achievement
- Tailor to the job description — mention tools/frameworks they listed
- End with something that shows enthusiasm or curiosity

---

### 2. Filters in Playwright Locators

**Answer:**

Locator filters allow you to narrow down a set of matched elements based on content, child elements, or the absence of certain text/elements. They're essential when your base locator matches multiple elements and you need to pick the right one.

#### `filter({ hasText })` — Filter by text content

```typescript
// Find the list item that contains "Playwright"
await page.locator('li').filter({ hasText: 'Playwright' }).click();

// Works with regex too
await page.locator('.card').filter({ hasText: /\$[0-9]+/ }).click();
```

#### `filter({ hasNotText })` — Exclude by text content

```typescript
// Find all cards that do NOT contain "Out of stock"
const availableProducts = page.locator('.product-card').filter({ hasNotText: 'Out of stock' });
await expect(availableProducts).toHaveCount(5);
```

#### `filter({ has })` — Filter by child element

```typescript
// Find the row that contains a button with text "Edit"
await page.locator('tr').filter({ has: page.getByRole('button', { name: 'Edit' }) }).click();

// Find card that has an image inside it
await page.locator('.card').filter({ has: page.locator('img') }).click();
```

#### `filter({ hasNot })` — Exclude by child element

```typescript
// Find rows that do NOT have a delete button (e.g., admin rows that can't be deleted)
const protectedRows = page.locator('tr').filter({ hasNot: page.locator('button.delete') });
await expect(protectedRows).toHaveCount(2);
```

#### Combining Filters (Chaining)

```typescript
// Find a product card that has "iPhone" text AND contains an "Add to Cart" button
await page.locator('.product-card')
  .filter({ hasText: 'iPhone' })
  .filter({ has: page.getByRole('button', { name: 'Add to Cart' }) })
  .click();
```

#### Real-World Example

```typescript
// Scenario: A table with multiple rows, find the row for "John" and click its Edit button
const johnRow = page.locator('tr').filter({ hasText: 'John' });
await johnRow.getByRole('button', { name: 'Edit' }).click();
```

**Summary Table:**

| Filter | Purpose | Example |
|--------|---------|---------|
| `hasText` | Match elements containing specific text | `.filter({ hasText: 'Submit' })` |
| `hasNotText` | Exclude elements with specific text | `.filter({ hasNotText: 'Disabled' })` |
| `has` | Match elements that have a specific child locator | `.filter({ has: page.locator('img') })` |
| `hasNot` | Exclude elements that have a specific child locator | `.filter({ hasNot: page.locator('.badge') })` |

**Key Points:**
- Filters work on the **locator level** — they refine which elements are selected
- `hasText` checks the element's full text content (including children)
- `has` / `hasNot` accept another **locator** as the value (not a string)
- Filters can be chained for precise targeting

---

### 3. Scenario-Based Question — BrowserContext & Session Sharing

**Scenario from the interviewer:**

> "Launch the browser. Create a BrowserContext. Open two pages using the same context."

**Setup Code:**

```typescript
import { chromium } from 'playwright';

async function contextDemo() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Open two pages (tabs) in the SAME context
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  // Login on page1
  await page1.goto('https://example.com/login');
  await page1.fill('#username', 'admin');
  await page1.fill('#password', 'password');
  await page1.click('#login-btn');

  // Navigate to the same site on page2
  await page2.goto('https://example.com/dashboard');
  // page2 is already logged in! No login required.

  await browser.close();
}
```

---

**Question 1: "Will the second page ask for login?"**

**Answer: No.**

Both pages belong to the **same BrowserContext**, so they share:
- Cookies
- localStorage
- sessionStorage
- Cache

If page1 is already logged in, page2 inherits the same authenticated session — just like opening a new tab in your regular browser.

```
BrowserContext (shared session)
├── Page 1 — logged in ✓ (cookies set after login)
└── Page 2 — also logged in ✓ (shares same cookies)
```

---

**Question 2: "If I open the same URL in a different page, will it ask for login?"**

**Answer: It depends on which context the page belongs to.**

**Case 1 — Same BrowserContext → NO login required:**

```typescript
const context = await browser.newContext();
const page1 = await context.newPage(); // Login here
const page2 = await context.newPage(); // Already logged in
```

**Case 2 — Different BrowserContext → YES, login required:**

```typescript
const context1 = await browser.newContext();
const context2 = await browser.newContext(); // Fresh session!

const page1 = await context1.newPage(); // Login here
const page2 = await context2.newPage(); // Not logged in — different context
```

**Case 3 — Different Browser instance → YES, login required:**

```typescript
const browser1 = await chromium.launch();
const browser2 = await chromium.launch(); // Completely separate

const page1 = await browser1.newPage(); // Login here
const page2 = await browser2.newPage(); // Not logged in — different browser
```

**Visual Summary:**

```
Browser
├── Context A (Session 1 — logged in)
│   ├── Page 1 ✓ authenticated
│   └── Page 2 ✓ authenticated (shares session)
│
└── Context B (Session 2 — fresh, not logged in)
    └── Page 3 ✗ not authenticated (separate session)
```

**Key Insight:** `BrowserContext` is the session boundary in Playwright. Pages within the same context share state. Pages in different contexts are completely isolated — like incognito vs regular windows.

---

### 4. Write Code to Execute Tests in Headless Mode

**Answer:**

By default, Playwright runs in **headless mode** (no visible browser window). Here's how to ensure it:

**Test file:**

```typescript
// tests/headless-demo.spec.ts
import { test, expect } from '@playwright/test';

test('Headless Execution', async ({ page }) => {
  await page.goto('https://example.com');
  const title = await page.title();
  console.log('Page title:', title);
  await expect(page).toHaveTitle(/Example/);
});
```

**Config (explicitly set headless):**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true, // This is the default, but being explicit is good for clarity
  },
});
```

**Run:**

```bash
# Runs headless by default
npx playwright test tests/headless-demo.spec.ts

# To run headed (see the browser) — override via CLI
npx playwright test tests/headless-demo.spec.ts --headed
```

**Key Points:**
- `headless: true` is the **default** — you don't even need to set it
- Headless mode is faster and ideal for CI/CD pipelines
- Use `--headed` CLI flag when you want to visually debug
- In config, you can use environment variable: `headless: !process.env.HEADED`

---

### Interview Tip

> Interviewers don't just check if you can write code — they also want to know whether you understand concepts like **Browser**, **BrowserContext**, **Page**, and **session sharing** in Playwright. Understanding the hierarchy and isolation model shows you truly know the framework, not just the syntax.
