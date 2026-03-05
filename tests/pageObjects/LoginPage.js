class LoginPage{
    constructor(page){
        this.page = page;
        this.email = page.getByPlaceholder("email@example.com");
        this.password = page.getByPlaceholder("enter your passsword");
        this.signInButton = page.getByRole("button", {name: "Login"});
    }

    async gotoLoginPage(){
        await this.page.goto("https://rahulshettyacademy.com/client");  
    }

    async validLogin(username,password){
        await this.email.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }

}

module.exports = {LoginPage};