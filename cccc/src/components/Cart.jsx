import CartItem from "./CartItem";

const fmt = n => `DA ${n.toLocaleString()}`;

function Cart({ cart, onClose, onInc, onDec, onRemove }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <div className="panel">

        <div className="phead">
          <div className="ptitle">Your Cart</div>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="pscroll">
          {cart.length === 0 ? (
            <div className="empty">
              <div className="eico">🛒</div>
              <div className="etxt">Your cart is empty</div>
            </div>
          ) : (
            cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onInc={onInc}
                onDec={onDec}
                onRemove={onRemove}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="pfoot">
            <div className="trow">
              <span className="tlbl">Total</span>
              <span className="tval">{fmt(total)}</span>
            </div>
            <button className="ckbtn">Checkout →</button>
          </div>
        )}

      </div>
    </>
  );
}

export default Cart;