# JavaScript Fundamentals - Study Notes

---

## 1. Hello World & Data Types

### Console Output
```javascript
console.log("Hello world");
```

### Variables

| Keyword | Scope | Reassignable | Redeclarable |
|---------|-------|--------------|--------------|
| `var`   | Global/Function | Yes | Yes |
| `let`   | Block | Yes | No |
| `const` | Block | No | No |

### Data Types

```javascript
let a = 4;              // number (integer)
let b = 234.6;          // number (float)
var c = "sriram";       // string
let required = true;    // boolean
const pi = 3.14;        // constant
```

### typeof Operator
```javascript
console.log(typeof(a));         // "number"
console.log(typeof(c));         // "string"
console.log(typeof(required));  // "boolean"
```

### Basic Operations
```javascript
var c = a + b;          // arithmetic
console.log(!required); // logical NOT (false)
```

---

## 2. Control Flow & Loops

### If-Else Statement
```javascript
const flag = true;

if (flag) {
    console.log("condition satisfied");
} else {
    console.log("condition not satisfied");
}
```

### While Loop
Executes while condition is true. Condition checked **before** each iteration.

```javascript
var i = 0;
while (i < 10) {
    console.log("i: " + i);
    i++;
}
```

### Do-While Loop
Executes **at least once**, then checks condition.

```javascript
var i = 10;
do {
    console.log("i: " + i);
    i++;
} while (i < 10);
// Output: "i: 10" (runs once even though condition is false)
```

### For Loop
```javascript
for (var i = 1; i < 10; i++) {
    console.log("i: " + i);
}
```

### Practical Example: Find Multiples
```javascript
// Find numbers from 1-10 that are multiples of 2 OR 5
for (var i = 1; i < 10; i++) {
    if (i % 2 == 0 || i % 5 == 0) {
        console.log(i);  // 2, 4, 5, 6, 8
    }
}
```

---

## 3. Arrays

### Creating Arrays
```javascript
var marks = Array(6);                      // Empty array of size 6
marks = new Array(35, 70, 65, 78, 99, 45); // Using constructor
marks = [35, 70, 65, 78, 99, 46];          // Array literal (preferred)
```

### Accessing & Modifying
```javascript
console.log(marks[2]);   // Access element at index 2 (65)
marks[2] = 89;           // Modify element at index 2
```

### Array Properties & Methods

| Method/Property | Description | Example |
|-----------------|-------------|---------|
| `.length` | Array size | `marks.length` → 6 |
| `.push(item)` | Add to end | `marks.push(30)` |
| `.pop()` | Remove from end | `marks.pop()` |
| `.unshift(item)` | Add to beginning | `marks.unshift(12)` |
| `.shift()` | Remove from beginning | `marks.shift()` |
| `.indexOf(item)` | Find index (-1 if not found) | `marks.indexOf(12)` → 0 |
| `.includes(item)` | Check if exists | `marks.includes(12)` → true |
| `.slice(start, end)` | Extract portion | `marks.slice(2, 6)` |

### Iterating Arrays
```javascript
var sum = 0;
for (var i = 0; i < marks.length; i++) {
    sum = sum + marks[i];
}
console.log("Total marks: " + sum);
```

---

## 4. Higher-Order Array Methods

### reduce() - Aggregate to Single Value
Reduces array to a single value using an accumulator.

```javascript
// Syntax: array.reduce((accumulator, currentValue) => operation, initialValue)

var marks = [35, 70, 65, 78, 99, 46];
var sum = marks.reduce((sum, mark) => sum + mark, 0);
console.log(sum);  // 393
```

**Real-world Example: Cart Total Verification**
```javascript
const itemPrices = [19.99, 5.50, 100.00];
const calculatedTotal = itemPrices.reduce((acc, price) => acc + price, 0);
// Result: 125.49
```

### filter() - Select Elements by Condition
Returns new array with elements that pass the test.

```javascript
// Syntax: array.filter(element => condition)

var scores = [12, 13, 14, 16];
var even_scores = scores.filter(score => score % 2 == 0);
console.log(even_scores);  // [12, 14, 16]
```

**Real-world Example: Filter Active Users**
```javascript
var usersJson = {
    users: [
        { "name": "sriram", "status": "active" },
        { "name": "thripura", "status": "active" },
        { "name": "raju", "status": "inactive" }
    ]
};

const activeUsers = usersJson.users.filter(user => user.status === 'active');
console.log(activeUsers.length);  // 2
```

### map() - Transform Each Element
Returns new array with transformed elements.

```javascript
// Syntax: array.map(element => transformation)

var scores_doubled = even_scores.map(score => score * 2);
console.log(scores_doubled);  // [24, 28, 32]
```

### Method Chaining
Combine multiple array methods in sequence.

```javascript
var result = scores
    .filter(score => score % 2 == 0)  // [12, 14, 16]
    .map(score => score * 2)           // [24, 28, 32]
    .reduce((sum, score) => sum + score, 0);  // 84
```

**Real-world Example: Calculate Total Laptop Cost**
```javascript
const inventory = [
    { name: 'MacBook Pro', category: 'Laptop', price: 2000 },
    { name: 'iPhone 15', category: 'Phone', price: 1000 },
    { name: 'Dell XPS', category: 'Laptop', price: 1500 }
];

const totalLaptopCost = inventory
    .filter(item => item.category === 'Laptop')  // Filter laptops only
    .map(item => item.price)                      // Extract prices
    .reduce((sum, price) => sum + price, 0);      // Sum up
// Result: 3500
```

---

## 5. Sorting Arrays

### String Sorting
```javascript
var fruits = ["banana", "mango", "apple", "jackfruit"];
fruits.sort();      // ["apple", "banana", "jackfruit", "mango"]
fruits.reverse();   // ["mango", "jackfruit", "banana", "apple"]
```

