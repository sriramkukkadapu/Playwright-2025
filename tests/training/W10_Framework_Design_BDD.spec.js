// ============================================================
// WEEK 10 — Framework Design + Cucumber BDD
// Topics: Page Object Model, Data-driven Testing,
//         Reusable Fixtures, Cucumber BDD concepts
// ============================================================

const { test, expect } = require('@playwright/test');
const path = require('path');

// ─── 1. Page Object Model - Why and How ─────────────────────
// POM separates locators and actions from test logic
// Benefits: Reusability, Maintainability, Readability

// Example POM class (inline for demo):
class ProductsPage {
    constructor(page) {
        this.page          = page;
        this.productCards  = page.locator('.card-body');
        this.productTitles = page.locator('.card-body b');
        this.cartBtn       = page.locator("button[routerLink='/dashboard/cart']");
    }

    async waitForProducts() {
        await this.productTitles.last().waitFor({ state: 'visible' });
    }

    async getProductCount() {
        return await this.productCards.count();
    }

    async getAllProductNames() {
        return await this.productTitles.allTextContents();
    }

    async addToCart(productName) {
        const card = this.productCards.filter({ hasText: productName });
        await card.locator("button:has-text('Add To Cart')").click();
    }

    async goToCart() {
        await this.cartBtn.click();
    }
}

test('W10: POM - ProductsPage demo', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');
    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();

    const productsPage = new ProductsPage(page);
    await productsPage.waitForProducts();

    const count = await productsPage.getProductCount();
    const names = await productsPage.getAllProductNames();

    console.log('Products found:', count);
    console.log('Product names:', names);

    expect(count).toBeGreaterThan(0);
    expect(names.length).toBe(count);
});

// ─── 2. Data-Driven Testing ─────────────────────────────────
const loginTestData = [
    { username: 'sriramkukkadapu@gmail.com', password: 'Test1234!',   valid: true,  desc: 'valid credentials' },
    { username: 'wrong@test.com',             password: 'WrongPass!',  valid: false, desc: 'invalid credentials' },
    { username: '',                           password: 'Test1234!',   valid: false, desc: 'empty username' },
];

// Run same test with different data
for (const data of loginTestData) {
    test(`W10: Data-driven login - ${data.desc}`, async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/client');

        await page.getByPlaceholder('email@example.com').fill(data.username);
        await page.getByPlaceholder('enter your passsword').fill(data.password);
        await page.getByRole('button', { name: 'Login' }).click();

        if (data.valid) {
            await page.waitForLoadState('networkidle');
            expect(page.url()).toContain('dashboard');
            console.log(`✅ ${data.desc} — logged in`);
        } else {
            // Expect error message or stay on login page
            const errorMsg = page.locator('[class*="error"], .ng-invalid, .alert');
            await page.waitForTimeout(1500);
            const stayedOnLogin = page.url().includes('client') && !page.url().includes('dashboard');
            console.log(`✅ ${data.desc} — stayed on login: ${stayedOnLogin}`);
            expect(page.url()).not.toContain('dashboard');
        }
    });
}

// ─── 3. Reusable Fixtures ───────────────────────────────────
// Fixtures are the recommended way to share setup/teardown
// In a real project, create a fixtures.js file:
//
// const { test: base } = require('@playwright/test');
// const { POManager } = require('./pageObjects/POManager');
//
// exports.test = base.extend({
//   // Auto fixture — runs for every test
//   logTestName: [async ({}, use, testInfo) => {
//     console.log(`Starting: ${testInfo.title}`);
//     await use();
//     console.log(`Finished: ${testInfo.title}`);
//   }, { auto: true }],
//
//   // Page fixture with pre-navigation
//   loginPage: async ({ page }, use) => {
//     await page.goto('https://rahulshettyacademy.com/client');
//     const poManager = new POManager(page);
//     await use(poManager.getLoginPage());
//   },
//
//   // Authenticated page
//   authenticatedPage: async ({ page }, use) => {
//     await page.goto('https://rahulshettyacademy.com/client');
//     await page.getByPlaceholder('email@example.com').fill('user@test.com');
//     await page.getByPlaceholder('enter your passsword').fill('Test1234!');
//     await page.getByRole('button', { name: 'Login' }).click();
//     await page.waitForLoadState('networkidle');
//     await use(page);
//   }
// });

