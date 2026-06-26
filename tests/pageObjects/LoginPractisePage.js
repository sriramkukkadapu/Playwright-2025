class LoginPractisePage {
    constructor(page) {
        this.page = page;
        this.usernameInput  = page.locator('#username');
        this.passwordInput  = page.locator('#password');
        this.termsCheckbox  = page.locator('#terms');
        this.signInButton   = page.locator('#signInBtn');
    }

    async goto() {
        await this.page.goto('https://rahulshettyacademy.com/loginPagePractise');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.termsCheckbox.click();
        await this.signInButton.click();
    }
}

module.exports = { LoginPractisePage };
