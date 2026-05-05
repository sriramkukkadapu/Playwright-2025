const { test: base } = require('@playwright/test');

exports.test = base.extend(
    {
        testDataForLogin: async ({}, use) => {
            await use({
                email: "sriramkukkadapu@gmail.com",
                password: "Test1234!"
            });
        }
    }
)
