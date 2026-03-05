import { test, expect } from '@playwright/test';

test('File Upload', async ({ page }) => {

  await page.goto("https://the-internet.herokuapp.com/upload");
  await page.locator("#file-upload").setInputFiles("/Users/sriram.kukkadapu/projects/playwright-2025/upload_file.png");
  // for multiple files: await page.locator("#file-upload").setInputFiles("file1.txt", "file2.txt");
  await page.locator('#file-submit').click();

  expect (await page.locator("//h3")).toHaveText("File Uploaded!");
  
});
