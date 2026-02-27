import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import PRODUCTS from "./data/products";

const styles = {
  app: { fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#16213e" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 16px" },
  heading: { fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#f9f7f7" },
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function handleAdd(product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function handleIncrease(id) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const product = PRODUCTS.find((p) => p.id === id);
        if (item.qty >= product.stock) return item;
        return { ...item, qty: item.qty + 1 };
      })
    );
  }

  function handleDecrease(id) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function handleRemove(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div style={styles.app}>
      <Navbar cartCount={cartCount} onCartToggle={() => setCartOpen((o) => !o)} />
      <main style={styles.main}>
        <h1 style={styles.heading}>Featured Products</h1>
        <ProductList onAdd={handleAdd} cart={cart} />
      </main>
      {cartOpen && (
        <Cart
          items={cart}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
