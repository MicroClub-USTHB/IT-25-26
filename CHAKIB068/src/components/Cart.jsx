import CartItem from "./CartItem";
import { useState } from "react";


const styles = {
  success: {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", textAlign: "center", height: "100%", gap: 12,
},
checkmark: { fontSize: 64 },
totalConfirm: { fontSize: 18, color: "#e94560" },
  cartOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
    zIndex: 200, display: "flex", justifyContent: "flex-end",
  },
  cartPanel: {
    background: "#fff", width: 380, maxWidth: "100%", height: "100%",
    overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 4,
  },
  cartHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#555" },
  empty: { color: "#888", marginTop: 32, textAlign: "center" },
  totalRow: {
    display: "flex", justifyContent: "space-between", fontSize: 18,
    padding: "16px 0", borderTop: "2px solid #eee", marginTop: 8,
  },
  checkoutBtn: {
    background: "#e94560", color: "#fff", border: "none", padding: "14px",
    borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 700, marginTop: 8,
  },
};

export default function Cart({ items, onIncrease, onDecrease, onRemove, onClose }) {
  const [ordered, setOrdered] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (ordered) {
    return (
      <div style={styles.cartOverlay}>
        <div style={styles.cartPanel}>
          <div style={styles.success}>
            <span style={styles.checkmark}>✅</span>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
            <p style={styles.totalConfirm}>Total paid: <strong>${total.toFixed(0)}</strong></p>
            <button style={styles.checkoutBtn} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.cartOverlay}>
      <div style={styles.cartPanel}>
        <div style={styles.cartHeader}>
          <h2 style={{ margin: 0 }}>Your Cart</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        {items.length === 0 ? (
          <p style={styles.empty}>Cart is empty</p>
        ) : (
          <>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))}
            <div style={styles.totalRow}>
              <span>Total</span>
              <strong>${total.toFixed(0)}</strong>
            </div>
            <button style={styles.checkoutBtn} onClick={() => setOrdered(true)}>Checkout</button>
          </>
        )}
      </div>
    </div>
  );
}