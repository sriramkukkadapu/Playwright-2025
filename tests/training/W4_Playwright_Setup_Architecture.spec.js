// ============================================================
// WEEK 4 — Playwright Setup & Architecture
// Topics: Browser/Context/Page concepts, First test,
//         Config walkthrough, Fixtures
// ============================================================

const { test, expect, chromium, firefox, webkit } = require('@playwright/test');

// ─── 1. Browser → Context → Page Architecture ────────────────
test('W4: Browser > Context > Page architecture', async () => {
    // ARCHITECTURE:
    // Browser  = the browser process (Chrome, Firefox, Safari)
    // Context  = isolated session (like incognito) — own cookies/storage
    // Page     = a single tab within a context

    const browser = await chromium.launch({ headless: true });

    // Context 1 — User A session
    const contextA = await browser.newContext();
    const pageA    = await contextA.newPage();
    await pageA.goto('https://www.google.com');
    console.log('User A URL:', pageA.url());

    // Context 2 — User B session (completely isolated)
    const contextB = await browser.newContext();
    const pageB    = await contextB.newPage();
    await pageB.goto('https://www.bing.com');
    console.log('User B URL:', pageB.url());

    // Contexts are isolated — cookies in A don't affect B
    await contextA.close();
    await contextB.close();
    await browser.close();

    expect(pageA.url()).toContain('google');
    expect(pageB.url()).toContain('bing');
});

// ─── 2. Using Page Fixture (recommended approach) ────────────
test('W4: Page fixture - recommended approach', async ({ page }) => {
    // Playwright provides `page` fixture automatically per test
    // Each test gets a fresh browser context — fully isolated

    await page.goto('https://rahulshettyacademy.com/loginPagePractise');

    const title = await page.title();
    console.log('Title:', title);
    console.log('URL:', page.url());

    expect(title).toBeTruthy();
    expect(page.url()).toContain('loginPagePractise');
});

// ─── 3. Browser Fixture ─────────────────────────────────────
test('W4: Browser fixture - manual context management', async ({ browser }) => {
    // Use `browser` fixture when you need multiple contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('https://www.google.com');
    await page2.goto('https://www.google.com');

    // Each page in own isolated context
    await context1.addCookies([{ name: 'user', value: 'alice', domain: 'google.com', path: '/' }]);

    const cookiesCtx1 = await context1.cookies();
    const cookiesCtx2 = await context2.cookies();

    console.log('Context1 cookies:', cookiesCtx1.length);
    console.log('Context2 cookies:', cookiesCtx2.length);

    // Cookie set in context1 doesn't exist in context2
    expect(cookiesCtx1.length).toBeGreaterThan(cookiesCtx2.length);

    await context1.close();
    await context2.close();
});

// ─── 4. BrowserContext features ─────────────────────────────
test('W4: BrowserContext - viewport, locale, timezone', async ({ browser }) => {
    // Context lets you simulate different devices/environments
    const context = await browser.newContext({
        viewport:    { width: 375, height: 812 }, // iPhone viewport
        locale:      'en-IN',
        timezoneId:  'Asia/Kolkata',
        userAgent:   'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        colorScheme: 'dark'
    });

    const page = await context.newPage();
    await page.goto('https://www.google.com');

    const viewport = page.viewportSize();
    console.log('Viewport:', viewport);
    expect(viewport.width).toBe(375);

    await context.close();
});

// ─── 5. Test Configuration Key Concepts ─────────────────────
test('W4: Understanding test.use() - per-test config', async ({ page }) => {
    // You can override config for individual tests using test.use()
    // (This is declared at describe block level in real usage)

    await page.goto('https://rahulshettyacademy.com/loginPagePractise');
    await expect(page).toHaveTitle(/LoginPage Practise/);
    console.log('Viewport:', page.viewportSize());
});

// ─── 6. Custom Fixtures ─────────────────────────────────────
// Custom fixtures extend base fixtures — great for POM setup
// In real projects create a fixtures file like this:
//
// import { test as base } from '@playwright/test';
// import { LoginPage } from './pages/LoginPage';
//
// export const test = base.extend({
//   loginPage: async ({ page }, use) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.goto();
//     await use(loginPage);
//   }
// });

test('W4: Simulating fixture pattern with beforeEach', async ({ page }) => {
    // Without custom fixtures, use beforeEach for common setup
    await page.goto('https://rahulshettyacademy.com/loginPagePractise');
    await expect(page).toHaveURL(/loginPagePractise/);
    console.log('Setup done, ready to test');
});

// ─── 7. Test Hooks ──────────────────────────────────────────
test.describe('W4: Test Hooks', () => {
    test.beforeAll(async () => {
        console.log('🟢 beforeAll — runs once before all tests in describe block');
    });

    test.afterAll(async () => {
        console.log('🔴 afterAll — runs once after all tests in describe block');
    });

    test.beforeEach(async ({ page }) => {
        console.log('▶️  beforeEach — runs before each test');
        await page.goto('https://rahulshettyacademy.com/loginPagePractise');
    });

    test.afterEach(async ({ page }) => {
        console.log('⏹️  afterEach — runs after each test');
        console.log('Final URL:', page.url());
    });

    test('Hook test 1', async ({ page }) => {
        await expect(page).toHaveURL(/loginPagePractise/);
    });

    test('Hook test 2', async ({ page }) => {
        const title = await page.title();
        expect(title).toBeTruthy();
    });
});

// ─── 8. Multiple Browsers ───────────────────────────────────
test('W4: Running same test on different browsers', async ({ page, browserName }) => {
    // browserName is injected by Playwright — tells you which browser is running
    console.log(`Running on: ${browserName}`);

    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);

    // Configure in playwright.config.js projects:
    // projects: [
    //   { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    //   { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    //   { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    // ]
});
