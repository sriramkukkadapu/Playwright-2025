// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';
import { trace } from 'console';

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
  workers: 3, // Use a specific number of workers
  testDir: './tests',
  fullyParallel: true,
  timeout: 60*1000, //test timeout across entire project
  expect: { 
    timeout: 5*1000 //this time out applicable only expect - assertions
  },
  reporter: 'html',
  retries: 0, // for now dont retry
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    browserName: 'chromium',
    // browserName: 'firefox',
    // browserName: 'webkit',
    headless: true,
    screenshot: 'on',
    trace: 'on', //retain-on-failure
    video: 'on',
    launchOptions: {
      // args: ["--start-maximized"],
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

