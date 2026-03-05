const {test,expect} = require('@playwright/test');

test('Calendar Handling in Pw', async ({page}) => 
    {           
        const month = "12";
        const date = "18";
        const year = "2027";
        const expectedList =  [month, date, year];
        // await page.goto("https://rahulshettyacademy.com/seleniumPractise/");
        await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
        await page.locator(".react-date-picker__inputGroup").click();
        await page.locator(".react-calendar__navigation__label").click();
        await page.locator(".react-calendar__navigation__label").click();
        await page.getByRole("button", {name: "2027"}).click();
        await page.locator(".react-calendar__year-view__months__month").nth(Number(month)-1).click();
        await page.locator("//abbr[text()='18']").click();

        const actualDateSelected = await page.locator(".react-date-picker__inputGroup input[name='date']").getAttribute("value");
        console.log("Date selected: "+ actualDateSelected);

        const items = await page.locator(".react-date-picker__inputGroup__input").all();
        console.log("Total items: "+items.length);
        for(var i=0; i<items.length; i++){
            const actualValue = await items[i].getAttribute("value");
            // const actualValue = await items[i].inputValue();
            expect (actualValue).toEqual(expectedList[i]);
        }

        // expect (console.log(await items[0].getAttribute("value"))).toEqual(month);
        // expect (console.log(await items[1].getAttribute("value"))).toEqual(date);
        // expect (console.log(await items[2].getAttribute("value"))).toEqual(year);
        
        
});





