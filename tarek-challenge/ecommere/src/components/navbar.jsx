import "./navbar.css";

export function Navbar({ cartCount }) {
  return (
    <>
      <p>Droplify</p>
      <input type="text" placeholder="search" />
      <select>
        <option value="">Sort by price</option>
        <option value="asc">Price: Low → High</option>
        <option value="desc">Price: High → Low</option>
      </select>
      <button>Cart ({cartCount})</button>
    </>
  )
}