// ============================================================
// WEEK 1 — JavaScript Foundations
// Topics: Variables, Data Types, Conditionals, Loops, Arrays
// ============================================================

const { test, expect } = require('@playwright/test');

// ─── 1. Variables ────────────────────────────────────────────
test('W1: Variables - let, const, var', async ({ page }) => {
    var oldStyle  = 'avoid using var';   // function scoped, hoisted
    let mutable   = 'can be reassigned'; // block scoped
    const fixed   = 'cannot reassign';   // block scoped, constant

    mutable = 'changed!';
    // fixed = 'error'; // ❌ TypeError

    console.log(oldStyle, mutable, fixed);

    await page.goto('https://www.google.com');
    const title = await page.title();
    expect(title).toBeTruthy();
});

// ─── 2. Data Types & Operators ───────────────────────────────
test('W1: Data Types and Operators', async () => {
    // Primitive types
    const str     = 'hello';           // string
    const num     = 42;                // number
    const bool    = true;              // boolean
    const nothing = null;              // null
    let undef;                         // undefined

    // Type checks
    console.log(typeof str);     // string
    console.log(typeof num);     // number
    console.log(typeof bool);    // boolean
    console.log(typeof nothing); // object (JS quirk)
    console.log(typeof undef);   // undefined

    // Operators
    console.log(5 + 3);   // 8
    console.log(10 - 4);  // 6
    console.log(3 * 4);   // 12
    console.log(10 / 2);  // 5
    console.log(10 % 3);  // 1 (modulus)
    console.log(2 ** 3);  // 8 (exponent)

    // Comparison
    console.log(5 == '5');  // true  (loose equality)
    console.log(5 === '5'); // false (strict equality) ← always use this
    console.log(5 !== 3);   // true

    expect(5 === 5).toBe(true);
});

// ─── 3. Conditionals ─────────────────────────────────────────
test('W1: Conditionals - if, else, switch', async () => {
    const score = 85;

    // if / else if / else
    let grade;
    if (score >= 90) {
        grade = 'A';
    } else if (score >= 80) {
        grade = 'B';
    } else if (score >= 70) {
        grade = 'C';
    } else {
        grade = 'F';
    }
    console.log('Grade:', grade); // B

    // switch
    const day = 'Monday';
    switch (day) {
        case 'Monday':
        case 'Tuesday':
            console.log('Weekday'); break;
        case 'Saturday':
        case 'Sunday':
            console.log('Weekend'); break;
        default:
            console.log('Unknown');
    }

    // ternary
    const status = score >= 50 ? 'Pass' : 'Fail';
    console.log(status); // Pass

    expect(grade).toBe('B');
    expect(status).toBe('Pass');
});

// ─── 4. Loops ────────────────────────────────────────────────
test('W1: Loops - for, while, forEach', async () => {
    // for loop
    for (let i = 1; i <= 3; i++) {
        console.log('for loop:', i);
    }

    // while loop
    let count = 0;
    while (count < 3) {
        console.log('while:', count);
        count++;
    }

    // forEach
    const fruits = ['apple', 'banana', 'cherry'];
    fruits.forEach((fruit, index) => {
        console.log(`${index}: ${fruit}`);
    });

    // for...of (modern, preferred for arrays)
    for (const fruit of fruits) {
        console.log('of:', fruit);
    }

    expect(fruits.length).toBe(3);
});

// ─── 5. Arrays ───────────────────────────────────────────────
test('W1: Arrays and basic usage', async () => {
    const nums = [10, 20, 30, 40, 50];

    // Access
    console.log(nums[0]);          // 10
    console.log(nums[nums.length - 1]); // 50

    // Add / Remove
    nums.push(60);                 // add to end
    nums.unshift(0);               // add to start
    nums.pop();                    // remove from end
    nums.shift();                  // remove from start

    // Find / Filter / Map
    const found   = nums.find(n => n > 25);           // 30
    const evens   = nums.filter(n => n % 20 === 0);   // [20, 40]
    const doubled = nums.map(n => n * 2);              // [20, 40, 60, 80, 100]

    console.log('found:', found);
    console.log('evens:', evens);
    console.log('doubled:', doubled);

    // includes / indexOf
    console.log(nums.includes(30));   // true
    console.log(nums.indexOf(30));    // 2

    // join / slice
    console.log(nums.join(' - '));    // 10 - 20 - 30 - 40 - 50
    console.log(nums.slice(1, 3));    // [20, 30]

    expect(found).toBe(30);
    expect(evens).toEqual([20, 40]);
});
