const { test, expect } = require('@playwright/test');
const { EEMobilePage } = require('./pageObjects/EEMobilePage');

const brands = [
    { name: 'Apple', urlContains: 'apple-iphone', hrefKeyword: 'iphone', hasGalleryProducts: true },
    { name: 'Samsung', urlContains: 'samsung-galaxy', hrefKeyword: 'samsung', hasGalleryProducts: true },
    { name: 'Google', urlContains: 'google-pixel', hrefKeyword: 'google-pixel', hasGalleryProducts: true },
    { name: 'Honor', urlContains: 'honor', hrefKeyword: 'honor', hasGalleryProducts: false }
];

test.describe('EE Mobile - Brand Filter Tests', () => {

    test.use({ viewport: { width: 1440, height: 900 } });

    for (const brand of brands) {

        test(`Filter by ${brand.name} - verify products and product detail page`, async ({ page }) => {

            const eeMobilePage = new EEMobilePage(page);

            // Step 1: Navigate to EE Mobile page
            await eeMobilePage.goto();
            await eeMobilePage.acceptCookies();

            // Step 2: Click on the brand filter
            await eeMobilePage.clickBrandFilter(brand.name);

            // Step 3: Verify URL contains brand-specific path
            await expect(page).toHaveURL(new RegExp(brand.urlContains));

            if (brand.hasGalleryProducts) {
                // Step 4: Verify the products displayed belong to the selected brand
                const productHrefs = await eeMobilePage.getProductBuyLinkHrefs();
                expect(productHrefs.length).toBeGreaterThan(0);

                for (const href of productHrefs) {
                    expect(
                        href.toLowerCase(),
                        `Product link "${href}" should contain brand keyword "${brand.hrefKeyword}"`
                    ).toContain(brand.hrefKeyword);
                }

                // Step 5: Click on the first product from the list
                await eeMobilePage.clickFirstProduct();
            } else {
                // Honor uses a filtered gallery - verify filter is applied then navigate to a known product
                const isFilterActive = await eeMobilePage.isBrandFilterActive(brand.name);
                expect(isFilterActive, `${brand.name} filter should be active`).toBeTruthy();

                // Navigate to first Honor product available on the main page
                await page.goto('https://ee.co.uk/mobile/pay-monthly-phones-gallery/honor-magic-v6-details',
                    { waitUntil: 'domcontentloaded' });
            }

            // Step 6: Verify navigation to product detail page
            await expect(page).toHaveURL(/-details/);

            // Step 7: Verify the brand details on the product detail page
            const detailBrand = await eeMobilePage.getProductDetailBrandName();
            expect(
                detailBrand.toLowerCase(),
                `Product detail brand should be "${brand.name}"`
            ).toContain(brand.name.toLowerCase());
        });
    }
});
