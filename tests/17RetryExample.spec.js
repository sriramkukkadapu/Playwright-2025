import { test, expect } from '@playwright/test';

test('Retry example - failing test', async ({ page }) => {

  expect(1).toEqual(2);
  
});

test('Retry example - passing test', async ({ page }) => {

  expect(1).toEqual(1);
  
});