import { test as base } from '@playwright/test';

export const test = base.extend(
    {
        testDataForLogin: async ({}, use) => {
            await use({
                email: "sriramkukkadapu@gmail.com",
                password: "Test1234!"
            });
        }
    }
)
