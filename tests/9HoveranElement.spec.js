const {test,expect} = require('@playwright/test');

test("Hover example 1",async ({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#mousehover").hover();
    await page.pause();
});

test("Hover Example 2", async function({page}){
    page.goto("https://freelance-learn-automation.vercel.app/login");
    await page.getByPlaceholder("Enter Email").fill("admin@email.com");
    await page.getByPlaceholder("Enter Password").fill("admin@123");
    await page.getByRole("button", {type:'submit'}).click();

    await page.locator(".nav-menu-item-manage").hover();
    await page.locator("a[href='/course/manage']").click();

    await page.pause();
})
