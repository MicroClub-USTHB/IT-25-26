const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 24px", height: 60, background: "#1a1a2e", color: "#fff",
    position: "sticky", top: 0, zIndex: 100,
  },
  logo: { fontSize: 22, fontWeight: 700 },
  cartBtn: {
    position: "relative", background: "#e94560", border: "none", color: "#fff",
    padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600,
  },
  badge: {
    position: "absolute", top: -8, right: -8, background: "#fff", color: "#e94560",
    borderRadius: "50%", width: 20, height: 20, fontSize: 12, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};

export default function Navbar({ cartCount, onCartToggle }) {
  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🛒 Shop right</span>
      <button style={styles.cartBtn} onClick={onCartToggle}>
        Cart
        {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
      </button>
    </nav>
  );
}
