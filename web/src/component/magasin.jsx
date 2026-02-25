import React from "react";
import ListProduct from "./list";
import { products } from "../data";

export function Magasin({ chart, addToChart, removeFromChart }) {
  return (
    <div className="magasin">
      <h1>Boutique</h1>
      <ListProduct
        products={products}
        chart={chart}
        addToChart={addToChart}
        removeFromChart={removeFromChart}
      />
    </div>
  );
}