const fmt = n => `DA ${n.toLocaleString()}`;

function Wishlist({ wishlist, products, onClose, onAdd }) {
  const items = products.filter(p => wishlist.has(p.id));

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <div className="wipanel">

        <div className="phead">
          <div className="ptitle">Wishlist ♥</div>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="pscroll">
          {items.length === 0 ? (
            <div className="empty">
              <div className="eico">♡</div>
              <div className="etxt">Your wishlist is empty</div>
            </div>
          ) : (
            items.map(p => (
              <div key={p.id} className="citem">
                <img className="cimg" src={p.image} alt={p.title} />
                <div className="cinfo">
                  <div className="cname">{p.title}</div>
                  <div className="cp">{fmt(p.price)}</div>
                </div>
                <button
                  className="wiaddbtn"
                  disabled={p.stock === 0}
                  onClick={() => { onAdd(p); onClose(); }}
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

export default Wishlist;