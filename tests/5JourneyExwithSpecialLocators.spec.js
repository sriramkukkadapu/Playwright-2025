const {test,expect} = require('@playwright/test');

test('End to end journey with Special locators', async ({browser,page}) => 
    {           

        await page.goto("https://rahulshettyacademy.com/client");  

        await page.getByPlaceholder("email@example.com").fill("sriramkukkadapu@gmail.com");
        await page.getByPlaceholder("enter your passsword").fill("Test1234!");
        await page.getByRole("button", {name: "Login"}).click();

        await page.waitForLoadState('networkidle');
        await page.locator(".card-body b").last().waitFor( {state: 'visible'}); //wait for this element to be visible

        await page.locator(".card-body").filter({hasText: "ZARA COAT 3"}).getByRole("button", {name: "Add To Cart"}).click();

        await page.getByRole("listitem").getByRole("button", {name: "Cart"}).click();

        await expect(page.locator("button[routerLink='/dashboard/cart'] label")).not.toBeEmpty(); //until '1' is added to cart text
        const cartSize = await page.locator("button[routerLink='/dashboard/cart'] label").textContent();
        console.log("No of items in cart: "+cartSize);

        const cartBtn = page.locator("button[routerLink='/dashboard/cart']");
        await cartBtn.click();
        await page.locator("div li").first().waitFor();
        expect (await page.locator("'ZARA COAT 3'").isVisible()).toBeTruthy();

        await page.getByRole("button", {name: "Checkout"}).click();
        
        await page.locator("div[class*='user__name']  input[class*='pristine']").fill("sriramkukkadapu@gmail.com");
        await page.locator("//span[@class='numberCircle']/../../input").fill("666");
        await page.getByPlaceholder("Select Country").pressSequentially("India");
        await page.getByRole("button", {name: "India"}).nth(1).click();
        
        await page.getByText("Place Order").click();
        await page.locator("text= Thankyou for the order. ").isVisible();
        let orderId = await page.locator("//td[@class='em-spacer-1']/label[@class='ng-star-inserted']").textContent();
        orderId = orderId.replaceAll('|','').trim();
        console.log("Order Id: "+orderId);

        await page.locator("label[routerLink='/dashboard/myorders']").click();
        const viewBtn = page.locator("//th[text()='"+orderId+"']/../td/button[text()='View']");
        await viewBtn.click();
        await expect(page.locator("div[class='col-text -main']")).toHaveText(orderId);
        
});




