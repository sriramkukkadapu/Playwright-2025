# ⚡ JavaScript Complete Cheat Sheet (with Playwright Automation Tips)

A comprehensive, beginner-to-advanced reference guide covering core JavaScript fundamentals, ES6+ features, Object-Oriented Programming (OOP), and practical integration with **Playwright Test Automation**.

---

## 📑 Table of Contents
1. [Installation & Setup](#1-installation--setup)
2. [Printing in JavaScript](#2-printing-in-javascript)
3. [Variables (`var`, `let`, `const`)](#3-variables-var-let-const)
4. [Data Types (Primitive vs Non-Primitive)](#4-data-types)
5. [Operators](#5-operators)
6. [Conditional Statements](#6-conditional-statements)
7. [Loops (`for`, `while`, `do...while`, `for...of`, `for...in`)](#7-loops)
8. [Functions (Declarations, Expressions, Arrow Functions, Defaults)](#8-functions)
9. [Arrays & Array Methods](#9-arrays)
10. [Strings & String Methods](#10-strings)
11. [Objects](#11-objects)
12. [DOM (Document Object Model)](#12-dom-document-object-model)
13. [Destructuring, Spread & Rest Operators](#13-destructuring-spread--rest)
14. [Callbacks & Higher-Order Functions](#14-callbacks--higher-order-functions)
15. [Promises & Async / Await](#15-promises--async--await)
16. [Error Handling, Modules & JS for Playwright](#16-error-handling-modules--js-for-playwright)
17. [Object-Oriented Programming (OOPs in ES6+) & Page Object Model (POM)](#17-oops-in-javascript-es6)

---

## 1. Installation & Setup

* **Definition:** JavaScript is a lightweight, interpreted programming language used to make web pages interactive.
* **No installation needed for browsers** – Every modern browser has a built-in JS engine.

### How to Run JavaScript?
1. **Browser Console:**
   * Open any website $\rightarrow$ Press `F12` (or Right Click $\rightarrow$ Inspect) $\rightarrow$ Go to **Console** tab $\rightarrow$ Write JS code and press `Enter`.
2. **VS Code / Local Machine:**
   * Install **Node.js**
   * Write code in a `.js` file (e.g., `app.js`)
   * Run using terminal:
     ```bash
     node filename.js
     ```

---

## 2. Printing in JavaScript

* **Definition:** Printing means displaying output to the user or developer console. We use the `console` object in JS.

### Common Methods & Examples
```javascript
// 1. Normal output
console.log("Hello, JS!"); // Output: Hello, JS!

// 2. Error message (displayed in red in browser console)
console.error("Something went wrong!");

// 3. Warning message (displayed in yellow in browser console)
console.warn("This is a warning!");

// 4. Display tabular data
console.table({ name: "Sumedha", age: 21, city: "Hyd" });
```

---

## 3. Variables in JavaScript

* **Definition:** Variables are containers used to store data values.
* In JavaScript, we declare variables using `var`, `let`, or `const`.

### Types of Declaration

| Keyword | Scope | Re-assignable? | Re-declarable? | Hoisting | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `var` | Function Scoped | Yes | Yes | Hoisted (initialized as `undefined`) | Old way (Avoid in modern JS) |
| `let` | Block Scoped `{}` | Yes | No | Hoisted (Temporal Dead Zone) | Use when value will change |
| `const` | Block Scoped `{}` | No | No | Hoisted (Temporal Dead Zone) | Use when value should not change |

### Syntax & Examples
```javascript
var x = 10;     // Old way
let y = 20;     // Can be updated
y = 30;         // Valid

const z = 40;   // Cannot be updated
// z = 50;      // ❌ Error: Assignment to constant variable
```

### Key Rules
* Always prefer `let` and `const` over `var`.
* Variable names are **case-sensitive** (`age`, `Age`, and `AGE` are 3 different variables).

> **💡 Tip for Playwright:**  
> Use variables to store locators, URLs, test credentials, and element handles:  
> ```javascript
> const loginBtn = page.locator("#login");
> const baseUrl = "https://example.com";
> ```

---

## 4. Data Types

Data types define the type of value a variable can hold.

```
                  ┌────────────────────────┐
                  │    JavaScript Types    │
                  └───────────┬────────────┘
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
┌──────────────────┐                     ┌──────────────────┐
│  Primitive Types │ (Stack memory)      │  Non-Primitive   │ (Heap reference)
├──────────────────┤                     ├──────────────────┤
│ 1. string        │                     │ 1. Object        │
│ 2. number        │                     │ 2. Array         │
│ 3. boolean       │                     │ 3. Function      │
│ 4. undefined     │                     └──────────────────┘
│ 5. null          │
│ 6. Symbol (ES6)  │
│ 7. BigInt (2020) │
└──────────────────┘
```

### 1. Primitive Data Types (Stored by Value in Stack)
```javascript
let name = "Hello";              // 1. string (text)
let age = 25;                    // 2. number (integer)
let pi = 3.14;                   // 2. number (float)
let isPassed = true;             // 3. boolean (true / false)
let city;                        // 4. undefined (declared but no value assigned)
let score = null;                // 5. null (empty / intentional absence of value)
let id = Symbol("id");           // 6. Symbol (unique & immutable identifier - ES6)
let bigNum = 12345678901234567890n; // 7. BigInt (large integers - ES2020)
```

### 2. Non-Primitive (Reference Types - Stored in Heap)
```javascript
// Object (collection of key-value pairs)
let person = { name: "Sumedha", age: 21 };

// Array (ordered list of values)
let numbers = [10, 20, 30, 40];
```

---

## 5. Operators

Operators perform operations on values and variables.

### 1. Arithmetic Operators
`+` (Add), `-` (Subtract), `*` (Multiply), `/` (Divide), `%` (Modulus/Remainder), `**` (Exponentiation), `++` (Increment), `--` (Decrement).

### 2. Assignment Operators
`=` ($x = y$), `+=` ($x = x + y$), `-=` ($x = x - y$), `*=` ($x = x * y$), `/=` ($x = x / y$), `%=` ($x = x \% y$), `**=` ($x = x ** y$).

### 3. Comparison Operators
* `==` : Equal to (loose equality, checks value only with type coercion)
* `!=` : Not equal to
* `===` : **Strict equal to** (checks both value **and** data type) $\rightarrow$ *Recommended!*
* `!==` : Strict not equal to
* `>`, `<`, `>=`, `<=` : Greater than, Less than, Greater than or equal, Less than or equal

### 4. Logical Operators
* `&&` : Logical AND (True only if all conditions are true)
* `||` : Logical OR (True if at least one condition is true)
* `!` : Logical NOT (Inverts boolean value)

### 5. Ternary Operator
Short form for `if...else`:
```javascript
// condition ? value_if_true : value_if_false
let age = 20;
let status = age >= 18 ? "Adult" : "Minor"; // "Adult"
```

### 6. Type Operators
* `typeof` : Returns the type of a variable (`typeof "text"` $\rightarrow$ `"string"`)
* `instanceof` : Checks if an object is an instance of a specific class/constructor

---

## 6. Conditional Statements

Used to execute code blocks based on conditions.

### Syntax & Examples
```javascript
// 1. if Statement
let age = 20;
if (age >= 18) {
  console.log("You can vote");
}

// 2. if...else Statement
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}

// 3. if...else if...else Statement
let marks = 85;
if (marks >= 90) {
  console.log("Grade A");
} else if (marks >= 70) {
  console.log("Grade B");
} else {
  console.log("Grade C");
}
```

> **⚡ Quick Tip:** Always use strict equality (`===`) instead of loose equality (`==`) to prevent unexpected type coercion bugs.

---

## 7. Loops

Loops execute a block of code repeatedly until a condition is met.

* **Why Loops?** Saves time, avoids repetitive code, and keeps logic clean.

### 1. `for` Loop (Used when iterations count is known)
```javascript
for (let i = 1; i <= 5; i++) {
  console.log(i); // Output: 1 2 3 4 5
}
```

### 2. `while` Loop (Condition checked first)
```javascript
let i = 1;
while (i <= 5) {
  console.log(i);
  i++;
}
```

### 3. `do...while` Loop (Executes at least once before checking condition)
```javascript
let i = 1;
do {
  console.log(i);
  i++;
} while (i <= 5);
```

### 4. `for...of` Loop (Iterate over values of arrays, strings, maps, sets)
```javascript
let fruits = ["apple", "banana", "mango"];
for (let fruit of fruits) {
  console.log(fruit); // Output: apple, banana, mango
}
```

### 5. `for...in` Loop (Iterate over keys/properties of an object)
```javascript
let person = { name: "Sumedha", age: 21, city: "Hyd" };
for (let key in person) {
  console.log(key + ": " + person[key]);
}
// Output:
// name: Sumedha
// age: 21
// city: Hyd
```

### 6. `break` and `continue`
* `break` : Terminates the loop immediately.
* `continue` : Skips the current iteration and jumps to the next.

```javascript
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue; // Skips 3
  if (i === 5) break;    // Stops before 5
  console.log(i);        // Output: 1, 2, 4
}
```

---

## 8. Functions

A function is a block of reusable code designed to perform a specific task.

### 1. Function Declaration (Named Function)
Hoisted to the top of scope (can be called before declaration).
```javascript
function add(a, b) {
  return a + b;
}
console.log(add(5, 3)); // 8
```

### 2. Function Expression
Stored in a variable (not hoisted).
```javascript
const multiply = function (a, b) {
  return a * b;
};
console.log(multiply(4, 5)); // 20
```

### 3. Arrow Function (ES6)
Shorter syntax, does not bind its own `this`.
```javascript
const sum = (a, b) => a + b;
console.log(sum(10, 15)); // 25

const square = x => x * x;
console.log(square(6));   // 36
```

### 4. Parameters vs Arguments
* **Parameters:** Variables defined in the function signature (`name`, `age`).
* **Arguments:** Real values passed during execution (`"Sumedha"`, `21`).

```javascript
function greet(name, age) {
  console.log(`Hello ${name}, you are ${age} years old.`);
}
greet("Sumedha", 21);
```

### 5. Default Parameters (ES6)
```javascript
function greetUser(name = "Guest") {
  console.log("Hello " + name);
}
greetUser();          // Hello Guest
greetUser("Sumedha"); // Hello Sumedha
```

> **💡 Tip for Playwright:**  
> Wrap repetitive test actions into reusable async helper functions:  
> ```javascript
> async function login(page, user, pass) {
>   await page.fill("#user", user);
>   await page.fill("#pass", pass);
>   await page.click("#loginBtn");
> }
> ```

---

## 9. Arrays

An array is a special variable that holds an ordered collection of multiple values (zero-indexed).

### 1. Creating & Accessing
```javascript
let fruits = ["apple", "banana", "mango"];
console.log(fruits[0]); // "apple"
console.log(fruits[1]); // "banana"
console.log(fruits[3]); // undefined

fruits[1] = "orange";   // Change element
console.log(fruits);    // ["apple", "orange", "mango"]
```

### 2. Common Array Methods
```javascript
let arr = [1, 2, 3];

arr.push(4);          // Adds to end         -> [1, 2, 3, 4]
arr.pop();            // Removes from end    -> [1, 2, 3]
arr.unshift(0);       // Adds to beginning   -> [0, 1, 2, 3]
arr.shift();          // Removes from front  -> [1, 2, 3]

console.log(arr.length);        // 3
console.log(arr.indexOf(2));    // 1
console.log(arr.includes(5));   // false
```

### 3. Multidimensional & Mixed Arrays
```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
console.log(matrix[1][2]); // 6 (Row 1, Column 2)

let mixed = ["hello", 25, true, null, undefined, { name: "Sam" }];
```

> **💡 Tip for Playwright:**  
> When handling multiple elements (e.g. lists, table rows, links), `.all()` returns an array of locators to iterate over:  
> ```javascript
> const buttons = await page.locator("button").all();
> for (let btn of buttons) {
>   console.log(await btn.textContent());
> }
> ```

---

## 10. Strings

A string is an immutable sequence of characters used to represent text.

### 1. Methods & Properties
```javascript
let str = "  Hello JavaScript!  ";

console.log(str.length);                   // Character count
console.log(str.toUpperCase());            // "  HELLO JAVASCRIPT!  "
console.log(str.toLowerCase());            // "  hello javascript!  "
console.log(str.trim());                   // "Hello JavaScript!" (removes outer whitespace)
console.log(str.includes("Java"));         // true
console.log(str.trim().startsWith("He"));  // true
console.log(str.trim().endsWith("!"));     // true
console.log(str.slice(2, 7));              // Extracts substring
```

### 2. Template Literals (ES6 Backticks)
```javascript
let user = "Sumedha";
let age = 21;
let message = `Hello ${user}, you are ${age} years old.`;
console.log(message);
```

### 3. Type Conversion
```javascript
// String to Number
let strNum = "123";
let num = Number(strNum);      // 123
let parsed = parseInt("124px"); // 124

// Number to String
let val = 456;
let textVal = String(val);     // "456"
let textVal2 = val.toString(); // "456"
```

> **💡 Tip for Playwright:**  
> Use template literals and string assertions for clean dynamic locators and validations:  
> ```javascript
> await expect(page.locator("h1")).toHaveText("Welcome");
> await expect(page.locator(".msg")).toContainText("Success");
> ```

---

## 11. Objects

Objects store collections of key-value pairs (`key: value`). Keys are strings/symbols, and values can be any data type.

### 1. Object Operations
```javascript
let person = {
  name: "Sumedha",
  age: 21,
  city: "Hyd"
};

// Accessing
console.log(person.name);        // Dot notation: "Sumedha"
console.log(person["age"]);      // Bracket notation: 21

// Adding & Updating
person.email = "sumedha@gmail.com"; // Add new property
person.city = "Hyderabad";          // Update existing property

// Deleting
delete person.age;

// Checking property existence
console.log("name" in person);   // true
console.log("age" in person);    // false
```

### 2. Nested Objects & Methods
```javascript
let student = {
  name: "Sumedha",
  details: {
    age: 21,
    city: "Hyd"
  },
  greet: function() {
    console.log("Hello " + this.name);
  }
};

console.log(student.details.city); // "Hyd"
student.greet();                   // "Hello Sumedha"
```

### 3. Shorthand Property (ES6)
```javascript
let name = "Sumedha";
let age = 21;
let user = { name, age }; // { name: "Sumedha", age: 21 }
```

> **💡 Tip for Playwright:**  
> Use structured objects for environment configurations, test users, and payload datasets:  
> ```javascript
> const testUser = { username: "admin", password: "Password123" };
> await page.fill("#user", testUser.username);
> await page.fill("#pass", testUser.password);
> ```

---

## 12. DOM (Document Object Model)

The DOM is the programming interface for HTML web documents. It represents the page so programs can change document structure, style, and content dynamically.

### 1. Selecting Elements
```javascript
document.getElementById("title");            // By ID
document.getElementsByClassName("box");     // By Class Name
document.getElementsByTagName("p");          // By Tag Name
document.querySelector(".box");              // First matching CSS selector
document.querySelectorAll(".box");           // All matching CSS selectors
```

### 2. Content & Styles Manipulation
```javascript
let el = document.getElementById("title");
el.innerHTML = "<b>Hello JavaScript!</b>"; // Changes HTML content
el.innerText = "Hello JS!";                 // Changes visible text
el.textContent = "Hello Everyone!";         // Changes text (ignores styling)
el.value = "Sumedha";                       // Changes input field value

// Modifying CSS Styles
el.style.color = "red";
el.style.backgroundColor = "yellow";

// ClassList manipulation
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");
el.classList.contains("active"); // true / false
```

### 3. Event Handling
```javascript
let btn = document.getElementById("btn");
btn.addEventListener("click", function() {
  alert("Button Clicked!");
});
```

---

## 13. Destructuring, Spread & Rest

### 1. Array & Object Destructuring
```javascript
// Array Destructuring
let arr = [10, 20, 30];
let [a, b, c] = arr;               // a=10, b=20, c=30
let [first, , third] = arr;        // Skip elements -> first=10, third=30
let [x, y, z = 0] = [10, 20];      // Default values -> z=0

// Object Destructuring
let person = { name: "Sumedha", age: 21, city: "Hyd" };
let { name, age } = person;        // name="Sumedha", age=21
let { name: userName } = person;   // Renaming -> userName="Sumedha"
let { country = "India" } = person;// Default values
```

### 2. Spread Operator (`...` Expands)
```javascript
// Copy & Merge Arrays
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Copy & Merge Objects
let obj1 = { a: 1, b: 2 };
let obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

### 3. Rest Operator (`...` Collects)
```javascript
// Collect remaining elements
let [firstNum, ...restNums] = [1, 2, 3, 4, 5];
console.log(restNums); // [2, 3, 4, 5]

let { name: pName, ...otherInfo } = { name: "Sumedha", age: 21, city: "Hyd" };
console.log(otherInfo); // { age: 21, city: "Hyd" }
```

> **💡 Tip for Playwright:**  
> Use spread syntax to override default browser/viewport context options:  
> ```javascript
> const defaultOptions = { headless: true, timeout: 30000 };
> const customOptions = { ...defaultOptions, viewport: { width: 1280, height: 720 } };
> ```

---

## 14. Callbacks & Higher-Order Functions

* **Callback:** A function passed as an argument to another function, to be executed later.
* **Higher-Order Function (HOF):** A function that takes one or more functions as arguments OR returns a function.

```javascript
// Callback Example
function greet(name, callback) {
  console.log("Hello, " + name);
  callback();
}
function sayBye() {
  console.log("Goodbye!");
}
greet("Sumedha", sayBye);
```

### Built-in Array Higher-Order Functions
```javascript
let nums = [1, 2, 3, 4];

// 1. forEach (executes for each element)
nums.forEach(n => console.log(n));

// 2. map (returns new array with transformed values)
let squares = nums.map(n => n * n); // [1, 4, 9, 16]

// 3. filter (returns elements that pass condition)
let evens = nums.filter(n => n % 2 === 0); // [2, 4]

// 4. reduce (reduces array to single value)
let sum = nums.reduce((acc, curr) => acc + curr, 0); // 10
```

---

## 15. Promises & Async / Await

* **Promise:** An object representing the eventual completion (or failure) of an asynchronous operation.
  * 3 States: `Pending`, `Fulfilled` (`resolve`), `Rejected` (`reject`).

### 1. Promises (`.then()`, `.catch()`, `.finally()`)
```javascript
let promise = new Promise((resolve, reject) => {
  let success = true;
  if (success) {
    resolve("Data loaded successfully!");
  } else {
    reject("Error loading data");
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Execution Finished"));
```

### 2. `async` / `await` (Modern synchronous-looking style)
```javascript
async function fetchData() {
  try {
    console.log("Fetching...");
    let response = await new Promise((resolve) => {
      setTimeout(() => resolve("Here is your data"), 1500);
    });
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("Request Completed");
  }
}
fetchData();
```

### 3. Multiple Promises
* `Promise.all([p1, p2, p3])` : Resolves when **all** promises resolve (fails if any one fails).
* `Promise.race([p1, p2, p3])` : Resolves/rejects as soon as the **first** promise settles.

> **💡 Tip for Playwright:**  
> Playwright methods are asynchronous and return Promises. Always use `await` before browser/page actions:  
> ```javascript
> await page.click("#login");
> await page.fill("#user", "Sumedha");
> await expect(page.locator(".welcome")).toBeVisible();
> ```

---

## 16. Error Handling, Modules & JS for Playwright

### 1. `try...catch...finally` & Custom Errors
```javascript
function validateAge(age) {
  if (age < 18) {
    throw new Error("Age must be 18 or above");
  }
  return "Valid age";
}

try {
  validateAge(16);
} catch (err) {
  console.log("Caught Error:", err.message);
} finally {
  console.log("Validation step completed.");
}
```

### 2. ES6 Modules (`export` & `import`)
```javascript
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.1416;
export default function greet(name) { return `Hello ${name}`; }

// app.js
import greet, { add, PI } from "./math.js";
console.log(add(5, 3));
console.log(greet("Sumedha"));
```

### 3. Top 5 JS Concepts Most Important for Playwright
1. **DOM & Selectors:** Understanding CSS/XPath to write solid locators.
2. **Async / Await:** Handling non-blocking browser automation calls.
3. **Promises:** Understanding promise resolution, retries, and timeouts.
4. **Functions & Modules:** Creating clean helper functions and Page Object Models.
5. **Objects & Arrays:** Managing test data, fixtures, and multi-element assertions.

```javascript
// Example Playwright Test
import { test, expect } from "@playwright/test";

test("Login verification test", async ({ page }) => {
  try {
    await page.goto("https://example.com");
    await page.fill("#user", "Sumedha");
    await page.fill("#pass", "1234");
    await page.click("#login");
    await expect(page.locator(".welcome")).toBeVisible();
  } catch (error) {
    console.error("Test failed:", error.message);
    await page.screenshot({ path: "error.png" });
  }
});
```

---

## 17. OOPs in JavaScript (ES6+)

Object-Oriented Programming helps organize code for real-world projects and is the core architecture behind the **Page Object Model (POM)** in Playwright.

### 1. Class, Constructor & `this` Keyword
```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getInfo() {
    return `${this.name} (${this.email})`;
  }
}

const u1 = new User("Sumedha", "sumedha@mail.com");
console.log(u1.getInfo()); // "Sumedha (sumedha@mail.com)"
```

### 2. Encapsulation (Private Fields `#`)
```javascript
class BankAccount {
  #balance = 0; // Private field

  constructor(owner, balance) {
    this.owner = owner;
    this.#balance = balance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance; // Controlled access
  }
}

let acc = new BankAccount("Sumedha", 1000);
acc.deposit(500);
console.log(acc.getBalance()); // 1500
// console.log(acc.#balance);   // ❌ SyntaxError: Private field
```

### 3. Inheritance (`extends`, `super`) & Polymorphism
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return "Some sound";
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // Call parent constructor
  }
  // Polymorphism: Method Overriding
  speak() {
    return "Bark";
  }
}

let d = new Dog("Buddy");
console.log(d.name);    // "Buddy"
console.log(d.speak());   // "Bark"
```

### 4. OOPs Core Concepts Summary
| Concept | Definition & Playwright Use Case |
| :--- | :--- |
| **Class & Object** | Blueprint for web pages (e.g., `LoginPage`, `DashboardPage`). |
| **Constructor** | Initializes page locators when the class instance is created. |
| **`this`** | Refers to the current class instance and its locators/methods. |
| **Encapsulation** | Hiding internal locator implementation details inside the page class. |
| **Inheritance** | Child page classes inherit common actions from `BasePage`. |
| **Polymorphism** | Overriding base methods (e.g., custom `waitForLoaded()` per page). |
| **Abstraction** | Test files call high-level actions (`loginPage.login()`) without knowing DOM details. |

---

### 5. Playwright Page Object Model (POM) Example
```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#user");
    this.passwordInput = page.locator("#pass");
    this.loginButton = page.locator("button[type='submit']");
  }

  async navigate() {
    await this.page.goto("https://example.com/login");
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```
