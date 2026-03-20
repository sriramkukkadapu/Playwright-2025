const {test,expect} = require('@playwright/test');

test.describe.configure({ mode: 'parallel' });

test('2 - Calling Page directly', async ({page}) => 
    {               
        await page.goto("https://www.google.com");  
        console.log("Title for Google page: " + await page.title());
        await expect(page).toHaveTitle("Google");
});

test('1 - Browser Context declaration', async ({browser}) => 
    {
        const context = await browser.newContext();
        const page = await context.newPage();                  
        await page.goto("https://www.facebook.com");
});

test('First Playwright test - 2', async ({browser,page}) => 
    {               
        await page.goto("https://www.flipkart.com", {waitUntil: 'domcontentloaded'});  
});

