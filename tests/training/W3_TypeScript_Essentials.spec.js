// ============================================================
// WEEK 3 — TypeScript Essentials
// Note: This file uses JS with JSDoc type annotations to
//       demonstrate TypeScript concepts without needing
//       a separate TS config. In real projects use .ts files.
// Topics: Types, Interfaces, Enums, Generics, Access Modifiers,
//         Inheritance, Design Patterns
// ============================================================

const { test, expect } = require('@playwright/test');

// ─── 1. Types ───────────────────────────────────────────────
test('W3: Types - string, number, boolean, array, tuple', async () => {
    // In TypeScript these would be:
    // let name: string = 'Sriram';
    // let age: number = 30;
    // let isActive: boolean = true;
    // let scores: number[] = [90, 85, 92];
    // let tuple: [string, number] = ['Alice', 25];

    // JS equivalent (with runtime type checks)
    const name     = 'Sriram';
    const age      = 30;
    const isActive = true;
    const scores   = [90, 85, 92];
    const tuple    = ['Alice', 25]; // TS: [string, number]

    // Union types → TS: let id: string | number
    const id1 = 'ABC123';
    const id2 = 12345;

    // Type narrowing
    const printId = (id) => {
        if (typeof id === 'string') {
            console.log('String ID:', id.toUpperCase());
        } else {
            console.log('Number ID:', id.toFixed(2));
        }
    };

    printId(id1); // String ID: ABC123
    printId(id2); // Number ID: 12345.00

    expect(typeof name).toBe('string');
    expect(typeof age).toBe('number');
    expect(Array.isArray(scores)).toBe(true);
});

// ─── 2. Interfaces ──────────────────────────────────────────
test('W3: Interfaces', async () => {
    // TS interface:
    // interface User {
    //   id: number;
    //   name: string;
    //   email?: string;  // optional
    // }

    // JS equivalent using JSDoc:
    /** @typedef {{ id: number, name: string, email?: string }} User */

    const createUser = (id, name, email) => ({ id, name, email });

    const validateUser = (user) => {
        if (!user.id || typeof user.id !== 'number') throw new Error('id must be number');
        if (!user.name || typeof user.name !== 'string') throw new Error('name required');
        return true;
    };

    const user1 = createUser(1, 'Sriram', 'sriram@test.com');
    const user2 = createUser(2, 'Priya'); // email optional

    console.log(user1);
    console.log(user2);
    expect(validateUser(user1)).toBe(true);
    expect(user2.email).toBeUndefined();
});

// ─── 3. Enums ───────────────────────────────────────────────
test('W3: Enums', async () => {
    // TS enum:
    // enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE', Pending = 'PENDING' }
    // enum Priority { Low = 1, Medium = 2, High = 3 }

    // JS equivalent (Object.freeze for immutability)
    const Status = Object.freeze({
        Active:   'ACTIVE',
        Inactive: 'INACTIVE',
        Pending:  'PENDING'
    });

    const Priority = Object.freeze({
        Low:    1,
        Medium: 2,
        High:   3
    });

    const ticket = {
        id:       101,
        title:    'Login Bug',
        status:   Status.Active,
        priority: Priority.High
    };

    console.log(ticket);
    console.log(`Status: ${ticket.status}, Priority: ${ticket.priority}`);

    // Simulate TS enum usage in test
    if (ticket.priority === Priority.High) {
        console.log('🔴 High priority — fix immediately!');
    }

    expect(ticket.status).toBe('ACTIVE');
    expect(ticket.priority).toBe(3);
});

