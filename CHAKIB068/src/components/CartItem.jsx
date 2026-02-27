const styles = {
  cartItem: {
    display: "flex", gap: 12, alignItems: "flex-start",
    padding: "12px 0", borderBottom: "1px solid #eee",
  },
  cartImg: { width: 64, height: 64, objectFit: "cover", borderRadius: 8 },
  cartTitle: { margin: "0 0 4px", fontWeight: 600, fontSize: 14 },
  cartPrice: { margin: "0 0 8px", color: "#e94560", fontWeight: 700 },
  qtyRow: { display: "flex", alignItems: "center", gap: 10 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd",
    background: "#f5f5f5", cursor: "pointer", fontSize: 16, fontWeight: 700,
  },
  qty: { fontWeight: 600, minWidth: 20, textAlign: "center" },
  removeBtn: {
    background: "none", border: "none", fontSize: 16,
    color: "#aaa", cursor: "pointer", padding: 4,
  },
};

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div style={styles.cartItem}>
      <img src={item.image} alt={item.title} style={styles.cartImg} />
      <div style={{ flex: 1 }}>
        <p style={styles.cartTitle}>{item.title}</p>
        <p style={styles.cartPrice}>${(item.price * item.qty).toFixed(2)}</p>
        <div style={styles.qtyRow}>
          <button style={styles.qtyBtn} onClick={() => onDecrease(item.id)}>−</button>
          <span style={styles.qty}>{item.qty}</span>
          <button style={styles.qtyBtn} onClick={() => onIncrease(item.id)}>+</button>
        </div>
      </div>
      <button style={styles.removeBtn} onClick={() => onRemove(item.id)}>✕</button>
    </div>
  );
}
