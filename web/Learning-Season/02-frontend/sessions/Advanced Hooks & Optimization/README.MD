# 🪝✨ Advanced Hooks & Optimization

---

## React Hooks

React Hooks are special functions in React that let you use state, lifecycle features, and other React capabilities inside functional components (without needing classes).

They make your code cleaner, more reusable, and easier to manage.

In React, Hooks are just:

“tools that give your component memory and behavior”

---

### 💾 useState

#### ❓ Example Problem

```js
let count = 0;

function App() {
  return <button onClick={() => count++}>Count: {count}</button>;
}
```

#### ❌ The Core Issue

- React only updates UI when state changes, not normal variables
- When React re-renders, It resets again to 0 You lose your data

#### ✅ Correct Solution: useState

```js
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

#### 🎯 Why This Works

1- React Stores the Value
2- React Knows When to Re-render

---

### ⏳ useEffect

#### The Problem

In React, sometimes we need to run side effects, like:

- Fetching data from an API
- Listening to window resize events
- Updating the document title
- Localstorage

#### The Wrong Solution

A common mistake is trying to do side effects directly in the component body:

```js
function MyComponent() {
  // Wrong: fetching inside the body
  fetch("https://api.example.com/data")
    .then((res) => res.json())
    .then((data) => console.log(data));

  return <div>Hello</div>;
}
```

#### The Correct Solution: useEffect

useEffect allows you to run side effects after the render in a safe way.

```js
import { useEffect, useState } from "react";

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []); // Empty dependency array → runs once after first render

  return <div>{data ? data.title : "Loading..."}</div>;
}
```

✅ Why this works:

- The effect runs after the component renders → no blocking UI
- The empty array [] means run only once → similar to componentDidMount
- Updating state with setData will trigger a re-render safely

dependency array

- Run once: useEffect(() => {...}, [])
- Run on every render: useEffect(() => {...}) → no dependency array
- Run when something changes:

```js
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("Count changed:", count);
}, [count]); // Only runs when `count` changes
```

#### Cleanup side effects:

```js
useEffect(() => {
  const timer = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(timer); // cleanup when component unmounts or before effect runs again
}, []);
```

---

### 🌐 useContext

#### The Problem: Prop Drilling

Imagine you have a React app with a deeply nested component tree:

```js
function App() {
  const user = { name: "Anouar" };
  return <Level1 user={user} />;
}

function Level1({ user }) {
  return <Level2 user={user} />;
}

function Level2({ user }) {
  return <Level3 user={user} />;
}

function Level3({ user }) {
  return <div>Hello, {user.name}!</div>;
}
```

❌ Problem:

- You have to pass user through every level, even if intermediate components don’t use it.
- This is called prop drilling. It gets messy as the app grows.

#### 💡The Solution: useContext

React provides Context to share data without prop drilling.

- Step 1: Create a Context

```js
import { createContext } from "react";

export const UserContext = createContext(null);
```

- Step 2: Provide the Context at a top level

```js
import { UserContext } from "./UserContext";

function App() {
  const user = { name: "Anouar" };

  return (
    <UserContext.Provider value={user}>
      <Level1 />
    </UserContext.Provider>
  );
}
```

- Step 3: Consume the Context wherever needed

```js
import { useContext } from "react";
import { UserContext } from "./UserContext";

function Level3() {
  const user = useContext(UserContext);

  return <div>Hello, {user.name}!</div>;
}
```

✅ Why this is better:

- No more prop drilling 🛑
- Any component inside the provider can access the context directly
- Makes your code cleaner and more maintainable

---

### 🎛️ useReducer

#### ⚡ The Problem: Managing Complex State in a Calculator

Imagine you’re building a simple calculator that can add, subtract, multiply, divide, and clear.

```js
const [result, setResult] = useState(0);

// For each button, you write a separate function
function add(num) {
  setResult(result + num);
}
function subtract(num) {
  setResult(result - num);
}
function multiply(num) {
  setResult(result * num);
}
function divide(num) {
  setResult(result / num);
}
function clear() {
  setResult(0);
}
```

❌ Problems:

- Too many functions for multiple actions
- Hard to maintain or scale

#### ✅ The Correct Solution: useReducer

useReducer is perfect because we can:

- Centralize all state logic in one place (the reducer)
- Handle multiple actions
- Easily extend functionality

- Step 1: Use useReducer in the component

```js
import { useReducer, useState } from "react";

const initialState = 0;

