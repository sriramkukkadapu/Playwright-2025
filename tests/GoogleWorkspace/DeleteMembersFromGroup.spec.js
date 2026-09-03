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


// npx playwright test tests/GoogleWorkspace/DeleteMembersFromGroup.spec.js

const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://content-admin.googleapis.com/admin/directory';

// The API key and bearer token are read from the environment so they
// never end up committed to source (the bearer token also expires
// quickly and needs to be refreshed via the Network tab, see above).
// export GOOGLE_API_KEY=... and GOOGLE_OAUTH_TOKEN="Bearer ya29...." before running this test.
const API_KEY = process.env.GOOGLE_API_KEY;
const TOKEN = process.env.GOOGLE_OAUTH_TOKEN;

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
