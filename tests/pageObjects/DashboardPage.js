class DashboardPage{
    constructor(page){
        this.page = page;
        this.productsText = page.locator(".card-body b");
        this.products = page.locator(".card-body");
        this.cart = page.getByRole("listitem").getByRole("button", {name: "Cart"});
        this.cartLink = page.locator("button[routerLink='/dashboard/cart']");
    }

    async searchProductAndAddtoCart(productName){
        const titles = await this.productsText.allTextContents();
        console.log(this.products);
        const count = await this.products.count();
        console.log("====> Products count: "+count);

        for(let i=0;i<count;i++){
            console.log(await this.products.nth(i).locator("b").textContent());
            if(await this.products.nth(i).locator("b").textContent() === productName){
                await this.products.nth(i).locator("//button[text()=' Add To Cart']").click();;
                break;
            }
        }

        console.log("Added "+productName + " to the cart.");
    }

    async gotoCartPage(){
        await this.cartLink.click();
    }

}

module.exports = {DashboardPage};