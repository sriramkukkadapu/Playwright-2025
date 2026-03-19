const {test,expect, chromium} = require('@playwright/test');

test.describe.configure({ mode: 'parallel' });

test('1 - Multiple browser Contexts', async () => 
    {               
        const browser = await chromium.launch();
        const context1 = await browser.newContext();
        const context2 = await browser.newContext();

        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        await page1.goto("https://www.google.com");  
        await page2.goto("https://www.amazon.in");  

        // await page2.waitForLoadState('networkidle');

        context1.close();
        context2.close();
});


test('2 - Multiple browser Contexts with default browser object', async ({browser}) => 
    {               
        // const browser = await chromium.launch();
        const context1 = await browser.newContext();
        const context2 = await browser.newContext();

        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        await page1.goto("https://www.google.com");  
        await page2.goto("https://www.amazon.in");  

        // await page2.waitForLoadState('networkidle');

        context1.close();
        context2.close();
});

