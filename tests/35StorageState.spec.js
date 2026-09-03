const { test, expect } = require('@playwright/test');

test('35 - Use logged-in Storage State to find Sauce Labs Backpack price', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'domcontentloaded' });

    const price = await page
        .locator('.inventory_item', { hasText: 'Sauce Labs Backpack' })
        .locator('.inventory_item_price')
        .textContent();

    console.log("Sauce Labs Backpack price: " + price);
    expect(price).toBe('$29.99');
});
