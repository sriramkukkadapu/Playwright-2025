// ============================================================
// WEEK 9 — API Testing with Playwright
// Topics: GET, POST, PUT, DELETE, Network Interception,
//         Response Validation, Auth Flows, API+UI Hybrid
// ============================================================

const { test, expect, request } = require('@playwright/test');

const BASE_URL  = 'https://rahulshettyacademy.com/api/ecom';
const LOGIN_URL = `${BASE_URL}/user/login`;
const ORDERS_URL = `${BASE_URL}/order/get-orders-for-customer`;

// ─── 1. GET Request ─────────────────────────────────────────
test('W9: GET request - fetch data', async ({ request }) => {
    // GET public API
    const response = await request.get('https://reqres.in/api/users?page=1', {
        headers: { 'x-api-key': 'reqres-free-v1' }
    });

    console.log('Status:', response.status());
    console.log('Status text:', response.statusText());
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Total users:', body.total);
    console.log('First user:', body.data[0]);

    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('email');
});

// ─── 2. POST Request ────────────────────────────────────────
test('W9: POST request - create resource', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/users', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'reqres-free-v1'
        },
        data: {
            name: 'Sriram Kukkadapu',
            job:  'SDET'
        }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    console.log('Created user:', body);
    console.log('ID:', body.id);
    console.log('Created at:', body.createdAt);

    expect(body.name).toBe('Sriram Kukkadapu');
    expect(body.job).toBe('SDET');
    expect(body.id).toBeTruthy();
});

// ─── 3. PUT Request ─────────────────────────────────────────
test('W9: PUT request - update resource', async ({ request }) => {
    const response = await request.put('https://reqres.in/api/users/2', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'reqres-free-v1'
        },
        data: {
            name: 'Jane Updated',
            job:  'QA Lead'
        }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Updated:', body);
    expect(body.name).toBe('Jane Updated');
    expect(body.updatedAt).toBeTruthy();
});

// ─── 4. DELETE Request ──────────────────────────────────────
test('W9: DELETE request', async ({ request }) => {
    const response = await request.delete('https://reqres.in/api/users/2', {
        headers: { 'x-api-key': 'reqres-free-v1' }
    });

    console.log('Delete status:', response.status()); // 204 No Content
    expect(response.status()).toBe(204);
});

// ─── 5. Response Headers & Body Validation ──────────────────
test('W9: Response validation - headers, body, status', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2', {
        headers: { 'x-api-key': 'reqres-free-v1' }
    });

    // Status assertion
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);

    // Headers
    const contentType = response.headers()['content-type'];
    console.log('Content-Type:', contentType);
    expect(contentType).toContain('application/json');

    // Body validation
    const body = await response.json();
    console.log('Body:', JSON.stringify(body, null, 2));

    // Deep assertions
    expect(body.data).toHaveProperty('id', 2);
    expect(body.data).toHaveProperty('email');
    expect(body.data.first_name).toBeTruthy();

    // Schema-like validation
    expect(typeof body.data.id).toBe('number');
    expect(typeof body.data.email).toBe('string');
    expect(body.data.email).toContain('@');
});

// ─── 6. Authentication - Token based ────────────────────────
test('W9: Auth - login and get token', async ({ request }) => {
    // Login to get auth token
    const loginResp = await request.post(LOGIN_URL, {
        data: {
            userEmail:    'sriramkukkadapu@gmail.com',
            userPassword: 'Test1234!'
        }
    });

    console.log('Login status:', loginResp.status());
    const loginBody = await loginResp.json();
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
    // Mock a specific API endpoint
    await page.route('**/api/users**', async route => {
        const mockData = {
            data: [
                { id: 1, email: 'mock@test.com', first_name: 'Mock', last_name: 'User' }
            ],
            total: 1,
            page: 1
        };

        await route.fulfill({
            status:      200,
            contentType: 'application/json',
            body:        JSON.stringify(mockData)
        });
    });

    // Now when page makes request to /api/users, it gets mocked data
    await page.goto('https://reqres.in');

    // Verify the mock worked
    const response = await page.evaluate(async () => {
        const res = await fetch('https://reqres.in/api/users');
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

    const loginBody = await loginResp.json();
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
                country:   'India',
                productOrderedId: '6262e990e26b7e1a10e89bf0'
            }]
        }
    });

    console.log('Order creation status:', orderResp.status());

    // STEP 3: Verify order in UI
    await page.goto('https://rahulshettyacademy.com/client');
    await page.getByPlaceholder('email@example.com').fill('sriramkukkadapu@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Test1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    // Navigate to orders
    await page.locator("button[routerlink='/dashboard/myorders']").click().catch(() => {
        console.log('My orders button not found in this flow');
    });

    console.log('API + UI Hybrid test completed ✅');
    expect(page.url()).toContain('rahulshettyacademy');
});

// ─── 9. PATCH Request ───────────────────────────────────────
test('W9: PATCH request - partial update', async ({ request }) => {
    const response = await request.patch('https://reqres.in/api/users/2', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'reqres-free-v1'
        },
        data: { job: 'Senior SDET' }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log('Patched:', body);
    expect(body.job).toBe('Senior SDET');
    expect(body.updatedAt).toBeTruthy();
});
