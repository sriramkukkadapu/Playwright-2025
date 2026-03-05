import { test, expect } from '@playwright/test';

test('Dropdown select', async function({ page }) {
  await page.goto("https://freelance-learn-automation.vercel.app/signup");

  //wait until all 37 options loaded in dropdown
  await expect(page.locator("#state option")).toHaveCount(37);

  await page.locator("#state").selectOption({label: 'Karnataka'});
  // await page.waitForTimeout(1000);

  await page.locator("#state").selectOption({value: 'Goa'});
  // await page.waitForTimeout(1000);

  await page.locator("#state").selectOption({index: 4});


  let dropdownLocator = page.locator('#state');

  let selectedOptionText = await dropdownLocator.evaluate( 
  (selectElement) => {
    const index = selectElement.selectedIndex;
    const optionSelected = selectElement.options[index];
    return optionSelected.textContent;
  });

  console.log("Selected text from State dropdown: "+selectedOptionText);
  await expect(selectedOptionText).toEqual('Bihar');

  const selectedState2 = await page.locator('#state').inputValue();
  console.log("Selected text from State dropdown using inputvalue method: "+selectedState2);

  console.log("Printing all states from dropdown: ")
  //get list of elements method1
  let states = await page.locator("#state option").all(); //gets all states
  console.log("States count: "+states.length);
  for(const state of states){
    console.log(await state.textContent());
  }

  console.log("Printing all states from dropdown method 2 $$: ")
  //get list of elements method1
  let state = await page.$("#state"); //gets state dropdown 1st
  states = await page.$$("option") //gets all options in the dropdown
  console.log("States count: "+states.length);
  for(const state of states){
    console.log(await state.textContent());
  }

  //select 2 states - multi select in dropdown
  await page.locator("#hobbies").selectOption(['Singing','Dancing']);
  
  dropdownLocator = page.locator("#hobbies");
  let optionsSelected = await dropdownLocator.evaluate( 
  (selectElement) => {
    const elements = selectElement.selectedOptions;
    const selectedValues = [];
    console.log("Options selected: "+elements.length);
    for(let i=0;i<elements.length;i++){
      selectedValues.push(elements[i].textContent);
    }
    return selectedValues;
  });

  console.log("Selected options from Hobbies dropdown: "+optionsSelected);
  // await expect(selectedOptionText).toEqual('Bihar');
});
