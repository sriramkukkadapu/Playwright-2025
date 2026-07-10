// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';
import { trace } from 'console';
import { permission } from 'process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  workers: 10, // Use a specific number of workers(threads)
  testDir: './tests',
  // testMatch: './tests/*.spec.js',

  fullyParallel: true, // each test in spec file is run independently
  timeout: 60*1000, //test timeout across entire project
  expect: { 
    timeout: 30*1000 //this time out applicable only expect - assertions
  },
  reporter: 'html',
  retries: 2, // 0-no retries - dont put this under use because this will be applicable globally.
  use: {
    baseURL: process.env.BASE_URL || 'http://www.google.com',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    browserName: 'chromium',
    ignoreHttpsErrors: true,
    Permissions: ['geolocation'],
    // browserName: 'firefox',
    // browserName: 'webkit',
    headless: true,
    screenshot: 'on', //only-on-failure, off
    trace: 'on', //retain-on-failure - only if test failed it will retain
    video: 'on-first-retry', //on
    viewport: null,
    launchOptions: {
      args: [
        "--start-maximized",
        "--disable-features=PrivateNetworkAccessPermissionPrompt"
      ],
    }
  }
  // ,projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'], 
  //        viewport: {width:1728, height:864}
  //     },
  //   }]
});

module.exports = config; //exporting config variable to be available across entire project