// ─── 4. Generics ────────────────────────────────────────────
test('W3: Generics', async () => {
    // TS generics:
    // function identity<T>(arg: T): T { return arg; }
    // function getFirst<T>(arr: T[]): T { return arr[0]; }

    // JS equivalent using generic-like patterns
    const identity = (arg) => arg;

    const getFirst = (arr) => arr[0];

    const wrapInArray = (value) => [value];

    // ApiResponse wrapper — like TS generic Response<T>
    const createResponse = (data, status = 200) => ({ data, status, success: status < 400 });

    console.log(identity('hello'));      // hello
    console.log(identity(42));           // 42
    console.log(getFirst([10, 20, 30])); // 10
    console.log(getFirst(['a', 'b']));   // a
    console.log(wrapInArray('test'));    // ['test']

    const userResponse    = createResponse({ name: 'Sriram' });
    const stringResponse  = createResponse('OK', 200);
    const errorResponse   = createResponse(null, 404);

    console.log(userResponse);
    console.log(stringResponse);
    console.log(errorResponse);

    expect(userResponse.success).toBe(true);
    expect(errorResponse.success).toBe(false);
});

// ─── 5. Access Modifiers & Inheritance ──────────────────────
test('W3: Access Modifiers and Inheritance', async () => {
    // TS:
    // class BankAccount {
    //   private balance: number;
    //   protected owner: string;
    //   public accountId: string;
    // }

    class BankAccount {
        constructor(owner, initialBalance) {
            this._balance  = initialBalance; // private (convention: _prefix)
            this._owner    = owner;          // protected
            this.accountId = `ACC-${Date.now()}`; // public
        }

        // Getter (public read, private write)
        get balance() { return this._balance; }

        deposit(amount) {
            if (amount <= 0) throw new Error('Amount must be positive');
            this._balance += amount;
            console.log(`Deposited ${amount}. Balance: ${this._balance}`);
        }

        _validateWithdrawal(amount) { // protected helper
            return amount > 0 && amount <= this._balance;
        }

        withdraw(amount) {
            if (!this._validateWithdrawal(amount)) throw new Error('Invalid withdrawal');
            this._balance -= amount;
            console.log(`Withdrew ${amount}. Balance: ${this._balance}`);
        }
    }

    class SavingsAccount extends BankAccount {
        constructor(owner, balance, interestRate = 0.05) {
            super(owner, balance);
            this.interestRate = interestRate;
        }

        applyInterest() {
            const interest = this._balance * this.interestRate;
            this.deposit(interest);
            console.log(`Interest applied: ${interest}`);
        }
    }

    const acc = new SavingsAccount('Sriram', 1000, 0.1);
    acc.deposit(500);
    acc.withdraw(200);
    acc.applyInterest();

    expect(acc.balance).toBeGreaterThan(1000);
});

// ─── 6. Design Patterns ─────────────────────────────────────
test('W3: Singleton Pattern', async () => {
    // Singleton — only one instance exists (used in POM for shared state)
    class ConfigManager {
        constructor() {
            if (ConfigManager._instance) return ConfigManager._instance;
            this.config = { baseUrl: 'https://rahulshettyacademy.com', timeout: 30000 };
            ConfigManager._instance = this;
        }

        get(key) { return this.config[key]; }
        set(key, value) { this.config[key] = value; }
    }

    const config1 = new ConfigManager();
    const config2 = new ConfigManager();

    config1.set('env', 'staging');
    console.log(config2.get('env')); // staging — same instance!
    console.log(config1 === config2); // true

    expect(config1 === config2).toBe(true);
    expect(config2.get('env')).toBe('staging');
});

test('W3: Builder Pattern', async () => {
    // Builder — construct complex objects step by step (used in test data setup)
    class UserBuilder {
        constructor() {
            this.user = { role: 'user', active: true }; // defaults
        }

        setName(name)       { this.user.name = name;   return this; }
        setEmail(email)     { this.user.email = email; return this; }
        setRole(role)       { this.user.role = role;   return this; }
        setActive(active)   { this.user.active = active; return this; }

        build() {
            if (!this.user.name)  throw new Error('Name is required');
            if (!this.user.email) throw new Error('Email is required');
            return { ...this.user };
        }
    }

    const admin = new UserBuilder()
        .setName('Sriram')
        .setEmail('sriram@test.com')
        .setRole('admin')
        .build();

    console.log(admin);

    expect(admin.name).toBe('Sriram');
    expect(admin.role).toBe('admin');
    expect(admin.active).toBe(true);
});
