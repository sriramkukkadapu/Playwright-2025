import { test, expect } from '@playwright/test';

test('Keyboard events example - google', async ({ page }) => {

  await page.goto("https://www.google.com");
  await page.locator("textarea[title='Search']").type("Sriram Kukkadapu");
  await page.keyboard.press("Enter");

  await page.pause();
  
});

test('Keyboard events example - Multiple Keys ', async ({ page }) => {

  await page.goto("https://www.yahoo.com");
  await page.locator("input[placeholder='Search the web']").type("Test - clearing the data");
  await page.keyboard.press("Meta+A");
  await page.keyboard.press("Backspace");
  
  // await page.pause();
});


test('Keyboard events example - Hold release', async ({ page }) => {

  await page.goto("https://www.yahoo.com");
  await page.locator("input[placeholder='Search the web']").type("Test - clearing the data");
  await page.locator("input[placeholder='Search the web']").focus();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.down("Shift");
  for(let i=0;i<"data".length;i++){
      await page.keyboard.press("ArrowLeft");
  }
  await page.keyboard.up("Shift");
  await page.keyboard.press("Backspace");
  await page.pause();
});

test.only('Keyboard events example - auto suggestions - amazon example', async ({ page }) => {

  await page.goto("https://www.amazon.in/");
  await page.locator("input[id='twotabsearchtextbox']").type("iPhone");

  // Wait for the suggestion container to appear
  const suggestionContainer = page.locator('.autocomplete-results-container');
  // await suggestionContainer.waitFor({ state: 'visible', timeout: 5000 });
  await expect(suggestionContainer).toBeVisible({timeout:2000});

  // All suggestion items   
  const suggestions_list = await page.locator('.s-suggestion-container .s-suggestion').allTextContents();
  console.log("Suggestions list count: "+suggestions_list.length);
  for(let i=0;i<suggestions_list.length;i++){
      console.log("suggestion: "+suggestions_list[i]);
  }

  await page.locator("div[aria-label='iphone 17 pro']").click();
  
  // await page.keyboard.press("ArrowDown");
  // await page.keyboard.press("ArrowDown");
  // await page.keyboard.press("Enter");
  // await page.pause();
});

