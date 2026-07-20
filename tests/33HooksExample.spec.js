const { test, expect } = require('@playwright/test');

test.describe('User Authentication Flow', () => {
  // 1. Runs ONCE before all tests in this block (e.g., Database initialization)
  test.beforeAll(async () => {
    console.log('Connecting to database...');
  });

  // 2. Runs BEFORE EACH test (e.g., Navigating and authenticating)
  test.beforeEach(async ({ page }) => {
    console.log('Navigating to login page...');
    await page.goto("https://rahulshettyacademy.com/client");  
    // Common setup actions like filling login credentials go here
  });

  // 3. First Test Case
  test('Should log in successfully with valid credentials', async ({ page }) => {
    console.log('Running Test 1');
    const userName = page.locator("#userEmail");  
    const password = page.locator("#userPassword");
    const login = page.locator("#login");

    await userName.fill("sriramkukkadapu@gmail.com");
    await password.fill("Test1234!");
    await login.click();
  });

  // 4. Second Test Case
  test('Should show error on empty password', async ({ page }) => {
    const userName = page.locator("#userEmail");  
    const password = page.locator("#userPassword");
    const login = page.locator("#login");
    console.log('Running Test 2');
    
    await userName.fill("sriramkukkadapu@gmail.com");
    await password.clear();
    await login.click();
    // const error = page.locator('#error-message');
    // await expect(error).toBeVisible();
  });

  // 5. Runs AFTER EACH test (e.g., Clearing local storage or cookies)
  test.afterEach(async ({ page }) => {
    console.log('Clearing browser context cookies...');
    await page.context().clearCookies();
  });

  // 6. Runs ONCE after all tests in this block (e.g., Closing database links)
  test.afterAll(async () => {
    console.log('Disconnecting from database.');
  });
});