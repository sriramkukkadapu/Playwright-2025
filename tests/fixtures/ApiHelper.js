export class ApiHelper {

    constructor(request, baseURL) {
        this.request = request;
        this.baseURL = baseURL;
    }

    // GET
    async get(endpoint, headers) {
        const response = await this.request.get(`${this.baseURL}${endpoint}`, {
            headers: headers,
        });
        return {
            status: response.status(),
            body: await response.json(),
        };
    }

    // POST
    async post(endpoint, data, headers) {
        const response = await this.request.post(`${this.baseURL}${endpoint}`, {
            data: data,
            headers: headers,
        });
        return {
            status: response.status(),
            body: await response.json(),
        };
    }

    // PUT
    async put(endpoint, data, headers) {
        const response = await this.request.put(`${this.baseURL}${endpoint}`, {
            data: data,
            headers: headers,
        });
        return {
            status: response.status(),
            body: await response.json(),
        };
    }

    // DELETE
    async delete(endpoint, headers) {
        const response = await this.request.delete(`${this.baseURL}${endpoint}`, {
            headers: headers,
        });
        return {
            status: response.status()
        };
    }
}
