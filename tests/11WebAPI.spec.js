const {test,expect, request} = require('@playwright/test');
const loginPayload = {"userEmail":"sriramkukkadapu@gmail.com","userPassword":"Test1234!"};
const createOrderPayload = {"orders":[{"country":"Cuba","productOrderedId":"6960eac0c941646b7a8b3e68"}]};
let token;
let orderId;

test.beforeAll(async () => {
    const apiContext = await request.newContext(); //get a fresh api context

    //Login API
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
        data: loginPayload
    });

    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    console.log("Login Response full Json: "+JSON.stringify(loginResponseJson));
    console.log("Login Response token: "+loginResponseJson.token);
    token = loginResponseJson.token;

    //Create Order API
        const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
        data: createOrderPayload,
        headers:{
                    'authorization': token,
                    'content-type': 'application/json'
        }
    });
    
    expect(orderResponse.ok()).toBeTruthy();
    const orderResponseJson = await orderResponse.json();
    console.log("Order Response full Json: "+JSON.stringify(orderResponseJson));
    orderId = orderResponseJson.orders[0];
    console.log("Order Id: "+orderId);

});


test("Verify if Order created is shown",async ({page}) =>
{
        page.addInitScript(value => {
            window.localStorage.setItem('token',value);
        },token);

        // await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
        await page.goto("https://rahulshettyacademy.com/client");          
        await page.locator("button[routerLink='/dashboard/myorders']").click();
        const viewBtn = page.locator("//th[text()='"+orderId+"']/../td/button[text()='View']");
        await viewBtn.click();
        await expect(page.locator("div[class='col-text -main']")).toHaveText(orderId);

});
