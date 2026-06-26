const { LoginPage } = require("./LoginPage");
const { DashboardPage } = require("./DashboardPage");
const { LoginPractisePage } = require("./LoginPractisePage");
const { ShopPage } = require("./ShopPage");

class POManager{
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.DashboardPage = new DashboardPage(page);
        this.loginPractisePage = new LoginPractisePage(page);
        this.shopPage = new ShopPage(page);
    }

    getLoginPage(){
        return this.loginPage;
    }

    getDashboardPage(){
        return this.DashboardPage;
    }

    getLoginPractisePage(){
        return this.loginPractisePage;
    }

    getShopPage(){
        return this.shopPage;
    }
}

module.exports = {POManager}