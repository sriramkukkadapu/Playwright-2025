// ============================================================
// WEEK 7 — Actions & Browser Contexts
// Topics: Mouse, Keyboard, Drag & Drop, Scrolling,
//         Multi-tab, Browser Context, Cookies, LocalStorage
// ============================================================

const { test, expect } = require('@playwright/test');

const AUTO_URL = 'https://rahulshettyacademy.com/AutomationPractice/';

// ─── 1. Mouse Actions ───────────────────────────────────────
test('W7: Mouse actions - hover', async ({ page }) => {
    await page.goto(AUTO_URL);

    // Hover over an element
    const mouseHover = page.locator('#mousehover');
    await mouseHover.hover();

    // After hover, hidden menu appears
    await page.waitForTimeout(500); // small wait for hover effect
    const hoverMenu = page.locator('.mouse-hover-content');
    if (await hoverMenu.isVisible()) {
        console.log('Hover menu appeared ✅');
    }

    console.log('Mouse hover done ✅');
});

// ─── 2. Keyboard Actions ────────────────────────────────────
test('W7: Keyboard actions', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginPagePractise');

    const username = page.locator('#username');

    // Type character by character (slower, triggers key events)
    await username.pressSequentially('hello', { delay: 50 });

    // Press specific key
    await username.press('Control+a'); // Select all
    await username.press('Backspace'); // Delete

    // Fill (fast, no key events)
    await username.fill('rahulshettyacademy');

    // Keyboard shortcuts
    await page.keyboard.press('Tab'); // Move focus to next field
    await page.keyboard.type('Learning@830$3mK2'); // Type in focused field

    const value = await username.inputValue();
    console.log('Username:', value);
    expect(value).toBe('rahulshettyacademy');
});

// ─── 3. Drag and Drop ───────────────────────────────────────
test('W7: Drag and Drop', async ({ page }) => {
    await page.goto(AUTO_URL);

    // Method 1: dragTo (preferred)
    const source = page.locator('#draggable');
    const target = page.locator('#droppable');

    if (await source.isVisible() && await target.isVisible()) {
        await source.dragTo(target);
        const dropText = await target.textContent();
        console.log('Dropped! Target text:', dropText);
    }

    // Method 2: Mouse drag manually
    // const srcBox = await source.boundingBox();
    // const tgtBox = await target.boundingBox();
    // await page.mouse.move(srcBox.x + srcBox.width/2, srcBox.y + srcBox.height/2);
    // await page.mouse.down();
    // await page.mouse.move(tgtBox.x + tgtBox.width/2, tgtBox.y + tgtBox.height/2);
    // await page.mouse.up();

    console.log('Drag and drop demonstrated ✅');
});

// ─── 4. Scrolling ───────────────────────────────────────────
test('W7: Scrolling', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));

    // Scroll element into view
    const lastCard = page.locator('.card-body').last();
    await lastCard.scrollIntoViewIfNeeded();
    await expect(lastCard).toBeVisible();

    // Scroll by pixels
    await page.mouse.wheel(0, 300); // scroll down 300px

    console.log('Scrolling done ✅');
});

// ─── 5. Multi-tab / New Window Handling ─────────────────────
test('W7: Multi-tab and new window handling', async ({ page, context }) => {
    await page.goto('https://rahulshettyacademy.com/loginPagePractise');

    // Listen for new page BEFORE clicking the link that opens it
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('a[href*="documents"]').click()
    ]);

    // Wait for new tab to load
    await newPage.waitForLoadState('domcontentloaded');

    console.log('Original page URL:', page.url());
    console.log('New page URL:', newPage.url());

    // Read text from new tab
    const text = await newPage.locator('p.im-para').first().textContent().catch(() => '');
    console.log('New page text snippet:', text.substring(0, 80));

    // Extract email from new page (common interview question)
    const emailMatch = text.match(/[\w.]+@[\w.]+\.\w+/);
    if (emailMatch) {
        console.log('Email found:', emailMatch[0]);
        // Type it back in the original page
        await page.bringToFront();
        await page.locator('#username').fill(emailMatch[0]);
    }

    expect(newPage.url()).not.toBe(page.url());
    await newPage.close();
});

// ─── 6. Browser Context - Auth State ────────────────────────
test('W7: Browser Context - save and reuse auth state', async ({ browser }) => {
    // Step 1: Login and save auth state
    const loginContext = await browser.newContext();
    const loginPage    = await loginContext.newPage();

    await loginPage.goto('https://rahulshettyacademy.com/client');
    await loginPage.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await loginPage.getByPlaceholder('enter your passsword').fill('Test1234!');
    await loginPage.getByRole('button', { name: 'Login' }).click();
    await loginPage.waitForLoadState('networkidle');

    // Save auth state (cookies + localStorage)
    await loginContext.storageState({ path: '/tmp/auth.json' });
    console.log('Auth state saved ✅');
    await loginContext.close();

    // Step 2: Use saved auth state — skip login!
    const authContext = await browser.newContext({ storageState: '/tmp/auth.json' });
    const authPage    = await authContext.newPage();

    await authPage.goto('https://rahulshettyacademy.com/client/dashboard/');
    await authPage.waitForLoadState('networkidle');

    console.log('Logged in without re-entering credentials ✅');
    console.log('URL:', authPage.url());

    await authContext.close();
});

// ─── 7. Cookies ─────────────────────────────────────────────
test('W7: Cookies - add, read, delete', async ({ context, page }) => {
    await page.goto('https://www.google.com');

    // Add cookie
    await context.addCookies([{
        name:   'testCookie',
        value:  'playwright123',
        domain: '.google.com',
        path:   '/'
    }]);

    // Read cookies
    const cookies = await context.cookies();
    const myCookie = cookies.find(c => c.name === 'testCookie');
    console.log('My cookie:', myCookie?.value);
    expect(myCookie?.value).toBe('playwright123');

    // Delete specific cookie
    await context.clearCookies();
    const afterClear = await context.cookies();
    console.log('Cookies after clear:', afterClear.length);
});

// ─── 8. Local Storage & Session Storage ─────────────────────
test('W7: LocalStorage and SessionStorage', async ({ page }) => {
    await page.goto('https://www.google.com');

    // Set localStorage
    await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({ name: 'Sriram', role: 'admin' }));
        sessionStorage.setItem('token', 'abc123xyz');
    });

    // Read localStorage
    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user')));
    console.log('LocalStorage user:', user);

    // Read sessionStorage
    const token = await page.evaluate(() => sessionStorage.getItem('token'));
    console.log('SessionStorage token:', token);

    // Clear storage
    await page.evaluate(() => localStorage.clear());

    expect(user.name).toBe('Sriram');
    expect(token).toBe('abc123xyz');
});
