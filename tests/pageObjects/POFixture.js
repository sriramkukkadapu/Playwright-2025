import {test as base} from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";

export const test = base.extend({

    poManager: async ({page}, use) => {
        await use({
            loginPage:     new LoginPage(page),
            dashboardPage: new DashboardPage(page),
        });
    }

});

export {expect} from "@playwright/test";