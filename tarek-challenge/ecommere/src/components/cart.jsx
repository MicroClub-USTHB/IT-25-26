import "./cart.css";
import { CartItem } from "./cartiteam";

export function Cart({ cart, cartTotal, onIncrease, onDecrease, onRemove, onClose }) {
  return (
    <aside className="cart">

        <div className="cart-header">
        <h2 className="cart-title">Your cart</h2>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <span className="cart-count">{cart.reduce((t,i) => t + i.qty, 0)} items</span>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              qty={item.qty}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total-row">
          <span className="cart-total-label">Subtotal</span>
          <span className="cart-total-amount">${cartTotal.toFixed(2)}</span>
        </div>
        <button className="btn-checkout">Checkout →</button>
      </div>

    </aside>
  );
}