### Number Sorting (Important!)
Default `.sort()` converts numbers to strings - **don't use for numbers!**

```javascript
var numbers = [4, 9, 0, 2, 10];
numbers.sort();  // [0, 10, 2, 4, 9] - WRONG! (string comparison)
```

**Correct way - use compare function:**
```javascript
// Ascending order
var sorted_asc = numbers.sort((a, b) => a - b);  // [0, 2, 4, 9, 10]

// Descending order
var sorted_desc = numbers.sort((a, b) => b - a); // [10, 9, 4, 2, 0]
```

**How it works:**
- If `a - b` returns negative → `a` comes first
- If `a - b` returns positive → `b` comes first
- If `a - b` returns 0 → order unchanged

---

## 6. Functions

### Named Function
```javascript
function add(a, b) {
    return a + b;
}
console.log(add(2, 3));  // 5
```

### Anonymous Function (Function Expression)
```javascript
var sumOfIntegers = function(a, b) {
    return a + b;
};
console.log(sumOfIntegers(2, 3));  // 5
```

### Arrow Function (ES6)
Shorter syntax for anonymous functions.

```javascript
// Single expression - implicit return
var diffOfIntegers = (a, b) => a - b;
console.log(diffOfIntegers(5, 3));  // 2

// Multiple statements - explicit return needed
var multiply = (a, b) => {
    let result = a * b;
    return result;
};
```

### Function Comparison

| Type | Syntax | Use Case |
|------|--------|----------|
| Named | `function name() {}` | Reusable, hoisted |
| Anonymous | `var fn = function() {}` | Callbacks, one-time use |
| Arrow | `(params) => expression` | Short callbacks, `this` binding |

---

## 7. Scope

### var - Global/Function Scope
Variable is accessible throughout the function or globally.

```javascript
var greet = "evening";
if (12 == 12) {
    var greet = "afternoon";  // Overwrites outer variable!
}
console.log(greet);  // "afternoon"
```

### let - Block Scope
Variable is only accessible within the block `{}`.

```javascript
var greet = "evening";
if (12 == 12) {
    let greet = "afternoon";  // New variable, only in this block
}
console.log(greet);  // "evening" (outer variable unchanged)
```

### const - Block Scope + Immutable
Same as `let` but value cannot be reassigned.

```javascript
const pi = 3.14;
try {
    pi = 2.55;  // TypeError: Assignment to constant variable
} catch(e) {
    console.log(e.message);  // Note: .message is a property, not method!
}
```

### Scope Summary

| Keyword | Scope | Can Reassign? | Can Redeclare? |
|---------|-------|---------------|----------------|
| `var` | Function/Global | Yes | Yes |
| `let` | Block | Yes | No |
| `const` | Block | No | No |

**Best Practice:** Use `const` by default, `let` when reassignment is needed, avoid `var`.

---

## 8. Strings

### String Properties & Methods

```javascript
let day = "tuesday";

console.log(day.length);        // 7
console.log(day.slice(0, 4));   // "tues"
console.log(day[1]);            // "u" (character at index)
```

### Common String Methods

| Method | Description | Example |
|--------|-------------|---------|
| `.length` | String length | `"hello".length` → 5 |
| `.slice(start, end)` | Extract substring | `"tuesday".slice(0,4)` → "tues" |
| `.split(separator)` | Split into array | `"tuesday".split("s")` → ["tue", "day"] |
| `.trim()` | Remove whitespace | `" hi ".trim()` → "hi" |
| `.indexOf(str)` | Find position | `"hello".indexOf("l")` → 2 |
| `.indexOf(str, from)` | Find from position | `"hello".indexOf("l", 3)` → 3 |

### String to Number Conversion
```javascript
let date = '23';
let nextDate = '27';
let diff = parseInt(nextDate) - parseInt(date);  // 4
console.log(diff.toString());  // "4"
```

### String Concatenation
```javascript
let newQuote = day + " is funday a happy day";
// Or using template literals (ES6):
let newQuote = `${day} is funday a happy day`;
```

### Finding All Occurrences
```javascript
let sentence = "tuesday is funday a happy day";
let searchWord = "day";
let count = 0;
let position = sentence.indexOf(searchWord);

while (position !== -1) {
    count++;
    position = sentence.indexOf(searchWord, position + 1);
}
console.log("Occurrences: " + count);  // 3
```

---

## 9. Error Handling

### Try-Catch Block
```javascript
try {
    // Code that might throw an error
    const pi = 3.14;
    pi = 2.55;  // This will throw an error
} catch(e) {
    // Handle the error
    console.log(e.message);  // "Assignment to constant variable"
}
```

**Important:** `e.message` is a **property**, not a method. Don't use `e.message()`.

---

## Quick Reference Card

### Array Methods Cheat Sheet
```javascript
// Add/Remove
arr.push(item)      // Add to end
arr.pop()           // Remove from end
arr.unshift(item)   // Add to beginning
arr.shift()         // Remove from beginning

// Search
arr.indexOf(item)   // Find index
arr.includes(item)  // Check existence

// Transform
arr.filter(fn)      // Select matching elements
arr.map(fn)         // Transform each element
arr.reduce(fn, init) // Aggregate to single value

// Sort
arr.sort()                  // Alphabetical
arr.sort((a,b) => a-b)      // Numeric ascending
arr.sort((a,b) => b-a)      // Numeric descending
```

### String Methods Cheat Sheet
```javascript
str.length          // Length
str.slice(0, 5)     // Substring
str.split(',')      // To array
str.trim()          // Remove whitespace
str.indexOf('x')    // Find position
str.toUpperCase()   // UPPERCASE
str.toLowerCase()   // lowercase
```

---

*Generated from JavaScript practice files*
