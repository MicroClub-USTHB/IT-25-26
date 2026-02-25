# JavaScript Basics

JavaScript is a programming language used to add logic and behavior to websites.
This document covers the **fundamental concepts of JavaScript**, focusing on logic and the language itself, without interacting with HTML or the browser.

---

## 🎯 Learning Objectives

By the end of this section, learners will be able to:

- Understand the role of JavaScript in web development
- Write basic JavaScript programs
- Use variables, conditions, loops, and functions

---

## 📌 JavaScript Fundamentals

### 1. Variables

Variables are used to store data.

- `var` (old, avoid)
- `let` (mutable)
- `const` (immutable)

```js
let age = 20;
const country = "Algeria";
```

### 2. Data Types

JavaScript supports different types of data:

- Number
- String
- Boolean
- Undefined
- Null
- Object
- Array

```js
let name = "Anouar";
let isStudent = true;
let score = 15;
```

### 3. Operators

**Arithmetic Operators**

- `+ - / % *`

**Comparison Operators**

- `== ===`
- `!= !==`
- `> < >= <=`

**Logical Operators**

- `&& || !`

### 4. Conditions

Conditions allow decision-making in code.

- if
- else if
- else
- switch

```js
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
```

### 5. Loops

Loops are used to repeat code.

- for
- while
- do...while

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

### 6. functions

Functions allow code reuse.

- Function declaration
- Parameters
- Return values
- Arrow functions

```js
function add(a, b) {
  return a + b;
}

const multiply = (a, b) => a * b;
```
