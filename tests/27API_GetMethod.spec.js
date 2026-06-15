const {test, expect, request} = require('@playwright/test');
const {objectsAPI_BaseURL: base_url} = require('./config/urlMapper');
let objectId;
test.describe.configure({ mode: 'serial' })

test("1. GET Objects API", async ({request}) => {
    //GET request to fetch all objects
    const getResponse = await request.get(base_url);
    expect(getResponse.ok()).toEqual(true);

    const responseJson = await getResponse.json();
    console.log("GET Response: " + JSON.stringify(responseJson));
    
    //Verify response is an array
    expect(Array.isArray(responseJson)).toBeTruthy();
    console.log("Total objects fetched: " + responseJson.length);
    
    objectId = responseJson[0].id;
    //Verify each object has expected properties
    if(responseJson.length > 0) {
        expect(responseJson[0]).toHaveProperty('id');
        expect(responseJson[0]).toHaveProperty('name');
        console.log("API response verified successfully");
    }
});


test("2. GET Object by ID", async ({request}) => {
    //GET request to fetch specific object by ID
    // let objectId = "1";
    const getResponse = await request.get(base_url+"/"+objectId);
    expect(getResponse.ok()).toEqual(true);

    const responseJson = await getResponse.json();
    console.log("GET Object Response: " + JSON.stringify(responseJson));
    
    //Verify response has the same ID
    expect(responseJson).toHaveProperty('id');
    expect(responseJson.id).toBe(objectId);
    console.log("Object retrieved successfully with ID: " + objectId);
});
