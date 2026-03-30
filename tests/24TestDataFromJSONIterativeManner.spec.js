import { test, expect } from '@playwright/test';
import users from '../testData/loginTestDataMultipleusers.json';

// const {test,expect} = require('@playwright/test');
for(const user of users){
test(`Login Test with User ${user.email}`, async ({page}) => 
    {           

        await page.goto("https://rahulshettyacademy.com/client");  
        console.log("With user: "+user.email + " | Password: "+user.password);
        await page.getByPlaceholder("email@example.com").fill(user.email);
        await page.getByPlaceholder("enter your passsword").fill(user.password);
        await page.getByRole("button", {name: "Login"}).click();

        console.log(await page.title());
    });
}