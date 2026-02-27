import PRODUCTS from "../data/products";
import ProductCard from "./ProductCard";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
};

export default function ProductList({ onAdd, cart }) {
  return (
    <div style={styles.grid}>
      {PRODUCTS.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} cart={cart} />
      ))}
    </div>
  );
}