const { test: baseTest, expect } = require('@playwright/test');
const { ApiHelper } = require('./ApiHelper');
const { objectsAPI_BaseURL: base_url } = require('../config/urlMapper');

const test = baseTest.extend({

    apiHelper: async ({ request }, use) => {
        const apiHelper = new ApiHelper(request, base_url);
        await use(apiHelper);
    },
});

module.exports = { test, expect };
