import { memo } from "react";

const fmt = n => `DA ${n.toLocaleString()}`;

const ProductCard = memo(function ProductCard({ product, onAdd, wished, onWish }) {
  const outOfStock = product.stock === 0;
  const lowStock   = !outOfStock && product.stock < 5;

  return (
    <div className="card">

      <div className="ciw">
        <img src={product.image} alt={product.title} loading="lazy" />

        {lowStock   && <span className="sbadge blow">Low Stock</span>}
        {outOfStock && <span className="sbadge bout">Out of Stock</span>}

        <button
          className={`wbtn ${wished ? "on" : ""}`}
          onClick={() => onWish(product.id)}
          title={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>

      <div className="cbody">
        <div className="ctitle">{product.title}</div>
        <div className="cprice">{fmt(product.price)}</div>
        <div className={`cstock ${lowStock ? "crit" : ""}`}>
          {outOfStock
            ? "Currently unavailable"
            : lowStock
            ? `Only ${product.stock} left`
            : `${product.stock} in stock`}
        </div>
        <button
          className="addbtn"
          disabled={outOfStock}
          onClick={() => onAdd(product)}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

    </div>
  );
});

export default ProductCard;