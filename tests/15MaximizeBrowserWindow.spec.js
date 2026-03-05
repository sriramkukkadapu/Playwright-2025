const {test,expect, chromium} = require('@playwright/test');

// test.describe.configure({ mode: 'parallel' });

// test.use({viewport: {width: 1500, height: 700}});

test('1 - After maximizing screen to max viewport size', async ({page}) => 
    {
        await page.goto("https://www.google.co.in");
        //1728x864
        console.log(await page.viewportSize().width);
        console.log(await page.viewportSize().height);
});


