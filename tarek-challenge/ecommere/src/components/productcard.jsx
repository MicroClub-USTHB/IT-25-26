import "./product.css";
export function ProducCard ({ title, price, image, stock, id, onAddToCart }){
  return(
    <>
    <div className="product-iteam">
        <img src={image} alt={title} />
      <p>{title}</p>
      <p>{price}</p> 
      <p>{stock}</p>   
      <button 
      disabled={stock === 0}
      onClick={() => onAddToCart(id)}
      >{stock === 0 ? "Out of stock" : "Add to cart"}
      </button>
    </div>
    </>
  );
}