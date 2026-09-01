// ============================================================
// Google Workspace — Delete Members From Group
// Converted from RestAssured Java (DeleteMembersFromGroup.java)
//
// Reads a list of member emails from DeleteMembersFromGroup.txt
// (one email per line) and removes each one from a Google Group
// via the Admin SDK Directory API.
//
// Reference: https://developers.google.com/admin-sdk/directory/reference/rest/v1/members/delete
// (open the URL above, perform the delete action, grab the request
// from the Network tab as cURL to obtain a fresh bearer token)
// ============================================================

const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://content-admin.googleapis.com/admin/directory';

// NOTE: these were copied verbatim from the Java test — the OAuth
// bearer token expires quickly and will need to be refreshed.
const API_KEY = 'AIzaSyBeo4NGA__U6Xxy-aBE6yFm19pgq8TY-TM';
const TOKEN = '';

async function deleteEmailIdFromGroup(request, groupEmailId, emailId) {
    return request.delete(`${BASE_URL}/v1/groups/${groupEmailId}/members/${emailId}`, {
        params: { key: API_KEY },
        headers: {
            authorization: TOKEN,
            'x-origin': 'https://explorer.apis.google.com'
        }
    });
}

test('Delete members from Google Group', async ({ request }) => {
    // const groupEmailId0 = 'testingexpopeningssubscribed@jobcurator.in';
    // const groupEmailId1 = 'testingexpopeningssubscribed1@jobcurator.in';
    // const groupEmailId2 = 'testingexpopeningssubscribed2@jobcurator.in';
    const groupEmailId3 = 'testingexpopeningssubscribed3@jobcurator.in';
    // const groupEmailId = 'testing-experienced-openings@@googlegroups.com';

    const filePath = path.join(__dirname, 'DeleteMembersFromGroup.txt');
    const emails = fs.readFileSync(filePath, 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    let totalIds = 0;
    let failedIds = 0;
    const failedIdsList = [];

    for (const email of emails) {
        totalIds++;

        // const response1 = await deleteEmailIdFromGroup(request, groupEmailId0, email);
        // const response2 = await deleteEmailIdFromGroup(request, groupEmailId1, email);
        // const response3 = await deleteEmailIdFromGroup(request, groupEmailId2, email);
        const response4 = await deleteEmailIdFromGroup(request, groupEmailId3, email);

        if (response4.status() !== 204) {
            failedIds++;
            failedIdsList.push(email);
            console.log(`Failed for id: ${email} Status: ${response4.status()}`);
        } else {
            console.log(`Deleted id: ${totalIds}  =  ${email}`);
        }
    }

    console.log(`Total ids: ${totalIds}`);
    console.log(`Failed ids: ${failedIds}`);
    console.log(`Failed ids List: ${failedIdsList}`);
});
