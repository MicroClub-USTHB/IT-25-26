import "./cart.css";

export function CartItem({ id, title, price, qty, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="cart-item">

      <div className="cart-item-thumb">
        <span>{title[0]}</span>
      </div>

      <div className="cart-item-info">
        <p className="cart-item-name">{title}</p>
        <p className="cart-item-price">${price} × {qty}</p>
      </div>

      <div className="cart-item-controls">
        <button
          className="qty-btn"
          onClick={() => onDecrease(id)}
          title={qty === 1 ? "Removes item" : "Decrease qty"}
        >−</button>

        <span className="qty-value">{qty}</span>

        <button
          className="qty-btn"
          onClick={() => onIncrease(id)}
        >+</button>

        <button
          className="remove-btn"
          onClick={() => onRemove(id)}
        >✕</button>
      </div>

    </div>
  );
}