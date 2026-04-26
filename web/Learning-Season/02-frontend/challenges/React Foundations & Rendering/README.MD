# 🛒 Mini Product List – React Challenge

## 📌 Project Overview

In this challenge, you will build a mini E-commerce product listing application using React fundamentals.

The goal is to practice:

- Components
- Props
- Children
- useState
- Conditional Rendering
- Lifting State Up
- Clean Component Architecture
- This project simulates a simplified real-world E-commerce frontend.

## 🎯 Learning Objectives

By completing this challenge, you should be able to:

- Structure a React project properly
- Build reusable components
- Manage state correctly using useState
- Lift state to parent components
- Handle user interactions (add/remove/update items)
- Calculate derived data (totals, quantities)
- Avoid direct state mutation
- Think like a frontend engineer

## 🏗 Project Requirements

### 1️⃣ Product Listing

You must:

Render products dynamically from an array

Each product must include:

```js
Product ={
    id: "id"
    title :"title"
    price :"price"
    image :"image"
    stock :"stock"
}

```

Each product card must display:

- Product image
- Title
- Price
- Stock status
- "Add to Cart" button

Rules:

- If stock = 0 → Show "Out of Stock"
- Disable button if product is unavailable
- Show "Low Stock" badge if stock < 5

---

### 2️⃣ Cart System

You must implement a working cart.

Required Features:

- Add product to cart
- If product already exists → increase quantity
- Prevent quantity from exceeding available stock
- Increase quantity
- Decrease quantity
- Remove product from cart
- Show cart items count in Navbar
- Display total price of cart

use Cases:

1. Quantity cannot go below 1
2. If quantity becomes 0 → remove item
3. Cannot add more than available stock

## 🧱 Suggested Folder Structure (optional)

```bash
src/
├── components/
│ ├── Navbar.jsx
│ ├── ProductList.jsx
│ ├── ProductCard.jsx
│ ├── Cart.jsx
│ ├── CartItem.jsx
│
├── data/
│ ├── products.js
│
├── App.jsx
```

## 🧪 Bonus Challenges (Optional)

If you finish early, implement:

- Sorting by price
- Search by product title
- Save cart in localStorage

## 🏁 Deliverables

Your submission must include:

- Clean folder structure
- Working cart logic
- Proper component separation
- No console errors
- Clean README file
