import { Product } from "./Product"

export function ProductsList({products, onAddToCart}) {
  return(
    <div>
      <h2>Available Products</h2>
      <article className='product-list'>
        {products.map((product, i) => <Product key={i} onAddToCart={() => onAddToCart(product)} {...product}></Product>)}
      </article>
    </div>

    )
    }