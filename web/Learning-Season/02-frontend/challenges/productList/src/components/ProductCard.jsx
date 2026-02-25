import styles from './ProductCard.module.css';

function ProductCard({ product, addToCart }) {
  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.title} className={styles.image} />
      <h2 className={styles.title}>{product.title}</h2>
      <p className={styles.stock}>Stock: {product.stock}</p>
      <p className={styles.price}>${product.price}</p>
      <button
        className={styles.button}
        disabled={product.stock === 0}
        onClick={() => addToCart(product)}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductCard;