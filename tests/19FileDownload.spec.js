import { test, expect } from '@playwright/test';
const fs = require('fs');

test('File Download', async ({ page }) => {

  await page.goto("https://the-internet.herokuapp.com/download");
  // for multiple files: await page.locator("#file-upload").setInputFiles("file1.txt", "file2.txt");
  console.log("current working directory: +"+process.cwd()); 
  const cwd = process.cwd();
  const file_path = cwd + "/downloads/file_downloaded.png";

  //1st delete file in the directory if it is existing
  fs.unlink(file_path, (err) => {
  if (err) {
    console.log('Error deleting file:', err);
    return;
  }
  console.log('File deleted successfully:', file_path);
  });

  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("a[href='download/image.jpg']").click()
  ]);

  await download.saveAs(file_path);
  //get downloaded information.

  console.log(await download.suggestedFilename());
  console.log(await download.path());
  expect(await download.path()).not.toBeNull();

  //verify file existing in given path
  expect(fs.existsSync(file_path)).toBeTruthy();
});
