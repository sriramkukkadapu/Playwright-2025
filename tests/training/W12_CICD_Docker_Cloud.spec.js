// ============================================================
// WEEK 12 — CI/CD, Docker & Cloud Testing
// Topics: GitHub Actions, Jenkins, Docker, BrowserStack, Git
// Note: This file documents CI/CD concepts and configurations
//       with example tests that work in CI environments
// ============================================================

const { test, expect } = require('@playwright/test');

// ─── 1. CI-friendly test (headless, no timeouts issues) ─────
test('W12: CI-ready test - headless with proper waits', async ({ page }) => {
    // CI tests should:
    // ✅ Use headless mode (configured in playwright.config.js)
    // ✅ Have proper timeouts
    // ✅ Not rely on local files
    // ✅ Use environment variables for credentials

    const baseUrl = process.env.BASE_URL || 'https://rahulshettyacademy.com/client';
    const email   = process.env.TEST_EMAIL || 'sriramkukkadapu@gmail.com';
    const pass    = process.env.TEST_PASS  || 'Test1234!';

    console.log('Running on ENV:', process.env.CI ? 'CI' : 'Local');
    console.log('Base URL:', baseUrl);

    await page.goto(baseUrl);
    await page.getByPlaceholder('email@example.com').fill(email);
    await page.getByPlaceholder('enter your passsword').fill(pass);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/dashboard/);
    console.log('CI test passed ✅');
});

// ─── 2. GitHub Actions Configuration ───────────────────────
// .github/workflows/playwright.yml
// ─────────────────────────────────
// name: Playwright Tests
// on:
//   push:
//     branches: [main, develop]
//   pull_request:
//     branches: [main]
//   schedule:
//     - cron: '0 9 * * 1-5'    # Run Mon-Fri at 9AM
//
// jobs:
//   test:
//     runs-on: ubuntu-latest
//     timeout-minutes: 60
//
//     strategy:
//       matrix:
//         browser: [chromium, firefox]   # Run on multiple browsers
//
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-node@v4
//         with:
//           node-version: '20'
//
//       - name: Cache node_modules
//         uses: actions/cache@v4
//         with:
//           path: ~/.npm
//           key: npm-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
//
//       - name: Cache Playwright browsers
//         uses: actions/cache@v4
//         id: playwright-cache
//         with:
//           path: ~/.cache/ms-playwright
//           key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
//
//       - name: Install dependencies
//         run: npm ci
//
//       - name: Install Playwright browsers
//         if: steps.playwright-cache.outputs.cache-hit != 'true'
//         run: npx playwright install ${{ matrix.browser }} --with-deps
//
//       - name: Run tests
//         run: npx playwright test --project=${{ matrix.browser }}
//         env:
//           BASE_URL: ${{ secrets.BASE_URL }}
//           TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
//           TEST_PASS: ${{ secrets.TEST_PASS }}
//           CI: true
//
//       - name: Upload test report
//         if: always()
//         uses: actions/upload-artifact@v4
//         with:
//           name: playwright-report-${{ matrix.browser }}
//           path: playwright-report/
//           retention-days: 7

test('W12: Environment variable usage in CI', async ({ page, browserName }) => {
    console.log('Browser:', browserName);
    console.log('CI environment:', process.env.CI || 'false');
    console.log('Node version:', process.version);

    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);
    console.log('Basic CI test passed ✅');
});

// ─── 3. Docker Configuration ────────────────────────────────
// Dockerfile for Playwright:
// ─────────────────────────────────
// FROM mcr.microsoft.com/playwright:v1.51.1-noble
//
// WORKDIR /app
//
// COPY package*.json ./
// RUN npm ci
//
// COPY . .
//
// RUN npx playwright install --with-deps
//
// CMD ["npx", "playwright", "test", "--reporter=html"]
// ─────────────────────────────────
//
// docker-compose.yml:
// ─────────────────────────────────
// version: '3.8'
// services:
//   playwright:
//     build: .
//     volumes:
//       - ./playwright-report:/app/playwright-report
//       - ./test-results:/app/test-results
//     environment:
//       - BASE_URL=https://rahulshettyacademy.com
//       - CI=true
//     command: npx playwright test --workers=2
// ─────────────────────────────────
//
// Run with Docker:
// docker build -t playwright-tests .
// docker run --rm -v $(pwd)/reports:/app/playwright-report playwright-tests
// docker-compose up --build

test('W12: Docker-compatible test - no local dependencies', async ({ page }) => {
    // Tests running in Docker should:
    // ✅ Not use local file paths (use /tmp/ or relative paths)
    // ✅ Not depend on local browsers (use --with-deps)
    // ✅ Export reports to mounted volume

    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);

    // Screenshot to container volume
    await page.screenshot({ path: '/tmp/docker-test.png' });
    console.log('Docker test passed ✅');
});

