import "./App.css";
import { useState } from "react";
import { ProducList } from "./components/productlist.jsx";
import { Cart } from "./components/cart.jsx";
import { Navbar } from "./components/navbar.jsx";

const products = [
  { id: 1, title: "Wireless Monitor",    price: 299, image: "", stock: 12 },
  { id: 2, title: "Phone Stand Pro",     price: 49,  image: "", stock: 3  },
  { id: 3, title: "Mechanical Keyboard", price: 129, image: "", stock: 0  },
  { id: 4, title: "USB-C Hub",           price: 79,  image: "", stock: 20 },
  { id: 5, title: "Webcam HD",           price: 89,  image: "", stock: 2  },
];

function App() {
  const [cart, setCart] = useState([]);

  function handleAddToCart(id) {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      const product = products.find((p) => p.id === id);
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function handleDecrease(id) {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem.qty === 1) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      ));
    }
  }

  function handleRemove(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <div className="app">
      <Navbar cartCount={cartCount} />
      <div className="app-layout">
        <ProducList onAddToCart={handleAddToCart} />
        <Cart
          cart={cart}
          cartTotal={cartTotal}
          onIncrease={handleAddToCart}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}

export default App;