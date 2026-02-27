const styles = {
  card: {
    background: "#fff", borderRadius: 12, overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,.08)", display: "flex", flexDirection: "column",
  },
  imgWrap: { position: "relative" },
  img: { width: "100%", height: 200, objectFit: "cover", display: "block" },
  lowBadge: {
    position: "absolute", top: 10, left: 10, background: "#ff9800", color: "#fff",
    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
  },
  outBadge: {
    position: "absolute", top: 10, left: 10, background: "#e94560", color: "#fff",
    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
  },
  cardBody: { padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 600, color: "#222" },
  price: { margin: 0, fontSize: 18, fontWeight: 700, color: "#e94560" },
  addBtn: {
    marginTop: "auto", background: "#1a1a2e", color: "#fff", border: "none",
    padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
  },
  addBtnDisabled: { background: "#ccc", cursor: "not-allowed" },
};

export default function ProductCard({ product, onAdd, cart }) {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 5;

  const cartItem = cart.find((i) => i.id === product.id);
  const maxReached = cartItem && cartItem.qty >= product.stock;

  
  const unavailable = outOfStock || maxReached;

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        <img src={product.image} alt={product.title} style={styles.img} />
        {lowStock && !maxReached && <span style={styles.lowBadge}>Low Stock</span>}
        {outOfStock && <span style={styles.outBadge}>Out of Stock</span>}
        {maxReached && !outOfStock && <span style={styles.outBadge}>Out of Stock</span>}
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{product.title}</h3>
        <p style={styles.price}>${product.price.toFixed(0)}</p>
        <button
          style={{ ...styles.addBtn, ...(unavailable ? styles.addBtnDisabled : {}) }}
          onClick={() => onAdd(product)}
          disabled={unavailable}
        >
          {unavailable ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}