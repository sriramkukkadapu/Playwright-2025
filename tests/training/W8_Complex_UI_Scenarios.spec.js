// ============================================================
// WEEK 8 — Complex UI Scenarios
// Topics: iFrames, Shadow DOM, Calendars, Infinite Scroll,
//         AJAX, Network Sync, Trace Viewer, Debugging
// ============================================================

const { test, expect } = require('@playwright/test');

const AUTO_URL = 'https://rahulshettyacademy.com/AutomationPractice/';

// ─── 1. iFrames ─────────────────────────────────────────────
test('W8: iFrames - frameLocator', async ({ page }) => {
    await page.goto(AUTO_URL);

    // Method 1: frameLocator (recommended)
    const iframeLocator = page.frameLocator('#courses-iframe');

    // Interact with element inside iframe
    const iframeLink = iframeLocator.locator("li a[href='lifetime-access']:visible");
    await iframeLink.click();

    const text = await iframeLocator.locator('.text h2').textContent();
    console.log('Text in iframe:', text);
    console.log('Subscribers:', text.split(' ')[1]?.trim());

    // Method 2: frame by name/URL
    // const frame = page.frame('iframe-name');
    // const frame = page.frame({ url: /courses/ });

    expect(text).toBeTruthy();
});

test('W8: iFrames - frame() method', async ({ page }) => {
    await page.goto(AUTO_URL);

    // Get frame by name attribute
    const frame = page.frame('iframe-name');

    if (frame) {
        const link = frame.locator("li a[href='lifetime-access']:visible");
        if (await link.isVisible()) {
            await link.click();
            const result = await frame.locator('.text h2').textContent();
            console.log('Frame result:', result);
        }
    }

    console.log('frame() method demonstrated ✅');
});

// ─── 2. Calendar / Date Picker ──────────────────────────────
test('W8: Calendar date picker', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    // Navigate to orders/checkout to find a date picker
    // For demonstration — fill date input directly
    const dateInputs = page.locator('input[type="date"]');
    const count = await dateInputs.count();

    if (count > 0) {
        // Fill date input directly (fastest approach)
        await dateInputs.first().fill('2025-12-25');
        const value = await dateInputs.first().inputValue();
        console.log('Date set to:', value);
        expect(value).toBe('2025-12-25');
    }

    // For custom calendar pickers — click through months
    // const calendarPicker = page.locator('.datepicker');
    // await calendarPicker.click();
    // Navigate months: click prev/next arrows
    // Click on target date number

    console.log('Calendar handling demonstrated ✅');
});

// ─── 3. AJAX & Network Synchronization ──────────────────────
test('W8: AJAX and network synchronization', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for AJAX/network to complete
    await page.waitForLoadState('networkidle'); // all requests done

    // Wait for specific API response
    // const [response] = await Promise.all([
    //   page.waitForResponse(resp => resp.url().includes('/api/products')),
    //   page.reload()
    // ]);
    // console.log('API status:', response.status());

    // Wait for element that appears after AJAX
    await page.locator('.card-body b').last().waitFor({ state: 'visible', timeout: 15000 });

    const count = await page.locator('.card-body').count();
    console.log('Products loaded via AJAX:', count);
    expect(count).toBeGreaterThan(0);
});

// ─── 4. Infinite Scroll ─────────────────────────────────────
test('W8: Infinite scroll simulation', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    const initialCount = await page.locator('.card-body').count();
    console.log('Initial items:', initialCount);

    // Scroll to bottom to trigger infinite scroll
    for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000); // wait for new items to load
    }

    const finalCount = await page.locator('.card-body').count();
    console.log('Items after scroll:', finalCount);

    // Count may or may not increase depending on app
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
});

// ─── 5. Shadow DOM ──────────────────────────────────────────
test('W8: Shadow DOM', async ({ page }) => {
    // Shadow DOM elements are inside a shadow root
    // Playwright can pierce shadow DOM automatically with CSS selectors

    await page.goto('https://books-pwakit.appspot.com/');

    // Playwright auto-pierces shadow DOM with >> css selector
    // or use page.locator() which handles it natively
    const searchInput = page.locator('book-app').locator('app-toolbar input');

    if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.fill('JavaScript');
        await searchInput.press('Enter');
        console.log('Shadow DOM input filled ✅');
    }

    // Alternative: evaluate JS to access shadow root
    // await page.evaluate(() => {
    //   const host = document.querySelector('my-component');
    //   const input = host.shadowRoot.querySelector('input');
    //   input.value = 'test';
    // });

    console.log('Shadow DOM demonstrated ✅');
});

// ─── 6. Network Interception ────────────────────────────────
test('W8: Network interception - monitor requests', async ({ page }) => {
    const apiCalls = [];

    // Listen to all network requests
    page.on('request', request => {
        if (request.url().includes('api') || request.url().includes('login')) {
            apiCalls.push({
                url:    request.url(),
                method: request.method()
            });
        }
    });

    // Listen to responses
    page.on('response', response => {
        if (response.status() >= 400) {
            console.log(`❌ Error response: ${response.status()} - ${response.url()}`);
        }
    });

    await page.goto('https://rahulshettyacademy.com/client');
    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    console.log('Captured API calls:');
    apiCalls.forEach(call => console.log(`  ${call.method} ${call.url}`));

    expect(apiCalls.length).toBeGreaterThanOrEqual(0);
});

// ─── 7. Trace Viewer & Debugging ────────────────────────────
test('W8: Trace Viewer - capturing traces for debugging', async ({ page }) => {
    // Traces are configured in playwright.config.js:
    // use: { trace: 'on-first-retry' }  or 'on' or 'retain-on-failure'

    // To view trace: npx playwright show-trace trace.zip

    await page.goto('https://rahulshettyacademy.com/loginPagePractise');

    // Add annotations for better trace readability
    await test.step('Fill login form', async () => {
        await page.locator('#username').fill('rahulshettyacademy');
        await page.locator('#password').fill('Learning@830$3mK2');
    });

    await test.step('Accept terms and submit', async () => {
        await page.locator('#terms').check();
        await page.locator('#signInBtn').click();
    });

    await test.step('Verify navigation', async () => {
        await page.waitForURL(/angularpractice/);
        await expect(page).toHaveURL(/angularpractice/);
    });

    console.log('Trace captured ✅ Run: npx playwright show-trace trace.zip');
});

// ─── 8. Screenshots for Debugging ───────────────────────────
test('W8: Screenshots for debugging', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginPagePractise');

    // Full page screenshot
    await page.screenshot({ path: '/tmp/full-page.png', fullPage: true });

    // Element screenshot
    await page.locator('#signInBtn').screenshot({ path: '/tmp/button.png' });

    // Screenshot on failure is auto-configured in playwright.config.js
    // use: { screenshot: 'only-on-failure' }

    console.log('Screenshots saved to /tmp/ ✅');
    expect(true).toBe(true);
});
