# 🛒 Mini Product List

A mini e-commerce product listing app built with React as part of a frontend fundamentals challenge.

## 📌 What This Project Does

- Displays a list of products fetched from a local data file
- Each product card shows an image, title, price, stock status, and an "Add to Cart" button
- Products with zero stock are marked as **Out of Stock** and the button is disabled
- Products with less than 5 units show a **Low Stock** badge
- A fully working cart lets you add, remove, increase, and decrease item quantities
- The navbar displays the total number of items currently in the cart
- The cart displays the total price of all items

## ⚛️ React Concepts Practiced

- `useState` for managing cart state
- Lifting state up to `App.jsx` so multiple components share the same data
- Passing data and functions down via props
- Conditional rendering for stock badges and button states
- Deriving data from state (total price, item count)
- Avoiding direct state mutation by always returning new arrays

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductCard.module.css
│   ├── Cart.module.css
│   └── Cart.jsx
├── data/
│   └── products.js
├── App.jsx
└── main.jsx
```

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open your browser at `http://localhost:5173`

## 🛠️ Built With

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- CSS Modules