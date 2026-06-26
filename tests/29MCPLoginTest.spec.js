const { test, expect } = require('@playwright/test');
const { POManager } = require('./pageObjects/POManager');

const username = 'rahulshettyacademy';
const password = 'Learning@830$3mK2';
const expectedProduct = 'iphone X';

test('Login and verify iPhone X product on shop page', async ({ page }) => {

    const poManager = new POManager(page);
    const loginPractisePage = poManager.getLoginPractisePage();
    const shopPage = poManager.getShopPage();

    // ── Step 1: Navigate to login page 
    await loginPractisePage.goto();

    // ── Step 2: Enter credentials, check terms and sign in 
    await loginPractisePage.login(username, password);

    // ── Step 3: Verify navigation to shop page
    await shopPage.waitForPageLoad();

    await expect(page).toHaveURL(/angularpractice\/shop/);
    await expect(page).toHaveTitle('ProtoCommerce');

    // ── Step 4: Verify iPhone X is present on the page 
    const isPresent = await shopPage.isProductPresent(expectedProduct);
    expect(isPresent, `Expected product "${expectedProduct}" to be visible on shop page`).toBeTruthy();
});
