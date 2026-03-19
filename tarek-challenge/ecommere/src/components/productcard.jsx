import "./product.css";

export function ProducCard({ title, price, image, stock, id, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={image} alt={title} />
        {stock === 0 && <span className="badge badge--out">Out of stock</span>}
        {stock > 0 && stock < 5 && <span className="badge badge--low">Low stock</span>}
      </div>
      <div className="product-card-body">
        <p className="product-card-title">{title}</p>
        <p className="product-card-price">${price}</p>
        {stock === 0 && <p className="product-card-stock stock--out">Unavailable</p>}
        {stock > 0 && stock < 5 && <p className="product-card-stock stock--warn">Only {stock} left!</p>}
        {stock >= 5 && <p className="product-card-stock">In stock: {stock}</p>}
        <button
          className="btn-add"
          disabled={stock === 0}
          onClick={() => onAddToCart(id)}
        >
          {stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
