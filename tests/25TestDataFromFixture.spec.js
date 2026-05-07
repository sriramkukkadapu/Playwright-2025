import { expect } from '@playwright/test';
import { test as testWithFixture } from './utils/test-base';

testWithFixture('End to end journey with Special locators', async ({page, testDataForLogin}) => 
    {           

        await page.goto("https://rahulshettyacademy.com/client");  

        await page.getByPlaceholder("email@example.com").fill(testDataForLogin.email);
        await page.getByPlaceholder("enter your passsword").fill(testDataForLogin.password);
        await page.getByRole("button", {name: "Login"}).click();

        console.log(await page.title());

    });
