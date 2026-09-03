const LOGIN_URL = "https://rahulshettyacademy.com/loginpagePractise/";
const SAUCE_DEMO_URL = "https://www.saucedemo.com/";

async function login(page, username = "rahulshettyacademy", password = "Learning@830$3mK2") {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.locator("#username").fill(username);
    await page.locator("#password").fill(password);
    await page.locator("#signInBtn").click();
}

async function loginToSauceDemo(page, username = "standard_user", password = "secret_sauce") {
    await page.goto(SAUCE_DEMO_URL, { waitUntil: 'domcontentloaded' });
    await page.locator("#user-name").fill(username);
    await page.locator("#password").fill(password);
    await page.locator("#login-button").click();
}

module.exports = { login, loginToSauceDemo };
