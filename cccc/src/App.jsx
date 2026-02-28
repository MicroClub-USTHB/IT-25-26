import { useState, useMemo, useEffect, useCallback } from "react";
import Navbar      from "./components/Navbar";
import Sidebar     from "./components/Sidebar";
import ProductCard from "./components/ProductCard";
import Cart        from "./components/Cart";
import Wishlist    from "./components/Wishlist";
import products    from "./data/products";
import "./index.css";

function Toast({ msg }) {
  return <div className="toast">{msg}</div>;
}

function App() {
  const [dark,      setDark]      = useState(false);
  const [selected,  setSelected]  = useState("all");
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState("default");
  const [cart,      setCart]      = useState([]);
  const [wishlist,  setWishlist]  = useState(new Set());
  const [cartOpen,  setCartOpen]  = useState(false);
  const [wishOpen,  setWishOpen]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const [toastId,   setToastId]   = useState(0);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const showToast = (msg) => {
    setToast(msg);
    setToastId(k => k + 1);
    setTimeout(() => setToast(null), 2100);
  };

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showToast("Max stock reached!");
          return prev;
        }
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast("Added to cart ✓");
  }, []);

  const incQty = useCallback((id) => {
    setCart(prev =>
      prev.map(i => i.id === id && i.qty < i.stock ? { ...i, qty: i.qty + 1 } : i)
    );
  }, []);

  const decQty = useCallback((id) => {
    setCart(prev =>
      prev.flatMap(i => {
        if (i.id !== id) return [i];
        return i.qty <= 1 ? [] : [{ ...i, qty: i.qty - 1 }];
      })
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const displayed = useMemo(() => {
    let list = selected === "all"
      ? products
      : products.filter(p => p.category === selected);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q));
    }

    if (sort === "asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [selected, search, sort]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const catLabel  = {
    all:         "All Products",
    serum:       "Serum",
    moisturizer: "Moisturizer",
    cleanser:    "Cleanser",
    set:         "Sets",
  }[selected] ?? selected;

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishCount={wishlist.size}
        onCartOpen={() => setCartOpen(true)}
        onWishOpen={() => setWishOpen(true)}
      />

      <div className="layout">
        <Sidebar
          selected={selected}
          onSelect={setSelected}
          dark={dark}
          onToggleDark={() => setDark(d => !d)}
          wishCount={wishlist.size}
          onWishOpen={() => setWishOpen(true)}
        />

        <main className="main">
          <div className="page-head">
            <h1 className="page-title">{catLabel}</h1>
            <p className="page-sub">The Ordinary — Science-Backed Skincare</p>
          </div>

          <div className="toolbar">
            <div className="sw">
              <span className="si">⌕</span>
              <input
                className="sinp"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="ssel"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
            <span className="ctxt">
              {displayed.length} item{displayed.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid">
            {displayed.length === 0 ? (
              <div className="nores">No products found.</div>
            ) : (
              displayed.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={addToCart}
                  wished={wishlist.has(p.id)}
                  onWish={toggleWishlist}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {cartOpen && (
        <Cart
          cart={cart}
          onClose={() => setCartOpen(false)}
          onInc={incQty}
          onDec={decQty}
          onRemove={removeFromCart}
        />
      )}

      {wishOpen && (
        <Wishlist
          wishlist={wishlist}
          products={products}
          onClose={() => setWishOpen(false)}
          onAdd={addToCart}
        />
      )}

      {toast && <Toast key={toastId} msg={toast} />}
    </>
  );
}

export default App;