import { test, expect } from '@playwright/test';

test("Setting BASE URL for test execution",async ({page}) => {
    await page.goto('/');
    // page.goto("https://freelance-learn-automation.vercel.app/login");  
    console.log("Current Page: "+await page.title());
    await page.pause();
})