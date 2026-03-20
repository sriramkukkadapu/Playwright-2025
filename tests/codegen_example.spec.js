import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.amazon.in/', { waitUntil: 'load' });
  const searchBox = page.getByRole('searchbox', { name: 'Search Amazon.in' });
  await searchBox.waitFor({ state: 'visible' });
  await searchBox.click();
  await searchBox.fill('iphone');
  await page.getByRole('button', { name: 'iphone 16 pro 256gb' }).click();
});