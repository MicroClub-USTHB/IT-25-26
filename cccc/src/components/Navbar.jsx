function Navbar({ cartCount, wishCount, onCartOpen, onWishOpen }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        The <span>Ordinary</span>
      </div>
      <div className="nav-right">
        <button className="icon-btn" onClick={onWishOpen} title="Wishlist">
          ♡
          {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
        </button>
        <button className="icon-btn" onClick={onCartOpen} title="Cart">
          🛒
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}

export default Navbar;