const { test, expect } = require('@playwright/test');
const { login, loginToSauceDemo } = require('./utils/LoginStep');

const AUTH_FILE = '.auth/user.json';

test('0 - Setup Step before any test starts --- SETUP ---', async ({ page }) => {

    console.log("Predefined Steps executing before your actual TEST starts: ");
    console.log("Logging in to the Application to Test...")
    await login(page);
    await loginToSauceDemo(page);

    await page.context().storageState({ path: AUTH_FILE });

    console.log("Setup Done!!");
    console.log("Loggedin You are Good to go!!");
});