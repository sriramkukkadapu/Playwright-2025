const {test,expect} = require('@playwright/test');

test("Hidden Elements Assertion test",async ({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");


    // await page.pause();

    page.on("dialog", dialog => {
        console.log(dialog.message());
        dialog.accept();
    });

    await page.locator("#alertbtn").click();
    
    await page.locator("#confirmbtn").click();
});

test("Alerts - Alert popup", async ({page}) => 
{
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    
    page.on("dialog", d => {
        console.log(d.type());
        console.log(d.message());
        expect(d.type()).toContain("alert");
        expect(d.message()).toEqual("I am a JS Alert");
        d.accept();
    })
    await page.getByRole("button", {name: "Click for JS Alert"}).click();
    // await page.pause();
})

test("Alerts - Confirm popup", async ({page}) => 
{
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    
    page.on("dialog", d => {
        console.log(d.type());
        console.log(d.message());
        expect(d.type()).toContain("confirm");
        expect(d.message()).toEqual("I am a JS Confirm");
        d.accept();
    })
    await page.getByRole("button", {name: "Click for JS Confirm"}).click();
    // await page.pause();
})


test("Alerts - Prompt popup", async ({page}) => 
{
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    
    page.on("dialog", d => {
        console.log(d.type());
        console.log(d.message());
        expect(d.type()).toContain("prompt");
        expect(d.message()).toEqual("I am a JS prompt");
        d.type("Test Input");
        d.accept();        
    })
    await page.getByRole("button", {name: "Click for JS Prompt"}).click();
    // await page.pause();
})

