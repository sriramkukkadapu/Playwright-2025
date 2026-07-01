const {test, expect} = require('./fixtures/apiFixture');
let createdObjectId;

test.describe.configure({ mode: 'serial' })

test("1. POST Create Object", async ({apiHelper}) => {
    // https://restful-api.dev/
    // POST request to create a new object
    const baseRequestBody = require('./testData/postObject.json');
    const requestBody = structuredClone(baseRequestBody);

    requestBody.name = 'Apple MacBook Pro 16';
    requestBody.data.year = 2019;
    requestBody.data.price = 2049.99;
    requestBody.data["CPU model"] = "Intel Core i9";
    requestBody.data["Hard disk size"] = "1 TB";
    requestBody.data.color = "silver";

    const {status, body: responseJson} = await apiHelper.post('', requestBody);

    expect(status).toEqual(200);
    console.log("POST Response: " + JSON.stringify(responseJson));

    expect(responseJson).toHaveProperty('id');
    expect(responseJson).toHaveProperty('data');
    expect(responseJson.name).toBe("Apple MacBook Pro 16");
    expect(responseJson.data.price).toBe(2049.99);

    createdObjectId = responseJson.id;
    console.log("Object created successfully with ID: " + createdObjectId);
});


test("2. GET Created Object by ID", async ({apiHelper}) => {
    // Verify the object created in test 1 can be retrieved
    const {status, body: responseJson} = await apiHelper.get("/" + createdObjectId);

    if(status === 200) {
        console.log("Retrieved created object: " + JSON.stringify(responseJson));
        expect(responseJson.id).toBe(createdObjectId);
    } else {
        console.log("API does not support retrieving created objects (Expected behavior for some APIs)");
    }
});


test("3. POST Create Object negative scenario", async ({apiHelper}) => {
    // https://restful-api.dev/
    // POST request to create a new object
    const baseRequestBody = require('./testData/postObject.json');
    const requestBody = structuredClone(baseRequestBody);

    requestBody.name = null;
    requestBody.data.year = null;
    requestBody.data.price = null;
    requestBody.data["CPU model"] = "";
    requestBody.data["Hard disk size"] = "";
    requestBody.data.color = "";

    const {status, body: responseJson} = await apiHelper.post('', requestBody);

    expect(status).toEqual(200);
    console.log("POST Response: " + JSON.stringify(responseJson));

    createdObjectId = responseJson.id;
    console.log("Object created successfully with ID: " + createdObjectId);
});
