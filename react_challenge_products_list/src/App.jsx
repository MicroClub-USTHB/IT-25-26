import { useState } from 'react'
import { ProductsList } from './ProductsList'
import { productsData } from '/src/data.js'
import { Cart } from './Cart'
import "./styles/App.css"
function App() {

  // State containing the products that are currently in the cart 
  const [productsInCart, setProductsInCart] = useState([]);

  // Handler to add products to the cart
  const addToCart = (product) => {
    setProductsInCart([...productsInCart, product])
  }

  // Handler to remove products from the cart 
  const removeFromCart = (idToRemove) => {
    setProductsInCart(productsInCart.filter(product => product.id !== idToRemove));
  }

  // The 
  return(
    <div>
      <h1>Welcome to Rym's Mini E-com website! </h1> 
      <p>We sell a collection of tech products. Hope you'll like them!</p>
      <div className='main-content'>
        <ProductsList className="product-list" products={productsData} onAddToCart={addToCart} />
        <Cart className="cart" productsInCart={productsInCart} onRemoveFromCart={removeFromCart}/>
      </div>
      
    </div>
      
      
    )
}

export default App;
