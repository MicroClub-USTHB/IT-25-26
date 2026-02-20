# 🚀 React Foundations & Rendering – Session 1 Summary

## 📌 Session Overview

In this first session, we explored the core fundamentals of React and built the foundation needed to create dynamic and interactive user interfaces.

## This session focused on understanding how React works, how components are structured, and how state controls UI behavior.

## 🧩 1️⃣ Introduction to React

### 🔹 What is React?

React is a JavaScript library used to build interactive user interfaces using reusable components.

It allows developers to:

- Build modular UI
- Manage dynamic data
- Create fast and efficient web applications

---

## 🧱 Components

Components are the building blocks of a React application.

- Each component represents a reusable part of the UI.
- Components can be reused multiple times.
- Components can receive data through props.

Example structure:

```js
function Welcome() {
  return <h1>Hello World</h1>;
}
```

---

## ✨ JSX

JSX is a syntax extension for JavaScript that allows us to write HTML-like code inside JavaScript.

Key rules:

- Use className instead of class
- Wrap multiple elements in a single parent
- Use {} to inject JavaScript inside JSX

Example:

```js
const name = "Anouar";
return <h1>Hello {name}</h1>;
```

---

## 🎨 Styling in React

We learned different ways to style components:

- CSS files
- Inline styles
- Conditional styling using JavaScript logic

Example:

```js
<div style={{ color: "red" }}>Styled Text</div>
```

---

## 📦 Props & Children

### 🔹 Props

Props allow us to pass data from parent components to child components.

Example:

```js
<Product title="Laptop" price={1200} />
```

### 🔹 Children

The **children** prop allows components to wrap and render nested content.

Example:

```js
<Card>
  <p>This is inside the card</p>
</Card>
```

---

## 🔁 2️⃣ Rendering in React

---

### 📋 List Rendering

We learned how to render lists dynamically using .map().

Example:

```js
products.map((product) => <ProductCard key={product.id} {...product} />);
```

Important:

- Always provide a unique key prop.

### 🔀 Conditional Rendering

React allows rendering UI conditionally using:

- Ternary operator
- Logical AND (&&)
- If statements

Example:

```js
{
  isLoggedIn ? <Dashboard /> : <Login />;
}
```

---

## 🧠 What is State in JavaScript?

State represents data that changes over time.

When state changes:

- The UI updates automatically.

### 🔄 useState in React

We used the useState hook to manage component state.

Example:

```js
const [count, setCount] = useState(0);
```

- **count** → current state
- **setCount** → function to update state

When state updates:

- React re-renders the component

---

## ⚙️ Virtual DOM

We discussed the concept of the Virtual DOM:

- React creates a virtual copy of the real DOM.
- When state changes, React:
  1. Updates the Virtual DOM
  2. Compares it with the previous version
  3. Updates only the changed parts in the real DOM

This makes React fast and efficient.
