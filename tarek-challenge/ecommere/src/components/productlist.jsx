import "./product.css";
import { ProducCard } from "./productcard";

const array = [
  { id: 1, title: "Wireless Monitor",    price: 299, image: "", stock: 12 },
  { id: 2, title: "Phone Stand Pro",     price: 49,  image: "", stock: 3  },
  { id: 3, title: "Mechanical Keyboard", price: 129, image: "", stock: 0  },
  { id: 4, title: "USB-C Hub",           price: 79,  image: "", stock: 20 },
  { id: 5, title: "Webcam HD",           price: 89,  image: "", stock: 2  },
];

export function ProducList({ onAddToCart,search, sort }) {
    let filtered = array.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase())
  )
  if (sort === "asc") {
    filtered = filtered.sort((a, b) => a.price - b.price)
  }
  if (sort === "desc") {
    filtered = filtered.sort((a, b) => b.price - a.price)
  }

  return (
    <div className="product-list">
      {filtered.map((product) => (
        <ProducCard
          key={product.id}
          title={product.title}
          price={product.price}
          id={product.id}
          image={product.image}
          stock={product.stock}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}