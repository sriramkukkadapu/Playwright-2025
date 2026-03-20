import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.amazon.in/', {waitUntil: 'domcontentloaded'});
  await page.getByRole('searchbox', { name: 'Search Amazon.in' }).click();
  await page.getByRole('searchbox', { name: 'Search Amazon.in' }).fill('iphone');
  await page.getByRole('button', { name: 'iphone 16 pro 256gb' }).click();
});