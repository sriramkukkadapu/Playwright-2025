const {test, expect} = require('./fixtures/apiFixture');

let objectId;
test.describe.configure({ mode: 'serial' })

test("1. GET Objects API", async ({apiHelper}) => {
    // https://restful-api.dev/
    //GET request to fetch all objects
    const {status, body: responseJson} = await apiHelper.get('');
    expect(status).toEqual(200);

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

test("2. GET Object by ID", async ({apiHelper}) => {
    //GET request to fetch specific object by ID
    const {status, body: responseJson} = await apiHelper.get("/"+objectId);
    expect(status).toEqual(200);

    console.log("GET Object Response: " + JSON.stringify(responseJson));

    //Verify response has the same ID
    expect(responseJson).toHaveProperty('id');
    expect(responseJson.id).toBe(objectId);
    console.log("Object retrieved successfully with ID: " + objectId);
});

test("3. GET Object by ID - null", async ({apiHelper}) => {
    const {status} = await apiHelper.get("/"+null);
    expect(status).toBe(404);
});
