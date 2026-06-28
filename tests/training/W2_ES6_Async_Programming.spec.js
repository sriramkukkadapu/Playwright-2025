// ============================================================
// WEEK 2 — ES6+ & Async Programming
// Topics: Arrow Functions, Destructuring, Spread/Rest,
//         Modules, Promises, Async/Await, Classes
// ============================================================

const { test, expect } = require('@playwright/test');

// ─── 1. Functions & Arrow Functions ─────────────────────────
test('W2: Functions and Arrow Functions', async () => {
    // Traditional function
    function add(a, b) {
        return a + b;
    }

    // Arrow function (concise)
    const multiply = (a, b) => a * b;

    // Arrow with body
    const greet = (name) => {
        const msg = `Hello, ${name}!`;
        return msg;
    };

    // Default parameters
    const power = (base, exp = 2) => base ** exp;

    console.log(add(3, 4));        // 7
    console.log(multiply(3, 4));   // 12
    console.log(greet('Sriram'));   // Hello, Sriram!
    console.log(power(3));         // 9
    console.log(power(3, 3));      // 27

    expect(add(3, 4)).toBe(7);
    expect(multiply(3, 4)).toBe(12);
});

// ─── 2. Destructuring ───────────────────────────────────────
test('W2: Destructuring - array and object', async () => {
    // Array destructuring
    const [first, second, ...rest] = [10, 20, 30, 40, 50];
    console.log(first);  // 10
    console.log(second); // 20
    console.log(rest);   // [30, 40, 50]

    // Object destructuring
    const user = { name: 'Sriram', age: 30, city: 'Bangalore' };
    const { name, age, city } = user;
    console.log(name, age, city);

    // Rename while destructuring
    const { name: userName, age: userAge } = user;
    console.log(userName, userAge);

    // Default values
    const { role = 'admin' } = user;
    console.log(role); // admin (default)

    // Function param destructuring
    const display = ({ name, city }) => `${name} from ${city}`;
    console.log(display(user));

    expect(first).toBe(10);
    expect(name).toBe('Sriram');
});

// ─── 3. Spread & Rest ───────────────────────────────────────
test('W2: Spread and Rest operators', async () => {
    // Spread arrays
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const combined = [...arr1, ...arr2];
    console.log(combined); // [1,2,3,4,5,6]

    // Spread objects (merge)
    const defaults = { theme: 'dark', lang: 'en' };
    const custom   = { lang: 'hi', font: 'large' };
    const config   = { ...defaults, ...custom };
    console.log(config); // { theme:'dark', lang:'hi', font:'large' }

    // Rest parameters
    const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0);
    console.log(sum(1, 2, 3, 4, 5)); // 15

    // Copy array / object (avoid mutation)
    const original = [1, 2, 3];
    const copy = [...original];
    copy.push(4);
    console.log(original); // [1,2,3] — unchanged
    console.log(copy);     // [1,2,3,4]

    expect(combined.length).toBe(6);
    expect(sum(1, 2, 3)).toBe(6);
});

// ─── 4. Promises ────────────────────────────────────────────
test('W2: Promises', async () => {
    // Create a Promise
    const fetchData = (success) => new Promise((resolve, reject) => {
        if (success) {
            resolve({ data: 'user data', status: 200 });
        } else {
            reject(new Error('Network error'));
        }
    });

    // .then() / .catch()
    await fetchData(true)
        .then(res => console.log('Success:', res))
        .catch(err => console.error('Error:', err.message));

    // Promise.all — run multiple in parallel
    const p1 = Promise.resolve(1);
    const p2 = Promise.resolve(2);
    const p3 = Promise.resolve(3);
    const results = await Promise.all([p1, p2, p3]);
    console.log('All results:', results); // [1, 2, 3]

    expect(results).toEqual([1, 2, 3]);
});

// ─── 5. Async / Await ───────────────────────────────────────
test('W2: Async/Await', async ({ page }) => {
    // async/await is syntactic sugar over Promises
    const getTitle = async (url) => {
        await page.goto(url);
        return await page.title();
    };

    const title = await getTitle('https://www.google.com');
    console.log('Title:', title);

    // Error handling with try/catch
    try {
        await page.goto('https://nonexistent.url.xyz', { timeout: 5000 });
    } catch (error) {
        console.log('Caught error:', error.message.substring(0, 60));
    }

    expect(title).toBeTruthy();
});

// ─── 6. Classes & Objects ───────────────────────────────────
test('W2: Classes and Objects', async () => {
    // ES6 Class
    class Animal {
        constructor(name, sound) {
            this.name  = name;
            this.sound = sound;
        }

        speak() {
            return `${this.name} says ${this.sound}`;
        }

        static create(name, sound) {
            return new Animal(name, sound);
        }
    }

    // Inheritance
    class Dog extends Animal {
        constructor(name) {
            super(name, 'Woof');
            this.tricks = [];
        }

        learn(trick) {
            this.tricks.push(trick);
        }

        showTricks() {
            return `${this.name} knows: ${this.tricks.join(', ')}`;
        }
    }

    const cat = new Animal('Cat', 'Meow');
    const dog = new Dog('Rex');
    dog.learn('sit');
    dog.learn('shake');

    console.log(cat.speak());       // Cat says Meow
    console.log(dog.speak());       // Rex says Woof
    console.log(dog.showTricks());  // Rex knows: sit, shake

    expect(cat.speak()).toBe('Cat says Meow');
    expect(dog.tricks.length).toBe(2);
});

// ─── 7. Template Literals & Optional Chaining ───────────────
test('W2: Template Literals and Optional Chaining', async () => {
    const name = 'Sriram';
    const role = 'SDET';

    // Template literals
    const msg = `Hello ${name}, welcome to ${role} training!`;
    console.log(msg);

    // Multi-line
    const html = `
        <div>
            <p>${name}</p>
        </div>
    `;
    console.log(html.trim());

    // Optional chaining (?.)
    const user = {
        profile: {
            address: {
                city: 'Bangalore'
            }
        }
    };

    console.log(user?.profile?.address?.city);    // Bangalore
    console.log(user?.profile?.phone?.number);    // undefined (no error)

    // Nullish coalescing (??)
    const city = user?.profile?.phone?.number ?? 'Not provided';
    console.log(city); // Not provided

    expect(msg).toContain('Sriram');
    expect(city).toBe('Not provided');
});
