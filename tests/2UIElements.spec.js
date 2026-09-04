const {test,expect} = require('@playwright/test');

test('1 - UI Elements - Login Example', async ({page}) => 
    {           
        const userName =  page.locator("#username");  
        const password =  page.locator("#password");
        const signInBtn =  page.locator("#signInBtn");

        await page.goto("https://rahulshettyacademy.com/loginpagePractise/", { waitUntil: 'domcontentloaded' });  

        await userName.fill("sriramkukkadapu@gmail.com");
        await password.fill("sriramk1");
        await signInBtn.click();

        await userName.clear();
        await password.clear();
        await signInBtn.click();

        //it throws error on UI capture and assert the error msg
        const errorMsgLocator = page.locator("//div[@style='display: block;']");
        await expect(errorMsgLocator).toContainText("Empty username/password.");
        console.log("===> Error message: "+await errorMsgLocator.textContent());

        await userName.fill("rahulshettyacademy");
        await password.fill("Learning@830$3mK2");
        await signInBtn.click();

        //multiple elements
        console.log(await page.locator(".card-body .card-title").first().textContent());
        console.log(await page.locator(".card-body .card-title").nth(0).textContent());
        console.log(await page.locator(".card-body .card-title").last().textContent());

        console.log(await page.locator(".card-body .card-title").allTextContents());
});



test('2 - Select and Checkbox Examples', async ({page}) => 
    {           
        const userName =  page.locator("#username");  
        const password =  page.locator("#password");
        const dropdown =  page.locator("select.form-control");
        const signInBtn =  page.locator("#signInBtn");
        const userCheckbox =  page.locator("//input[@id='usertype' and @value='user']");
        const okBtnAlertBox =  page.locator("#okayBtn");
        const modal = page.locator("#myModal");
        const terms =  page.locator("#terms");
        const documentsLink = page.locator("a[href*='documents']"); // //a[contains(@href,'documents')]");

        await page.goto("https://rahulshettyacademy.com/loginpagePractise/", { waitUntil: 'domcontentloaded' });

        await userName.fill("sriramkukkadapu@gmail.com");
        await password.fill("sriramk1");
        await dropdown.selectOption("Consultant");

        await userCheckbox.click();
        await expect(userCheckbox).toBeChecked();
        await okBtnAlertBox.click();
        // The alert box is a Bootstrap fade modal — clicking #okayBtn while it's
        // still fading in can get swallowed, leaving it open and blocking the
        // Sign In button underneath. Wait for it to actually close, retrying the
        // click once if it doesn't, instead of relying on the low-level click's
        // own retry loop (which can spin for the whole test timeout).
        try {
            await modal.waitFor({ state: 'hidden', timeout: 5000 });
        } catch {
            await okBtnAlertBox.click();
            await modal.waitFor({ state: 'hidden' });
        }
        // await page.pause();
        // await terms.check();
        console.log("is terms checked: "+await terms.isChecked());
        expect(await terms.isChecked()).toBeFalsy();
        await signInBtn.click();
        await expect(documentsLink).toHaveAttribute("class","blinkingText");

});



test('3 - Child window handling', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();                  

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/", { waitUntil: 'domcontentloaded' });  
    const documentsLink = page.locator("a[href*='documents']"); // //a[contains(@href,'documents')]");

    //here waiting for new page & clicking should be tied with a promise
    const [newPage] = await Promise.all([ //all actions inside this gets executed in parallel
     context.waitForEvent('page'), //wait for new page to be created
     documentsLink.click() //clicking this opens new tab/page
    ]) //comes out of this block until all steps completed, new page is assigned to variable

    const redTextOnNewPage = newPage.locator("p[class='im-para red']");
    const text = await redTextOnNewPage.textContent()
    console.log(text);

    const domain = text.split("@")[1].split(" ")[0];
    console.log("Domain: "+domain);

    await page.locator("#username").fill(domain);
    console.log("Username: " + await page.locator("#username").inputValue());
})



