import { test, expect } from '@playwright/test';

test("Handle Multiple browser tabs",async ({browser}) => {
    const context =  await browser.newContext();
    const page = await context.newPage();
    page.goto("https://freelance-learn-automation.vercel.app/login");

    const [newPage] = await Promise.all(
      [
        context.waitForEvent("page"),
        page.locator("//a[contains(@href,'facebook')][1]").first().click()
      ]
    );
    
    await newPage.locator("//input[@name='email' and @type='text']").fill("sriramkukkadapu@gmail.com");

    await page.pause();
})