// ─── 4. Jenkins Pipeline ────────────────────────────────────
// Jenkinsfile:
// ─────────────────────────────────
// pipeline {
//   agent {
//     docker {
//       image 'mcr.microsoft.com/playwright:v1.51.1-noble'
//       args '-u root'
//     }
//   }
//
//   environment {
//     TEST_EMAIL = credentials('test-email')
//     TEST_PASS  = credentials('test-password')
//   }
//
//   stages {
//     stage('Install') {
//       steps { sh 'npm ci' }
//     }
//
//     stage('Test') {
//       steps {
//         sh 'npx playwright test --workers=4 --reporter=html,junit'
//       }
//       post {
//         always {
//           publishHTML([
//             allowMissing: false,
//             alwaysLinkToLastBuild: true,
//             keepAll: true,
//             reportDir: 'playwright-report',
//             reportFiles: 'index.html',
//             reportName: 'Playwright Report'
//           ])
//           junit 'results/junit.xml'
//         }
//       }
//     }
//   }
// }

// ─── 5. BrowserStack Cloud Testing ──────────────────────────
// Install: npm install -D browserstack-playwright-js
//
// browserstack.config.js:
// ─────────────────────────────────
// exports.config = {
//   src: ['tests/**/*.spec.js'],
//   capabilities: [
//     {
//       browser: 'chrome',
//       browser_version: 'latest',
//       os: 'Windows',
//       os_version: '11',
//       name: 'Playwright Login Test',
//       build: 'CI Build #' + process.env.BUILD_NUMBER || '1'
//     },
//     {
//       browser: 'safari',
//       browser_version: 'latest',
//       os: 'OS X',
//       os_version: 'Monterey'
//     }
//   ],
//   browserstackLocal: false,
//   username: process.env.BROWSERSTACK_USERNAME,
//   accessKey: process.env.BROWSERSTACK_ACCESS_KEY
// };
// ─────────────────────────────────
//
// Run: npx browserstack-playwright run --config browserstack.config.js

test('W12: Cross-browser test - runs on all configured browsers', async ({ page, browserName }) => {
    // This test runs on each browser in playwright.config.js projects[]
    await page.goto('https://www.google.com');

    const title = await page.title();
    console.log(`[${browserName}] Title: ${title}`);

    await expect(page).toHaveTitle(/Google/);
    console.log(`✅ Passed on ${browserName}`);
});

// ─── 6. Git Workflow Best Practices ─────────────────────────
// Feature branch workflow:
// ─────────────────────────────────
// git checkout -b feature/add-login-tests
// git add tests/training/
// git commit -m "feat: add W12 training examples"
// git push origin feature/add-login-tests
// # Create PR → CI runs → Merge to main
//
// .gitignore for Playwright:
// ─────────────────────────────────
// node_modules/
// playwright-report/
// test-results/
// .auth/
// *.zip

// ─── 7. Allure Reporting ─────────────────────────────────────
// Install: npm install -D allure-playwright allure-commandline
//
// playwright.config.js:
// reporter: [['allure-playwright']],
//
// Run tests: npx playwright test
// Generate report: npx allure generate allure-results --clean -o allure-report
// Open report: npx allure open allure-report

test('W12: Test with rich metadata for reporting', async ({ page }) => {
    // Add test annotations for better reports
    test.info().annotations.push(
        { type: 'story',    description: 'Login' },
        { type: 'severity', description: 'critical' },
        { type: 'owner',    description: 'Sriram' }
    );

    await page.goto('https://rahulshettyacademy.com/client');
    await expect(page).toHaveURL(/client/);

    // Attach screenshot to report
    const screenshot = await page.screenshot();
    await test.info().attach('login page screenshot', {
        body:        screenshot,
        contentType: 'image/png'
    });

    console.log('Test with metadata complete ✅');
});

// ─── 8. Parallel Execution Strategy ─────────────────────────
// playwright.config.js settings for CI:
// ─────────────────────────────────
// export default defineConfig({
//   fullyParallel: true,            // all tests run in parallel
//   workers: process.env.CI ? 4 : 2, // more workers in CI
//   retries: process.env.CI ? 2 : 0,  // retry only in CI
//   timeout: 60 * 1000,             // 60s per test
//   expect: { timeout: 10000 },     // 10s for assertions
//
//   use: {
//     headless: true,
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     trace: 'on-first-retry'
//   }
// });

test('W12: Parallel test 1 - safe for parallel execution', async ({ page }) => {
    // ✅ Each test gets own browser context — fully isolated
    // ✅ No shared state between tests
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);
});

test('W12: Parallel test 2 - safe for parallel execution', async ({ page }) => {
    await page.goto('https://www.bing.com');
    await expect(page).toHaveTitle(/Bing/);
});