function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState(0);

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h1>Calculator</h1>
      <p>Result: {state}</p>

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(Number(e.target.value))}
        style={{ marginBottom: "10px", width: "100%" }}
      />

      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        <button onClick={() => dispatch({ type: "add", payload: input })}>
          ➕ Add
        </button>
        <button onClick={() => dispatch({ type: "subtract", payload: input })}>
          ➖ Subtract
        </button>
        <button onClick={() => dispatch({ type: "multiply", payload: input })}>
          ✖ Multiply
        </button>
        <button onClick={() => dispatch({ type: "divide", payload: input })}>
          ➗ Divide
        </button>
        <button onClick={() => dispatch({ type: "clear" })}>🧹 Clear</button>
      </div>
    </div>
  );
}

export default Calculator;
```

- Step 1: Define the reducer

```js
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return state + action.payload;
    case "subtract":
      return state - action.payload;
    case "multiply":
      return state * action.payload;
    case "divide":
      return state / action.payload;
    case "clear":
      return 0;
    default:
      return state;
  }
}
```

---

### 🧠 useMemo

#### 🐌 The Problem useMemo Solves

Imagine you have a React component that does some heavy computation or derives values from props/state every render.

Without optimization, React recalculates everything on every render, even if the inputs didn’t change. This can slow down your app. 🚀🐌

Example scenario:

1- You have a component that calculates the sum of a huge array every render.
2- Another state change (like a counter) triggers a re-render.
3- The sum recalculates even though the array didn’t change.

Problem: unnecessary computations cause performance issues.

```js
function App() {
  const [count, setCount] = React.useState(0);

  // Heavy calculation
  const numbers = Array.from({ length: 100000 }, (_, i) => i);
  const sum = numbers.reduce((acc, n) => acc + n, 0); // recalculated every render

  return (
    <div>
      <p>Sum: {sum}</p>
      <button onClick={() => setCount(count + 1)}>Increase: {count}</button>
    </div>
  );
}
```

Problem here:

- Every time you click the button, the component re-renders, and sum recalculates, even though numbers never changed.
- This is wasted work.

#### The Correct Solution with useMemo

useMemo memoizes (remembers) the result of a function until its dependencies change.

```js
import React, { useState, useMemo } from "react";

function App() {
  const [count, setCount] = useState(0);

  const numbers = useMemo(() => {
    console.log("Calculating numbers...");
    return Array.from({ length: 100000 }, (_, i) => i);
  }, []); // empty dependency → run only once

  const sum = useMemo(() => {
    console.log("Calculating sum...");
    return numbers.reduce((acc, n) => acc + n, 0);
  }, [numbers]); // run only if numbers change

  return (
    <div>
      <p>Sum: {sum}</p>
      <button onClick={() => setCount(count + 1)}>Increase: {count}</button>
    </div>
  );
}
```

✅ What happens now:

- numbers array is created once.
- sum is computed once.
- Clicking the button does NOT recalc sum unnecessarily.
- Only recalculates if dependencies change.

#### Key Points

- useMemo does not prevent rendering, it only avoids expensive recalculations.
- Dependencies must include everything used inside the memoized function.
- Overusing useMemo can be unnecessary; use it only for heavy computations. ⚡

---

### 🛠️ What Are Custom Hooks?

A custom hook is basically a JavaScript function whose name starts with use and can call other hooks inside it.

- They allow you to extract and reuse logic across components.
- They do not render anything; they just return values or functions.
- React treats them like normal hooks, so rules of hooks still apply (call at the top level, etc.).

#### Problem Custom Hooks Solve

Imagine multiple components need to:

- Fetch data from an API
- Manage local storage

Without custom hooks: you would duplicate logic in every component.

Problem: code duplication, hard to maintain, inconsistent behavior.

#### Wrong Approach (No Custom Hook)

```js
function ComponentA() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("https://api.example.com/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}

function ComponentB() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("https://api.example.com/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

#### Correct Approach (Using a Custom Hook)

```js
import { useState, useEffect } from "react";

// ✅ Custom hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

// Usage in components
function ComponentA() {
  const { data, loading } = useFetch("https://api.example.com/data");

  if (loading) return <p>Loading...</p>;
  return <div>{JSON.stringify(data)}</div>;
}

function ComponentB() {
  const { data, loading } = useFetch("https://api.example.com/data");

  if (loading) return <p>Loading...</p>;
  return <div>{JSON.stringify(data)}</div>;
}
```

💡 Tip:
Custom hooks are not about UI, they are about logic reuse. For UI reuse, you still make components.
