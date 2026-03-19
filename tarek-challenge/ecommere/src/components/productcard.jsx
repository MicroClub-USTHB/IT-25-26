import "./product.css";


export function ProducCard ({ title, price, image, stock, id }){
  return(
    <>
    <img src={image} alt={title} />
      <p>{title}</p>
      <p>{price}</p> 
      <p>{stock}</p>   
      <button 
      disabled={stock === 0}
      onClick={addingCart}
      >{stock>=0? "Add to stock":"Out of stock"}
      </button>
    </>
  );
}