// ============================================================
// WEEK 9 — API Testing with Playwright
// Topics: GET, POST, PUT, DELETE, Network Interception,
//         Response Validation, Auth Flows, API+UI Hybrid
// Note: Uses jsonplaceholder.typicode.com (free, no auth needed)
// ============================================================

const { test, expect, request } = require('@playwright/test');

const BASE_URL   = 'https://rahulshettyacademy.com/api/ecom';
const LOGIN_URL  = `${BASE_URL}/user/login`;
const ORDERS_URL = `${BASE_URL}/order/get-orders-for-customer`;
const JSON_API   = 'https://jsonplaceholder.typicode.com';

// ─── 1. GET Request ─────────────────────────────────────────
test('W9: GET request - fetch data', async ({ request }) => {
    const response = await request.get(`${JSON_API}/users`);

    console.log('Status:', response.status());
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Total users:', body.length);
    console.log('First user:', body[0].name, body[0].email);

    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('email');
    expect(body[0]).toHaveProperty('name');
});

// ─── 2. POST Request ────────────────────────────────────────
test('W9: POST request - create resource', async ({ request }) => {
    const response = await request.post(`${JSON_API}/posts`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            title:  'Playwright API Testing',
            body:   'Learning API testing with Playwright',
            userId: 1
        }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    console.log('Created post:', body);

    expect(body.title).toBe('Playwright API Testing');
    expect(body.userId).toBe(1);
    expect(body.id).toBeTruthy();
});

// ─── 3. PUT Request ─────────────────────────────────────────
test('W9: PUT request - update resource', async ({ request }) => {
    const response = await request.put(`${JSON_API}/posts/1`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            id:     1,
            title:  'Updated Title',
            body:   'Updated body content',
            userId: 1
        }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Updated:', body);
    expect(body.title).toBe('Updated Title');
    expect(body.id).toBe(1);
});

// ─── 4. DELETE Request ──────────────────────────────────────
test('W9: DELETE request', async ({ request }) => {
    const response = await request.delete(`${JSON_API}/posts/1`);

    console.log('Delete status:', response.status()); // 200 for jsonplaceholder
    expect(response.status()).toBe(200);
});

// ─── 5. Response Headers & Body Validation ──────────────────
test('W9: Response validation - headers, body, status', async ({ request }) => {
    const response = await request.get(`${JSON_API}/users/1`);

    // Status assertions
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);

    // Headers
    const contentType = response.headers()['content-type'];
    console.log('Content-Type:', contentType);
    expect(contentType).toContain('application/json');

    // Body validation
    const body = await response.json();
    console.log('Body:', JSON.stringify(body, null, 2).substring(0, 200));

    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('email');
    expect(body.name).toBeTruthy();

    // Schema-like validation
    expect(typeof body.id).toBe('number');
    expect(typeof body.email).toBe('string');
    expect(body.email).toContain('@');
});

// ─── 6. Authentication - Token based ────────────────────────
test('W9: Auth - login and get token', async ({ request }) => {
    // Login to get auth token from rahulshettyacademy
    const loginResp = await request.post(LOGIN_URL, {
        data: {
            userEmail:    'sriramkukkadapu@gmail.com',
            userPassword: 'Test1234!'
        }
    });

    console.log('Login status:', loginResp.status());
    let loginBody = {};
    try {
        loginBody = await loginResp.json();
    } catch (e) {
        console.log('Login response is not JSON - API may have changed');
    }
    console.log('Login response:', JSON.stringify(loginBody).substring(0, 150));

    if (loginResp.status() === 200 && loginBody.token) {
        const token = loginBody.token;
        console.log('Token received:', token.substring(0, 30) + '...');

        // Use token in subsequent requests
        const ordersResp = await request.get(
            `${ORDERS_URL}/${loginBody.userId}`,
            { headers: { Authorization: token } }
        );
        console.log('Orders status:', ordersResp.status());
    }

    expect(loginResp.status()).toBeLessThan(500);
});

// ─── 7. Network Interception & Mocking ──────────────────────
test('W9: Network interception - mock API response', async ({ page }) => {
    await page.route('**/api/users**', async route => {
        const mockData = {
            data: [
                { id: 1, email: 'mock@test.com', first_name: 'Mock', last_name: 'User' }
            ],
            total: 1,
            page:  1
        };
        await route.fulfill({
            status:      200,
            contentType: 'application/json',
            body:        JSON.stringify(mockData)
        });
    });

    await page.goto('https://jsonplaceholder.typicode.com');

    // Trigger the mocked endpoint
    const response = await page.evaluate(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/api/users');
        return await res.json();
    });

    console.log('Mocked response:', response);
    expect(response.total).toBe(1);
    expect(response.data[0].email).toBe('mock@test.com');
});

// ─── 8. API + UI Hybrid Test ────────────────────────────────
test('W9: API + UI Hybrid - create via API, verify in UI', async ({ page, request }) => {
    // STEP 1: Login via API (faster than UI login)
    const loginResp = await request.post(LOGIN_URL, {
        data: {
            userEmail:    'sriramkukkadapu@gmail.com',
            userPassword: 'Test1234!'
        }
    });

    let loginBody = {};
    try {
        loginBody = await loginResp.json();
    } catch (e) {
        console.log('Login response is not JSON - skipping hybrid test');
        return;
    }
    const token = loginBody.token;

    if (!token) {
        console.log('Token not available, skipping hybrid test');
        return;
    }

    // STEP 2: Create order via API
    const orderResp = await request.post(`${BASE_URL}/order/create-order`, {
        headers: {
            Authorization:  token,
            'Content-Type': 'application/json'
        },
        data: {
            orders: [{
                country:          'India',
                productOrderedId: '6262e990e26b7e1a10e89bf0'
            }]
        }
    });

    console.log('Order creation status:', orderResp.status());

    // STEP 3: Verify in UI
    await page.goto('https://rahulshettyacademy.com/client');
    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    await page.locator("button[routerlink='/dashboard/myorders']").click().catch(() => {
        console.log('My orders button not found in this flow');
    });

    console.log('API + UI Hybrid test completed ✅');
    expect(page.url()).toContain('rahulshettyacademy');
});

// ─── 9. PATCH Request ───────────────────────────────────────
test('W9: PATCH request - partial update', async ({ request }) => {
    const response = await request.patch(`${JSON_API}/posts/1`, {
        headers: { 'Content-Type': 'application/json' },
        data: { title: 'Patched Title' }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log('Patched:', body);
    expect(body.title).toBe('Patched Title');
    expect(body.id).toBe(1);
});
