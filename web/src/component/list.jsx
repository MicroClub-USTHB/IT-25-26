import Vitrine from "./Vitrine";

export default function ListProduct({ products, chart, addToChart, removeFromChart }) {
  return (
    <>
      {products.map((product) => (
        <Vitrine
          key={product.id}
          product={product}
          chart={chart}
          addToChart={addToChart}
          removeFromChart={removeFromChart}
        />
      ))}
    </>
  );//jsp ida bon reflexe ou pas mais bch n9as les fonction fel app.jsx ou kont dayrha a la base hiya fel app jwzli les produit 9bal ma nzid route
}