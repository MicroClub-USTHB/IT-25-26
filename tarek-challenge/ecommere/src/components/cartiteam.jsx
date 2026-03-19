import "./cart.css";

export function CartItem({ id, title, price, qty, onIncrease, onDecrease, onRemove }) {
  return (
    <div>
      <p>{title}</p>
      <p>${price}</p>
      <button onClick={() => onDecrease(id)}>−</button>
      <span>{qty}</span>
      <button onClick={() => onIncrease(id)}>+</button>
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  )
}
