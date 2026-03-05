const {test,expect, request} = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const loginPayload = {"userEmail":"sriramkukkadapu@gmail.com","userPassword":"Test1234!"};
const createOrderPayload = {"orders":[{"country":"Cuba","productOrderedId":"6960eac0c941646b7a8b3e68"}]};

let response;
let token;
let orderId;

test.beforeAll(async () => {
    
            const apiContext = await request.newContext(); //get a fresh api context
            const apiUtils = new APIUtils(apiContext,loginPayload); 
            response = await apiUtils.createOrder(createOrderPayload);
            orderId = await response.orderId;
            console.log("Order id in the testscript: "+orderId);
});


test("Verify if Order created is shown",async ({page}) =>
{
        await page.addInitScript(value => {
            window.localStorage.setItem('token',value);
        },response.token);

        // await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
        await page.goto("https://rahulshettyacademy.com/client");          
        await page.locator("button[routerLink='/dashboard/myorders']").click();
        const viewBtn = page.locator("//th[text()='"+response.orderId+"']/../td/button[text()='View']");
        await viewBtn.click();
        await expect(page.locator("div[class='col-text -main']")).toHaveText(response.orderId);

});
