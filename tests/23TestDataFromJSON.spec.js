import { test, expect } from '@playwright/test';
import testData from '../testData/loginTestData.json';

// const {test,expect} = require('@playwright/test');

test('End to end journey with Special locators', async ({browser,page}) => 
    {           

        await page.goto("https://rahulshettyacademy.com/client");  

        await page.getByPlaceholder("email@example.com").fill(testData.email);
        await page.getByPlaceholder("enter your passsword").fill(testData.password);
        await page.getByRole("button", {name: "Login"}).click();

        console.log(await page.title());

    });