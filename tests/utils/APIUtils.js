class APIUtils{

    constructor(apiContext,loginPayload){
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken(){       
        console.log("Login payload going: "+this.loginPayload) 
            //Login API
            const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
                data: this.loginPayload
            });
        
            const loginResponseJson = await loginResponse.json();
            console.log("Login Response full Json: "+JSON.stringify(loginResponseJson));
            console.log("Login Response token: "+loginResponseJson.token);
            const token = loginResponseJson.token;

            return token;
    }

    async createOrder(createOrderPayload){

        const response = {};
        const token = await this.getToken();
        response.token = token;

            //Create Order API
                const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
                data: createOrderPayload,
                headers:{
                            'authorization': token,
                            'content-type': 'application/json'
                }
            });
            
            const orderResponseJson = await orderResponse.json();
            console.log("Order Response full Json: "+JSON.stringify(orderResponseJson));
            const orderId = orderResponseJson.orders[0];
            console.log("Order Id: "+orderId);
        
            response.orderId = orderId
            return response;
    }
}

module.exports = {APIUtils};