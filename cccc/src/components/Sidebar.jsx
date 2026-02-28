import { useState } from "react";

function Sidebar({ selected, onSelect, dark, onToggleDark, wishCount, onWishOpen }) {
  const [faceOpen, setFaceOpen] = useState(true);

  return (
    <nav className="sidebar">

      <button className="sb-btn anav">
        <span>⌂</span> Home
      </button>

      <button className="sb-btn" onClick={onWishOpen}>
        <span>♡</span> Wishlist
        {wishCount > 0 && <span className="wcount">{wishCount}</span>}
      </button>

      <div className="sb-divider" />
      <div className="sb-label">Categories</div>

      <button
        className={`sb-btn ${selected === "all" ? "anav" : ""}`}
        onClick={() => onSelect("all")}
      >
        <span>◈</span> All Products
      </button>

      <div className="sb-group" onClick={() => setFaceOpen(o => !o)}>
        <span>✦ Face Care</span>
        <span style={{ fontSize: 11 }}>{faceOpen ? "▾" : "▸"}</span>
      </div>

      {faceOpen && [
        { id: "serum",       label: "Serum" },
        { id: "moisturizer", label: "Moisturizer" },
        { id: "cleanser",    label: "Cleanser" },
        { id: "set",         label: "Sets" },
      ].map(({ id, label }) => (
        <button
          key={id}
          className={`sb-btn sb-sub ${selected === id ? "acat" : ""}`}
          onClick={() => onSelect(id)}
        >
          {label}
        </button>
      ))}

      <div className="sb-divider" />

      <button className="toggle-row" onClick={onToggleDark}>
        <span>{dark ? "☀" : "◑"}</span>
        {dark ? "Light Mode" : "Dark Mode"}
        <div className={`track ${dark ? "on" : ""}`}>
          <div className="thumb" />
        </div>
      </button>

    </nav>
  );
}

export default Sidebar;