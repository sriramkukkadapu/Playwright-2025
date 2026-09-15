// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = defineConfig({
  workers: 10, // Use a specific number of workers(threads)
  testDir: './tests',
  // testMatch: './tests/*.spec.js',
  // GoogleWorkspace tests hit a live Google API with real credentials and
  // mutate a real group's membership — never run them automatically in CI.
  testIgnore: process.env.CI ? '**/GoogleWorkspace/**' : undefined,

  fullyParallel: true, // each test in spec file is run independently
  timeout: 60 * 1000, //test timeout across entire project
  expect: {
    timeout: 30 * 1000 //this time out applicable only expect - assertions
  },
  reporter: 'html',
  retries: 2, // 0-no retries - dont put this under use because this will be applicable globally.
  use: {
    baseURL: process.env.BASE_URL || 'http://www.google.com',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    browserName: 'chromium',
    ignoreHttpsErrors: true,
    permissions: ['geolocation'],
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
  , projects: [
    {
      name: 'setup',
      testDir: './tests',
      testMatch: '0SetupTest.spec.js',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1728, height: 864 },
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    }]
});

export default config;

