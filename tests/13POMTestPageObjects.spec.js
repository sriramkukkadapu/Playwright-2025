const {test,expect} = require('@playwright/test');
const { LoginPage } = require('./pageObjects/LoginPage');
const { DashboardPage } = require('./pageObjects/DashboardPage');

// General Page Object approach - instantiate page objects directly without POManager

test('End to end journey with Page Objects (without POManager)', async ({page}) => 
    {          
        // Instantiate page objects directly
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        
        // Login flow
        await loginPage.gotoLoginPage();
        await loginPage.validLogin("sriramkukkadapu@gmail.com","Test1234!");
       
        // Add product to cart
        await dashboardPage.searchProductAndAddtoCart("ZARA COAT 3");

        await expect(page.locator("button[routerLink='/dashboard/cart'] label")).not.toBeEmpty();
        const cartSize = await page.locator("button[routerLink='/dashboard/cart'] label").textContent();
        console.log("No of items in cart: "+cartSize);

        // Navigate to cart
        const cartBtn = page.locator("button[routerLink='/dashboard/cart']");
        await cartBtn.click();
        await page.locator("div li").first().waitFor();
        expect (await page.locator("'ZARA COAT 3'").isVisible()).toBeTruthy();

        // Checkout
        await page.getByRole("button", {name: "Checkout"}).click();
        
        await page.locator("div[class*='user__name']  input[class*='pristine']").fill("sriramkukkadapu@gmail.com");
        await page.locator("//span[@class='numberCircle']/../../input").fill("666");
        await page.getByPlaceholder("Select Country").pressSequentially("India");
        await page.getByRole("button", {name: "India"}).nth(1).click();
        
        // Place order
        await page.getByText("Place Order").click();
        await page.locator("text= Thankyou for the order. ").isVisible();
        let orderId = await page.locator("//td[@class='em-spacer-1']/label[@class='ng-star-inserted']").textContent();
        orderId = orderId.replaceAll('|','').trim();
        console.log("Order Id: "+orderId);

        // Verify order
        await page.locator("label[routerLink='/dashboard/myorders']").click();
        const viewBtn = page.locator("//th[text()='"+orderId+"']/../td/button[text()='View']");
        await viewBtn.click();
        await expect(page.locator("div[class='col-text -main']")).toHaveText(orderId);
        
});
