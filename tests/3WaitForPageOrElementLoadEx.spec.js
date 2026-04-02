const {test,expect} = require('@playwright/test');

test('Automate Journey Login add product place order etc', async ({browser,page}) => 
    {           
        const userName = await page.locator("#userEmail");  
        const password = await page.locator("#userPassword");
        const login = await page.locator("#login");

        await page.goto("https://rahulshettyacademy.com/client");  

        await userName.fill("sriramkukkadapu@gmail.com");
        await password.fill("Test1234!");
        await login.click();

        // await page.waitForLoadState('networkidle');
        //or
        await page.locator(".card-body b").last().waitFor( {state: 'visible'}); //wait for this element to be visible

        const productName = "ZARA COAT 3";
        const titles = await page.locator(".card-body b").allTextContents();

        const products = page.locator(".card-body");
        console.log(products);
        const count = await products.count();
        console.log("====> Products count: "+count);

        for(let i=0;i<count;i++){
            console.log(await products.nth(i).locator("b").textContent());
            if(await products.nth(i).locator("b").textContent() === productName){
                await products.nth(i).locator("//button[text()=' Add To Cart']").click();;
                break;
            }
        }

        await expect(page.locator("button[routerLink='/dashboard/cart'] label")).not.toBeEmpty(); //until '1' is added to cart text
        const cartSize = await page.locator("button[routerLink='/dashboard/cart'] label").textContent();
        console.log("No of items in cart: "+cartSize);

        const cartBtn = page.locator("button[routerLink='/dashboard/cart']");
        await cartBtn.click();
        // await page.locator("div li").first().waitFor();
        expect (await page.locator("'ZARA COAT 3'").isVisible()).toBeTruthy();

        await page.locator("text=Checkout").click();
        // await page.locator("//button[text()='Checkout']").click();
        await page.locator("div[class*='user__name']  input[class*='pristine']").fill("sriramkukkadapu@gmail.com");
        await page.locator("//span[@class='numberCircle']/../../input").fill("666");
        await page.locator("input[placeholder='Select Country']").pressSequentially("India");
        await page.locator("//span[text()=' India']").click();
        await page.locator("text=Place Order ").click();
        await page.locator("text= Thankyou for the order. ").isVisible();
        let orderId = await page.locator("//td[@class='em-spacer-1']/label[@class='ng-star-inserted']").textContent();
        orderId = orderId.replaceAll('|','').trim();
        console.log("Order Id: "+orderId);

        await page.locator("label[routerLink='/dashboard/myorders']").click();
        const viewBtn = page.locator("//th[text()='"+orderId+"']/../td/button[text()='View']");
        await viewBtn.click();
        await expect(page.locator("div[class='col-text -main']")).toHaveText(orderId);
        
});




