import { SelectStar } from "./Star";

function Stock({ stock }) {
  return (
    stock > 5 ?
      <p className="product-stock-available">In stock : {stock}</p> :
      stock !== 0 ?
        <p className="product-stock-almost-out">Only {stock} remaining!</p> :
        <p className="product-stock-out">Out of stock</p>
  );
}

function AddToCart({onAddToCart}) {
  return(
    <button onClick={onAddToCart}>
      Add to cart 
    </button>
  )
}

export function Product({id, title, price, stock, image, onAddToCart}) {
  return(
    <div className='product' id={id}>
    <span>
        <h3 className="product-title">{title}</h3>
    </span>
      <p className="product-price">Price : {price}$</p>
      <img width="200" height="200" src={image} />
      <Stock stock={stock}/>
      <AddToCart onAddToCart={onAddToCart}/>
    </div>
    
  );
}