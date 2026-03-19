import "./product.css";
import { ProducCard } from "./productcard";
export function ProducList() {
  const array = [
    {
       id: crypto.randomUUID(),
      title: "title",
      price: "price",
      image: "",
      stock: "10",
    },
    {
       id: crypto.randomUUID(),
      title: "title",
      price: "price",
      image: "",
      stock: "10",
    },
    {
       id: crypto.randomUUID(),
      title: "title",
      price: "price",
      image: "",
      stock: "10",
    },
    {
       id: crypto.randomUUID(),
      title: "title",
      price: "price",
      image: "",
      stock: "10",
    },
    {
       id: crypto.randomUUID(),
      title: "title",
      price: "price",
      image: "",
      stock: "4",
    },
  ];

  return (
    <>
      {array.map((product) => {
        return (
          <ProducCard
            key={product.id}
            title={product.title}
            price={product.price}
            id={product.id}
            image={product.image}
            stock={product.stock}
          />
        );
      })}
    </>
  );
}
