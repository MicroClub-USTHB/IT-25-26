# JavaScript Basics

JavaScript is a programming language used to add logic, behavior, and interactivity to websites.  
This README explains the core JavaScript concepts, focusing on logic, data structures, and DOM manipulation.

---

## 🎯 Learning Objectives

By the end of this session, learners will be able to:

- Work with objects and arrays
- Use higher-order array functions
- Manipulate numbers using `Number` and `Math` objects
- Apply destructuring
- Interact with the DOM

---

## 1. Objects

### Basic Object

```js
const student = {
  name: "Ali",
  age: 20,
  grade: 15,
};
```

### Object Methods

```js
Object.keys(student);
Object.values(student);
Object.entries(student);
```

### Practical Example

```js
const student = {
  name: "Ali",
  age: 20,
  grade: 15,
};

console.log(Object.keys(student)); // ["name", "age", "grade"]
console.log(Object.values(student)); // ["Ali", 20, 15]
console.log(Object.entries(student)); // [["name","Ali"],["age",20],["grade",15]]
```

---

## 2. Arrays

### Mixed Array

```js
let mixed = [1, "text", true, { name: "Ali" }, [1, 2]];
```

### Array of Objects

```js
let students = [
  { name: "Ali", grade: 12 },
  { name: "Sara", grade: 16 },
  { name: "Omar", grade: 8 },
];
```

---

## 3. Higher-Order Functions

### map

```js
students.map((s) => s.name);
```

```js
const names = students.map((s) => s.name);
console.log(names); // ["Ali", "Sara", "Omar"]
```

---

### filter

```js
students.filter((s) => s.grade >= 10);
```

```js
const passedStudents = students.filter((s) => s.grade >= 10);
console.log(passedStudents);
```

---

### reduce

```js
students.reduce((sum, s) => sum + s.grade, 0);
```

```js
const total = students.reduce((sum, s) => sum + s.grade, 0);
console.log(total); // 36
```

---

### forEach

```js
students.forEach((s) => console.log(s.name));
```

---

## 4. Number Object

### Basic Conversions

```js
Number("10"); // 10
parseInt("15"); // 15
parseFloat("12.5"); // 12.5
Number.isInteger(10); // true
isNaN("abc"); // true
```

### Formatting Numbers

```js
let x = 12.456;
x.toFixed(2); // "12.46"
```

---

## 5. Math Object

```js
Math.round(4.6); // 5
Math.floor(4.9); // 4
Math.ceil(4.1); // 5
Math.max(1, 5, 3); // 5
Math.min(1, 5, 3); // 1
```

```js
console.log(Math.round(4.6));
console.log(Math.floor(4.9));
console.log(Math.ceil(4.1));
console.log(Math.max(1, 5, 3));
console.log(Math.min(1, 5, 3));
```

---

## 6. Destructuring

### Without Destructuring

```js
let user = {
  name: "Ali",
  age: 20,
};

let name = user.name;
let age = user.age;
```

---

### With Destructuring

```js
let { name, age } = user;
```

---

### Array Destructuring

```js
let colors = ["red", "green", "blue"];
let [first, second] = colors;

console.log(first); // "red"
console.log(second); // "green"
```

---

### Destructuring in Functions

```js
function printUser({ name, age }) {
  console.log(name, age);
}

printUser(user);
```

---

## 7. DOM (Document Object Model)

### Selecting Elements

```js
document.getElementById("demo");
document.querySelector("h1");
```

---

### Modifying Content

```js
let title = document.querySelector("h1");
title.textContent = "Hello JS";
```

---

### Handling Events

```js
let btn = document.querySelector("button");

btn.addEventListener("click", () => {
  alert("Clicked!");
});
```

---

## ✅ Summary

- Objects and object methods
- Arrays and higher-order functions
- Number and Math utilities
- Destructuring objects and arrays
- Basic DOM manipulation and events

You now have a solid foundation to start building interactive web applications 🚀
