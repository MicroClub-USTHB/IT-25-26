# Droplify — Mini E-Commerce App

A mini e-commerce product listing app built with React. Covers components, props, state, conditional rendering, and lifting state up.

---

## Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Search, sort, cart button
│   ├── ProductList.jsx   # Renders all product cards
│   ├── ProductCard.jsx   # Single product card
│   ├── Cart.jsx          # Cart sidebar
│   └── CartItem.jsx      # Single cart row
├── App.jsx               # Root — state + logic lives here
├── App.css               # App layout
├── index.css             # Global tokens + reset
public/
└── images/               # Product images go here
```

---

## Data Structure

### Product
```js
{
  id: 1,
  title: "Wireless Monitor",
  price: 299,
  image: "/monitor.jpg",
  stock: 12
}
```

### Cart Item
```js
{
  id: 1,
  title: "Wireless Monitor",
  price: 299,
  image: "/monitor.jpg",
  stock: 12,
  qty: 2           // added when item enters cart
}
```

The cart item is a **copy of the product** with `qty` added on top. It never stores `isInCart` or any extra flags — if the item is in the cart array it exists, if not it doesn't.

---

## State

All state lives in `App.jsx` — the closest common parent of every component that needs it.

```js
const [cart, setCart]     = useState([])   // array of cart items
const [search, setSearch] = useState("")   // search string
const [sort, setSort]     = useState("")   // "asc" | "desc" | ""
const [isCartOpen, setIsCartOpen] = useState(false)
```

### Derived values — computed, never stored
```js
const cartCount = cart.reduce((total, item) => total + item.qty, 0)
const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0)
```

These are calculated fresh on every render — no need for extra state.

---

## Data Flow

```
App.jsx
│
│  cart, search, sort, isCartOpen  ← state lives here
│  handleAddToCart()               ← functions defined here
│  handleDecrease()
│  handleRemove()
│
├── Navbar.jsx
│     receives:  cartCount, search, onSearch, sort, onSort, onCartOpen
│     does:      search input → calls onSearch(value)
│                sort select → calls onSort(value)
│                cart button → calls onCartOpen()
│
├── ProductList.jsx
│     receives:  onAddToCart, search, sort
│     does:      filters array by search
│                sorts array by price
│                maps → renders ProductCard for each
│
│     └── ProductCard.jsx
│           receives:  title, price, image, stock, id, onAddToCart
│           does:      displays product info
│                      shows badge if stock === 0 or stock < 5
│                      click "Add to cart" → calls onAddToCart(id)
│
└── Cart.jsx  (only renders when isCartOpen === true)
      receives:  cart, cartTotal, onIncrease, onDecrease, onRemove, onClose
      does:      shows empty state if cart is empty
                 maps → renders CartItem for each
                 shows subtotal

      └── CartItem.jsx
            receives:  id, title, price, qty, onIncrease, onDecrease, onRemove
            does:      click − → calls onDecrease(id)
                       click + → calls onIncrease(id)
                       click ✕ → calls onRemove(id)
```

---

## Core Logic

### handleAddToCart(id)
```js
// Is the product already in the cart?
//   YES → increase its qty by 1
//   NO  → add it fresh with qty: 1

function handleAddToCart(id) {
  const existingItem = cart.find(item => item.id === id)
  if (existingItem) {
    setCart(cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ))
  } else {
    const product = products.find(p => p.id === id)
    setCart([...cart, { ...product, qty: 1 }])
  }
}
```

### handleDecrease(id)
```js
// Is qty currently 1?
//   YES → remove the item completely (filter it out)
//   NO  → decrease qty by 1

function handleDecrease(id) {
  const existingItem = cart.find(item => item.id === id)
  if (existingItem.qty === 1) {
    setCart(cart.filter(item => item.id !== id))
  } else {
    setCart(cart.map(item =>
      item.id === id ? { ...item, qty: item.qty - 1 } : item
    ))
  }
}
```

### handleRemove(id)
```js
// Remove item from cart regardless of qty

function handleRemove(id) {
  setCart(cart.filter(item => item.id !== id))
}
```

---

## Array Methods Used

| Method | What it does | Used for |
|--------|-------------|----------|
| `.find()` | Returns first matching item | Check if item is in cart |
| `.map()` | Returns new array with changes | Update qty of an item |
| `.filter()` | Returns new array without item | Remove item from cart |
| `.reduce()` | Collapses array into single value | cartCount, cartTotal |
| `.sort()` | Reorders array | Sort by price |
| `.includes()` | Checks if string contains another | Search filter |

---

## Conditional Rendering

### Stock badges in ProductCard
```jsx
{stock === 0 && <span className="badge badge--out">Out of stock</span>}
{stock > 0 && stock < 5 && <span className="badge badge--low">Low stock</span>}
```

### Disabled button
```jsx
<button disabled={stock === 0}>
  {stock === 0 ? "Out of stock" : "Add to cart"}
</button>
```

### Empty cart state
```jsx
{cart.length === 0 ? (
  <p>Your cart is empty</p>
) : (
  cart.map(item => <CartItem ... />)
)}
```

### Show/hide cart
```jsx
{isCartOpen && <Cart ... />}
```

---

## Key React Concepts Used

### Lifting State Up
Cart state lives in `App.jsx` — not in `ProductCard` or `Cart` — because both components need access to it. State is lifted to the closest common parent.

### Props Down, Events Up
```
App.jsx defines handleAddToCart()
  → passes it as onAddToCart to ProductList
    → passes it as onAddToCart to ProductCard
      → ProductCard calls onAddToCart(id) on click
        → App.jsx updates cart state
          → UI re-renders
```

### Never Mutate State
```js
// ❌ wrong — mutates existing array
cart.push(product)
item.qty = item.qty + 1

// ✅ correct — creates new array
setCart([...cart, product])
setCart(cart.map(item => ...))
```

React only re-renders when it sees a **new** array or object, not when you modify the existing one.

---

## Bonus Features Implemented

- **Search** — filters products by title in real time
- **Sort** — sorts products by price ascending or descending
- **Cart open/close** — cart toggles via navbar button

---

## How to Run

This project was built with **Vite + React**.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in your browser
Vite will show this in your terminal:
```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Click the link or open `http://localhost:5173` in your browser.

### 5. Build for production (optional)
```bash
npm run build
```
This creates an optimized `dist/` folder ready to deploy.

### Requirements
- Node.js version 18 or higher
- npm version 8 or higher

Check your versions:
```bash
node -v
npm -v
```

---

## Adding Product Images

Place image files in the `public/` folder:

```
public/
  monitor.jpg
  keyboard.jpg
  webcam.jpg
```

Then reference them in `productlist.jsx`:

```js
const array = [
  { id: 1, title: "Wireless Monitor", price: 299, image: "/monitor.jpg", stock: 12 },
]
```