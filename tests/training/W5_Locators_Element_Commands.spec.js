// ============================================================
// WEEK 5 — Locators & Element Commands
// Topics: Text, Role, CSS, XPath, Role-based, Filtered,
//         Chained, Auto-waiting, Codegen, Dynamic Elements
// ============================================================

const { test, expect } = require('@playwright/test');

const URL = 'https://rahulshettyacademy.com/loginPagePractise';

// ─── 1. CSS Locators ────────────────────────────────────────
test('W5: CSS Locators', async ({ page }) => {
    await page.goto(URL);

    // By ID
    const username = page.locator('#username');

    // By class
    const signInBtn = page.locator('.btn-primary');

    // By attribute
    const passwordInput = page.locator('[type="password"]');

    // By tag + attribute
    const radioUser = page.locator('input[value="user"]');

    // Descendant: parent > child
    const formInput = page.locator('form input#username');

    await expect(username).toBeVisible();
    await expect(signInBtn).toBeVisible();
    await expect(passwordInput).toBeVisible();

    console.log('CSS locators verified ✅');
});

// ─── 2. XPath Locators ──────────────────────────────────────
test('W5: XPath Locators', async ({ page }) => {
    await page.goto(URL);

    // Absolute XPath (avoid — brittle)
    // page.locator('//html/body/div/form/input')

    // Relative XPath (preferred)
    const username = page.locator('//input[@id="username"]');

    // By text
    const signInText = page.locator('//input[@value="Sign In"]');

    // contains()
    const btn = page.locator('//input[contains(@class,"btn")]');

    // ancestor / sibling / child axes
    const label = page.locator('//input[@id="username"]/parent::div');

    await expect(username).toBeVisible();
    console.log('XPath locators verified ✅');
});

// ─── 3. Role-based Locators (Recommended) ───────────────────
test('W5: Role-based Locators - getByRole', async ({ page }) => {
    await page.goto(URL);

    // button
    const signIn = page.getByRole('button', { name: 'Sign In' });

    // textbox
    const usernameBox = page.getByRole('textbox', { name: 'Username' });

    // radio
    const userRadio = page.getByRole('radio', { name: 'User' });

    // checkbox
    const termsCheck = page.getByRole('checkbox');

    // link
    // const forgotLink = page.getByRole('link', { name: 'Forgot your password?' });

    await expect(signIn).toBeVisible();
    await expect(termsCheck).toBeVisible();
    console.log('Role locators verified ✅');
});

// ─── 4. Text & Label Locators ───────────────────────────────
test('W5: getByText, getByLabel, getByPlaceholder', async ({ page }) => {
    await page.goto(URL);

    // getByPlaceholder — best for inputs with placeholder text
    const username = page.getByPlaceholder('Username');
    const password = page.getByPlaceholder('Password');

    // getByText — for visible text on page
    // getByLabel — matches input associated with a label

    await expect(username).toBeVisible();
    await expect(password).toBeVisible();

    await username.fill('testuser');
    await password.fill('testpass');

    const usernameValue = await username.inputValue();
    console.log('Username value:', usernameValue);

    expect(usernameValue).toBe('testuser');
});

// ─── 5. Filtered Locators ───────────────────────────────────
test('W5: Filtered Locators - filter()', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').last().waitFor({ state: 'visible' });

    // filter by text content
    const zaraCard = page.locator('.card-body').filter({ hasText: 'ZARA COAT 3' });
    await expect(zaraCard).toBeVisible();

    // filter by child element
    const cardsWithBtn = page.locator('.card-body').filter({
        has: page.locator('button.btn-primary')
    });
    const count = await cardsWithBtn.count();
    console.log('Cards with button:', count);
    expect(count).toBeGreaterThan(0);
});

// ─── 6. Chained Locators ────────────────────────────────────
test('W5: Chained Locators', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').last().waitFor({ state: 'visible' });

    // Chain: first find the card, then find button inside it
    const zaraCard   = page.locator('.card-body').filter({ hasText: 'ZARA COAT 3' });
    const addToCart  = zaraCard.locator('button', { hasText: 'Add To Cart' });

    await expect(addToCart).toBeVisible();
    console.log('Chained locator found Add To Cart inside ZARA card ✅');
});

// ─── 7. nth(), first(), last() ──────────────────────────────
test('W5: nth(), first(), last() selectors', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').last().waitFor({ state: 'visible' });

    const products = page.locator('.card-body b');

    const firstProduct = await products.first().textContent();
    const lastProduct  = await products.last().textContent();
    const secondProduct = await products.nth(1).textContent();
    const allProducts  = await products.allTextContents();

    console.log('First:', firstProduct);
    console.log('Second:', secondProduct);
    console.log('Last:', lastProduct);
    console.log('All:', allProducts);

    expect(allProducts.length).toBeGreaterThan(0);
});

// ─── 8. Auto-waiting Behaviour ──────────────────────────────
test('W5: Auto-waiting - Playwright waits automatically', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginPagePractise');

    // Playwright auto-waits for elements to be:
    // - Attached to DOM
    // - Visible
    // - Stable (not animating)
    // - Enabled
    // - Editable (for fill/type)

    // No need for explicit waits in most cases!
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('#password').fill('Learning@830$3mK2');
    await page.locator('#terms').click();
    await page.locator('#signInBtn').click();

    // waitForURL — explicit wait when needed
    await page.waitForURL(/angularpractice/);
    expect(page.url()).toContain('angularpractice');
});

// ─── 9. Dynamic Elements ────────────────────────────────────
test('W5: Handling Dynamic Elements', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginPagePractise');

    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('#password').fill('Learning@830$3mK2');
    await page.locator('#terms').click();
    await page.locator('#signInBtn').click();
    await page.waitForURL(/angularpractice/);

    // Dynamic list — wait for items to appear
    const items = page.locator('app-card h4.card-title');
    await items.first().waitFor({ state: 'visible' });

    const count = await items.count();
    console.log('Dynamic items loaded:', count);

    // Loop through dynamic list
    for (let i = 0; i < count; i++) {
        const text = await items.nth(i).textContent();
        console.log(`  Product ${i + 1}: ${text.trim()}`);
    }

    expect(count).toBeGreaterThan(0);
});
