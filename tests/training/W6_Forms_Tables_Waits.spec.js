// ============================================================
// WEEK 6 — Forms, Tables & Waits
// Topics: Web Tables, Checkboxes, Dropdowns, Form Submission,
//         Auto-waits, Explicit Waits, Alerts, File Uploads
// ============================================================

const { test, expect } = require('@playwright/test');

const PRACTISE_URL = 'https://rahulshettyacademy.com/loginPagePractise';
const AUTO_URL     = 'https://rahulshettyacademy.com/AutomationPractice/';

// ─── 1. Checkboxes ──────────────────────────────────────────
test('W6: Checkboxes', async ({ page }) => {
    await page.goto(PRACTISE_URL);

    const terms = page.locator('#terms');

    // Check state
    const isChecked = await terms.isChecked();
    console.log('Initially checked:', isChecked); // false

    // Check it
    await terms.check();
    await expect(terms).toBeChecked();

    // Uncheck it
    await terms.uncheck();
    await expect(terms).not.toBeChecked();

    // Click (toggles)
    await terms.click();
    await expect(terms).toBeChecked();

    console.log('Checkbox interactions done ✅');
});

// ─── 2. Radio Buttons ───────────────────────────────────────
test('W6: Radio Buttons', async ({ page }) => {
    await page.goto(PRACTISE_URL);

    const userRadio    = page.locator('input[value="user"]');
    const teacherRadio = page.locator('input[value="teacher"]');

    // Select user radio
    await userRadio.click();
    await expect(userRadio).toBeChecked();
    await expect(teacherRadio).not.toBeChecked();

    // Switch to teacher
    await teacherRadio.click();
    await expect(teacherRadio).toBeChecked();
    await expect(userRadio).not.toBeChecked();

    console.log('Radio buttons verified ✅');
});

// ─── 3. Dropdowns (select element) ──────────────────────────
test('W6: Dropdowns - select element', async ({ page }) => {
    await page.goto(PRACTISE_URL);

    const dropdown = page.locator('select.form-control');

    // Select by value
    await dropdown.selectOption('consult');
    let selected = await dropdown.inputValue();
    console.log('Selected (by value):', selected);
    expect(selected).toBe('consult');

    // Select by label/text
    await dropdown.selectOption({ label: 'Teacher' });
    selected = await dropdown.inputValue();
    console.log('Selected (by label):', selected);

    // Select by index
    await dropdown.selectOption({ index: 0 });
    selected = await dropdown.inputValue();
    console.log('Selected (by index 0):', selected);

    // Get all options
    const options = await dropdown.locator('option').allTextContents();
    console.log('All options:', options);
});

// ─── 4. Web Tables ──────────────────────────────────────────
test('W6: Web Tables - read and interact', async ({ page }) => {
    await page.goto(AUTO_URL);

    const table = page.locator('.table-responsive table');
    const rows  = table.locator('tbody tr');
    const count = await rows.count();

    console.log('Total rows:', count);

    // Read all rows
    for (let i = 0; i < count; i++) {
        const cols = rows.nth(i).locator('td');
        const colCount = await cols.count();
        const rowData = [];
        for (let j = 0; j < colCount; j++) {
            rowData.push((await cols.nth(j).textContent()).trim());
        }
        console.log(`Row ${i + 1}:`, rowData);
    }

    // Find specific cell
    const courseRow = table.locator('tr', { hasText: 'Selenium Webdriver' });
    if (await courseRow.count() > 0) {
        const price = await courseRow.locator('td').nth(2).textContent();
        console.log('Selenium price:', price);
    }

    expect(count).toBeGreaterThan(0);
});

// ─── 5. Auto-waits vs Explicit Waits ────────────────────────
test('W6: Auto-waits and Explicit Waits', async ({ page }) => {
    await page.goto(AUTO_URL);

    // ✅ Auto-wait — Playwright waits automatically for most actions
    await page.locator('#displayed-text').waitFor({ state: 'visible' });

    // waitForSelector — legacy, prefer locator.waitFor()
    await page.waitForSelector('#displayed-text', { state: 'visible' });

    // waitForURL
    await page.goto('https://rahulshettyacademy.com/loginPagePractise');
    await page.locator('#signInBtn').click();
    // await page.waitForURL(/angularpractice/); // wait for navigation

    // waitForLoadState
    await page.goto(AUTO_URL);
    await page.waitForLoadState('networkidle'); // all network quiet
    await page.waitForLoadState('domcontentloaded'); // DOM ready
    await page.waitForLoadState('load'); // page fully loaded

    // waitForTimeout — avoid! use only when absolutely necessary
    // await page.waitForTimeout(2000); // ❌ flaky

    // waitForFunction — custom condition
    await page.waitForFunction(() => document.title.length > 0);

    console.log('All wait types demonstrated ✅');
    expect(page.url()).toContain('AutomationPractice');
});

// ─── 6. Alerts, Confirms, Prompts ───────────────────────────
test('W6: Alerts and Dialogs', async ({ page }) => {
    await page.goto(AUTO_URL);

    // Handle alert BEFORE triggering it
    page.once('dialog', async dialog => {
        console.log('Alert text:', dialog.message());
        console.log('Dialog type:', dialog.type());
        await dialog.accept();
    });

    await page.locator('#alertbtn').click();

    // Handle confirm dialog
    page.once('dialog', async dialog => {
        console.log('Confirm:', dialog.message());
        await dialog.accept(); // or dialog.dismiss() to cancel
    });

    // Click confirm button if exists
    const confirmBtn = page.locator('#confirmbtn');
    if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
    }

    console.log('Dialog handling done ✅');
});

// ─── 7. Hide/Show elements ──────────────────────────────────
test('W6: Hidden and Visible Elements', async ({ page }) => {
    await page.goto(AUTO_URL);

    const textField = page.locator('#displayed-text');

    // Initially visible
    await expect(textField).toBeVisible();

    // Hide it
    await page.locator('#hide-textbox').click();
    await expect(textField).toBeHidden();

    // Show it again
    await page.locator('#show-textbox').click();
    await expect(textField).toBeVisible();

    console.log('Visibility toggle verified ✅');
});

// ─── 8. Form Submission ─────────────────────────────────────
test('W6: Form submission - fill and submit', async ({ page }) => {
    await page.goto(PRACTISE_URL);

    // Fill form
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('#password').fill('Learning@830$3mK2');

    // Select dropdown
    await page.locator('select.form-control').selectOption('consult');

    // Check radio
    await page.locator('input[value="user"]').click();

    // Check terms
    await page.locator('#terms').check();
    await expect(page.locator('#terms')).toBeChecked();

    // Submit
    await page.locator('#signInBtn').click();

    // Wait for navigation
    await page.waitForURL(/angularpractice/);
    expect(page.url()).toContain('angularpractice');
    console.log('Form submitted successfully ✅');
});
