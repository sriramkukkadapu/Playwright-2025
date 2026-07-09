const { eeURL } = require('../config/urlMapper');

class EEMobilePage {
    constructor(page) {
        this.page = page;
        this.mobilePagePath = 'mobile';
        this.cookieAcceptButton = page.getByRole('button', { name: 'Accept all' });
    }

    // Brand filter links on the /mobile page (inside the filter chips carousel)
    getBrandFilterLink(brandName) {
        return this.page.locator(`[aria-label="filter chips carousel"] a`).filter({ hasText: brandName });
    }

    // Product "Buy" links on brand-specific pages (links with "Buy" in accessible name pointing to product details)
    get productBuyLinks() {
        return this.page.locator('a[href*="-details"]').filter({ hasText: /Buy / });
    }

    // Product detail page - brand name paragraph (above h1)
    get productDetailBrand() {
        return this.page.locator('h1').locator('..').locator('p').first();
    }

    // Product detail page - product name heading
    get productDetailName() {
        return this.page.locator('h1');
    }

    async goto() {
        await this.page.goto(`${eeURL}${this.mobilePagePath}`, { waitUntil: 'domcontentloaded' });
    }

    async acceptCookies() {
        try {
            await this.cookieAcceptButton.click({ timeout: 5000 });
        } catch (e) {
            // Cookies dialog may not appear if already accepted
        }
    }

    async clickBrandFilter(brandName) {
        const brandLink = this.getBrandFilterLink(brandName);
        await Promise.all([
            this.page.waitForURL(/pay-monthly|search/, { timeout: 30000 }),
            brandLink.click()
        ]);
    }

    /**
     * Returns the hrefs of all "Buy" product links on the brand page.
     * Used to verify that products belong to the correct brand.
     */
    async getProductBuyLinkHrefs() {
        await this.productBuyLinks.first().waitFor({ state: 'attached', timeout: 20000 });
        const count = await this.productBuyLinks.count();
        const hrefs = [];
        for (let i = 0; i < count; i++) {
            const href = await this.productBuyLinks.nth(i).getAttribute('href');
            hrefs.push(href);
        }
        // Deduplicate
        return [...new Set(hrefs)];
    }

    /**
     * Returns the text of all "Buy" product links (e.g., "Buy iPhone 17 Pro Max").
     */
    async getProductBuyLinkTexts() {
        await this.productBuyLinks.first().waitFor({ state: 'attached', timeout: 20000 });
        const count = await this.productBuyLinks.count();
        const texts = [];
        for (let i = 0; i < count; i++) {
            const text = await this.productBuyLinks.nth(i).textContent();
            texts.push(text.trim());
        }
        return texts;
    }

    async clickFirstProduct() {
        await this.productBuyLinks.first().waitFor({ state: 'attached', timeout: 10000 });
        await this.productBuyLinks.first().click({ force: true });
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Checks if a brand filter is active on the gallery page (checkbox checked or chip visible).
     */
    async isBrandFilterActive(brandName) {
        const checkedCheckbox = this.page.locator(`input:checked`).locator('..').filter({ hasText: new RegExp(brandName, 'i') });
        const count = await checkedCheckbox.count();
        return count > 0;
    }

    async getProductDetailBrandName() {
        await this.productDetailBrand.waitFor({ state: 'visible', timeout: 10000 });
        return (await this.productDetailBrand.textContent()).trim();
    }

    async getProductDetailProductName() {
        await this.productDetailName.waitFor({ state: 'visible', timeout: 10000 });
        return (await this.productDetailName.textContent()).trim();
    }
}

module.exports = { EEMobilePage };
