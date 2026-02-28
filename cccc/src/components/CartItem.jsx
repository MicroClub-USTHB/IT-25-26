import { memo } from "react";

const fmt = n => `DA ${n.toLocaleString()}`;

const CartItem = memo(function CartItem({ item, onInc, onDec, onRemove }) {
  return (
    <div className="citem">

      <img className="cimg" src={item.image} alt={item.title} />

      <div className="cinfo">
        <div className="cname">{item.title}</div>
        <div className="cp">{fmt(item.price)}</div>
        <div className="cctrl">
          <button className="qbtn" onClick={() => onDec(item.id)}>−</button>
          <span className="qval">{item.qty}</span>
          <button
            className="qbtn"
            disabled={item.qty >= item.stock}
            onClick={() => onInc(item.id)}
          >+</button>
        </div>
      </div>

      <button className="rmbtn" onClick={() => onRemove(item.id)} title="Remove">✕</button>

    </div>
  );
});

export default CartItem;