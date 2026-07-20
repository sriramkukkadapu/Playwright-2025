import {test} from "./pageObjects/POFixture";

test('End to end journey with Special locators', async ({ poManager }) => 
    {          
        const { loginPage, dashboardPage } = poManager;
        await loginPage.gotoLoginPage();
        await loginPage.validLogin("sriramkukkadapu@gmail.com","Test1234!");
       
        // const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAndAddtoCart("ZARA COAT 3");
        
});