test('W10: Fixtures concept demo - beforeEach as fixture substitute', async ({ page }) => {
    // This simulates a fixture that sets up login state
    await page.goto('https://rahulshettyacademy.com/client');
    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('dashboard');
    console.log('Fixture: logged in ✅');
});

// ─── 4. test.describe for grouping ──────────────────────────
test.describe('W10: Test organization with describe', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/client');
        await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
        await page.getByPlaceholder('enter your passsword').fill('Test1234!');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForLoadState('networkidle');
    });

    test('Verify dashboard loads', async ({ page }) => {
        await expect(page).toHaveURL(/dashboard/);
        console.log('Dashboard verified ✅');
    });

    test('Verify products are displayed', async ({ page }) => {
        await page.locator('.card-body b').last().waitFor({ state: 'visible' });
        const count = await page.locator('.card-body').count();
        expect(count).toBeGreaterThan(0);
        console.log(`${count} products displayed ✅`);
    });
});

// ─── 5. Cucumber BDD Concepts ───────────────────────────────
// BDD with Cucumber uses feature files (.feature) with Gherkin syntax
// Install: npm install @cucumber/cucumber @playwright/test
//
// Feature file example (login.feature):
// ─────────────────────────────────────
// Feature: User Login
//   As a registered user
//   I want to login to the application
//   So that I can access my account
//
//   Background:
//     Given I am on the login page
//
//   @smoke @login
//   Scenario: Successful login with valid credentials
//     When I enter username "sriramkukkadapu@gmail.com"
//     And I enter password "Test1234!"
//     And I click the Login button
//     Then I should be redirected to the dashboard
//     And I should see "IPHONE X" in the product list
//
//   @negative
//   Scenario: Failed login with invalid credentials
//     When I enter username "wrong@test.com"
//     And I enter password "WrongPass"
//     And I click the Login button
//     Then I should see an error message
//     And I should remain on the login page
// ─────────────────────────────────────
//
// Step definitions (loginSteps.js):
// ─────────────────────────────────────
// const { Given, When, Then } = require('@cucumber/cucumber');
// const { expect } = require('@playwright/test');
//
// Given('I am on the login page', async function() {
//   await this.page.goto('https://rahulshettyacademy.com/client');
// });
//
// When('I enter username {string}', async function(username) {
//   await this.page.getByPlaceholder('email@example.com').fill(username);
// });
//
// When('I enter password {string}', async function(password) {
//   await this.page.getByPlaceholder('enter your passsword').fill(password);
// });
//
// When('I click the Login button', async function() {
//   await this.page.getByRole('button', { name: 'Login' }).click();
// });
//
// Then('I should be redirected to the dashboard', async function() {
//   await this.page.waitForURL(/dashboard/);
//   expect(this.page.url()).toContain('dashboard');
// });

test('W10: BDD concepts demo - structured test steps', async ({ page }) => {
    // Mimicking BDD Given/When/Then structure without Cucumber

    // GIVEN: I am on the login page
    await page.goto('https://rahulshettyacademy.com/client');
    console.log('GIVEN: On login page');

    // WHEN: I enter credentials and submit
    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    console.log('WHEN: Submitted login form');

    // THEN: Dashboard is displayed
    await page.waitForURL(/dashboard/);
    await expect(page).toHaveURL(/dashboard/);
    console.log('THEN: Dashboard loaded ✅');

    // AND: Products are visible
    await page.locator('.card-body b').last().waitFor({ state: 'visible' });
    const count = await page.locator('.card-body').count();
    expect(count).toBeGreaterThan(0);
    console.log('AND: Products visible ✅');
});

// ─── 6. Tags for test filtering ─────────────────────────────
// Run tagged tests: npx playwright test --grep "@smoke"
// Skip tagged tests: npx playwright test --grep-invert "@slow"

test('W10: @smoke tag demo', async ({ page }) => {
    // Tag in test title: npx playwright test --grep "smoke"
    await page.goto('https://rahulshettyacademy.com/client');
    await expect(page).toHaveURL(/client/);
    console.log('Smoke test passed ✅');
});
