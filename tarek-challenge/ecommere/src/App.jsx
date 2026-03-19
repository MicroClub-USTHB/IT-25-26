import "./App.css";
import { useState } from "react";
import { ProducList } from "./components/productlist.jsx";
import { Cart } from "./components/cart.jsx";
import { Navbar } from "./components/navbar.jsx";

function App() {
  const [cart, setCart] = useState([]);

  function handleDecrease(id) {
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem.qty === 1) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item,
        ),
      );
    }
  }

  function handleRemove(id) {
    setCart(cart.filter((item) => item.id !== id));
  }
  function handleAddToCart(id) {
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      const product = products.find((p) => p.id === id);
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  return (
    <>
      <Navbar />
      <ProducList onAddToCart={handleAddToCart} />
      <Cart
      cart ={cart}
        onIncrease={handleAddToCart}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />
    </>
  );
}
export default App;
