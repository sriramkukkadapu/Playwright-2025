class ShopPage {
    constructor(page) {
        this.page         = page;
        this.productTitles = page.locator('h4.card-title');
    }

    async waitForPageLoad() {
        await this.page.waitForURL(/angularpractice\/shop/, { timeout: 15000 });
        await this.productTitles.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    async isProductPresent(productName) {
        const count = await this.productTitles.count();
        for (let i = 0; i < count; i++) {
            const title = (await this.productTitles.nth(i).textContent()).trim();
            if (title.toLowerCase() === productName.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
}

module.exports = { ShopPage };
