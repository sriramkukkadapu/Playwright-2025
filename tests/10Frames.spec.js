const {test,expect} = require('@playwright/test');

test("1. Frames using Frame Locator",async ({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    
    //Method 1 - using page.frameLocator
    const subPage = page.frameLocator("#courses-iframe");
    subPage.locator("li a[href='lifetime-access']:visible").click();

    const text = await subPage.locator(".text h2").textContent();
    console.log(text);
    console.log("No of Subscribers: "+text.split(" ")[1].trim());

    await page.locator("#alertbtn").click();
});

test("2. Frames using Frame Name",async ({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    
    //Method 1 - using page.frameLocator
    const subPage = page.frame("iframe-name");
    subPage.locator("li a[href='lifetime-access']:visible").click();

    const text = await subPage.locator(".text h2").textContent();
    console.log(text);
    console.log("No of Subscribers: "+text.split(" ")[1].trim());

    await page.locator("#alertbtn").click();
});

test("3. Frames - Java docs example",async ({page}) =>
{
    await page.goto("https://docs.oracle.com/javase/8/docs/api/");
    
    //Method 1 - using page.frameLocator
    const subPage = page.frame("packageListFrame");
    await subPage.locator("a[href='java/applet/package-frame.html']").click();
    
});


//Good solution for iframe & you can optimise the code like below:-
test('4. Practice Iframe Interaction', async ({ page }) => {
  await page.goto('https://vinothqaacademy.com/iframe/');

  const nameInput = page.frameLocator('iframe[title="Web Table"]').locator('input[name="name"], input[placeholder*="Name"]').first();
  await nameInput.scrollIntoViewIfNeeded();
  await nameInput.fill('John Doe');

  const checkbox = page.frameLocator('iframe[title="Web Table"]').getByRole('checkbox').first();
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.check();
});