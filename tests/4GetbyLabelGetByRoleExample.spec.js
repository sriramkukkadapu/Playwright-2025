const {test,expect} = require('@playwright/test');

test('Get by label & Get by role example test', async ({page}) => 
    {           

        await page.goto("https://rahulshettyacademy.com/angularpractice/");  
        await page.getByLabel("Check me out if you Love IceCreams!").check(); //selecting checkbox with label
        await page.getByLabel("Employed").check(); //selecting radiobutton with label
        await page.getByLabel("Gender").selectOption("Male"); //selecting option from dropdown     

        await page.getByPlaceholder("Password").fill("Test1234!"); 
        await page.getByRole("button", {name: "Submit"}).click(); //selecting button with role and name
        expect(await page.getByText("Success! The Form has been submitted successfully!.").isVisible()).toBeTruthy();
        await page.getByRole("link", {name: "Shop"}).click();
        await page.locator("app-card").filter({hasText: "iphone X"}).getByRole("button", {name: "Add"}).click();

        // await page.pause();
});




