import { test, expect } from '@playwright/test';

async function loadYahooAndFill(page, value) {
  await page.goto("https://www.yahoo.com");
  // Dismiss consent/cookie modal if present
  const acceptBtn = page.locator('button:has-text("Accept all"), button:has-text("I agree"), button:has-text("Agree")');
  await acceptBtn.first().click({ timeout: 5000 }).catch(() => {});
  const searchBox = page.locator("input[placeholder='Search the web']");
  await searchBox.waitFor({ state: 'visible' });
  await searchBox.click();
  await searchBox.fill(value);
  // Retry fill if value didn't stick
  const current = await searchBox.inputValue();
  if (current !== value) {
    await searchBox.clear();
    await searchBox.pressSequentially(value, { delay: 50 });
  }
  return searchBox;
}

test('Keyboard events example - press enter', async ({ page }) => {
  const searchBox = await loadYahooAndFill(page, "Test - clearing the data");
  await page.keyboard.press("Enter");
});

test('Keyboard events example - Multiple Keys ', async ({ page }) => {
  const searchBox = await loadYahooAndFill(page, "Test - clearing the data");
  await expect(searchBox).toHaveValue("Test - clearing the data");
  await page.keyboard.press("Meta+A");
  await page.keyboard.press("Backspace");
});

test('Keyboard events example - Hold release', async ({ page }) => {
  const searchBox = await loadYahooAndFill(page, "Test - clearing the data");
  await expect(searchBox).toHaveValue("Test - clearing the data");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.down("Shift");
  for(let i=0;i<"data".length;i++){
      await page.keyboard.press("ArrowLeft");
  }
  await page.keyboard.up("Shift");
  await page.keyboard.press("Backspace");
});

test.skip('Keyboard events example - auto suggestions - amazon example', async ({ page }) => {

  await page.goto("https://www.amazon.in/",{timeout: 600000});
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

