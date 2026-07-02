const {test,expect} = require('@playwright/test');

test("Hidden Elements Assertion test",async ({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#show-textbox").click();
    await expect(page.locator("#displayed-text")).toBeVisible();

});
