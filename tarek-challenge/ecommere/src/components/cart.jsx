import "./cart.css";
import { CartItem} from "./cartiteam";
export function Cart({ cart, onIncrease, onDecrease, onRemove }) {
  return <>
  {cart.map(item => (
        < CartItem
          key={item.id}
          id={item.id}
          title={item.title}
          price={item.price}
          qty={item.qty}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />))}
  </>;
}
