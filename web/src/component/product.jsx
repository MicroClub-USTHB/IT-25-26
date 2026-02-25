import React, { useState } from "react";

export default function Product({ product, addToChart, removeFromChart, chart }) {
  const [stock, setStock] = useState(product.Stock);
  const dispo = stock > 0;
  const check = chart.includes(product); // ← produit dans le panier ?

  const del = () => setStock(stock - 1);
  const add = () => setStock(stock + 1);
  const addchart = () => addToChart(product);
  const removechart = () => removeFromChart(product);

  return (
    <>
      <div>
        <h3>{product.description}</h3>
        <img src={product.photo} alt={product.description} />
        <div>
          <h3>{product.description}</h3>
          <h3>{product.prix}€</h3>

          {dispo && !check && (
            <button onClick={() => { del(); addchart(); }}>
              Add to chart
            </button>
          )}

          {!dispo && <h2>Sold Out</h2>}

          {check && (
            <button onClick={() => { add(); removechart(); }}>
              Remove from chart
            </button>
          )}
        </div>
      </div>
    </>
  );
}

