import "./navbar.css";

export function Navbar({ cartCount, search, onSearch, sort, onSort, onCartOpen }){
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-logo-mark">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" />
          </svg>
        </div>
        <span>Droplify</span>
      </div>
      <div className="navbar-search">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle
            cx="6"
            cy="6"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="9.8"
            y1="9.8"
            x2="13"
            y2="13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="navbar-actions">
        <select value={sort} onChange={(e) => onSort(e.target.value)}>
          <option value="">Sort by price</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
     <button className="navbar-cart-btn" onClick={onCartOpen}>
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <path
              d="M2 2h2l2.4 9h8l1.6-6H6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="15.5" r="1.2" fill="currentColor" />
            <circle cx="13" cy="15.5" r="1.2" fill="currentColor" />
          </svg>
          Cart
          <span className="navbar-cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
