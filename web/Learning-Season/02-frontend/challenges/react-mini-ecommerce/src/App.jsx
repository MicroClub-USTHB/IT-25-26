 import "./App.css"
 import { useState } from "react"
 
 import blamImg from "./photo/blam.jpg"
 import cleanserImg from "./photo/cleanser.jpg" 
 import moisturizerImg from "./photo/moisturizer.jpg" 
 import packImg from "./photo/pack.jpg" 

 const products = [
  { id: 1, title: "PackCurology", price:32, image:packImg,stock: 10 },
  { id: 2, title: "Moisturizer", price: 15, image:moisturizerImg, stock: 6 },
  { id: 3, title: "The Cleanser", price: 20,image:cleanserImg ,stock: 8 },
  { id:4, title: "Lip Blam", price: 6, image:blamImg , stock: 5}
]

function Productcard({ product, addToCart }) {
  return (
     <div className="product-card">
      <img src={product.image}width="150" className="product-img"/>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">{product.price}$</p>
      <p className="product-stock">Stock:{product.stock}</p>

         {product.stock === 0 && (
        <p className="out-stock">Out of Stock</p>
      )}

      {product.stock > 0 && product.stock < 5 && (
        <p className="low-stock">Low Stock</p>
      )}

      

       <button className="add-btn"
        disabled={product.stock === 0}
       onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  )
}
 
function App() {
  const [cart, setCart] = useState([])

 function addToCart(product) {
  setCart(prevCart => {
    const exist= prevCart.find(element => element.id === product.id)

    if (exist) {
      
      if (exist.quantity >= product.stock) return prevCart

      return prevCart.map(element =>
        element.id === product.id
          ? { ...element, quantity: element.quantity + 1 }
          : element
      )
    }

    return [...prevCart, { ...product, quantity: 1 }]
  })
}

function increaseQuantity(id) {
  setCart(prevCart =>
    prevCart.map(element =>
      element.id === id && element.quantity < element.stock
        ? { ...element, quantity: element.quantity + 1 }
        : element 
    )
  )
}

function decreaseQuantity(id) {
  setCart(prevCart =>
    prevCart
      .map(element =>
        element.id === id
          ? { ...element, quantity: element.quantity - 1 }
          : element
      )
      .filter(element=> element.quantity > 0)
  )
}

function removeEelement(id) {
  setCart(prevCart =>
    prevCart.filter (element => element.id !== id)
  )
}

 return (
  <div className="container">

    <h2 className="cart-count">
      Cart: {cart.reduce((total, element) => total + element.quantity, 0)}
    </h2>

    <div className="products">
      {products.map((product) => (
        <Productcard
          key={product.id}
          product={product}
          addToCart={addToCart}
        />
      ))}
    </div>

    <div className="cart-section">
      <h3 className="cart-title">Cart Items</h3>

      {cart.map(element => (
        <div key={element.id} className="cart-item">
          <p>{element.title}</p>
          <p>Price: {element.price}$</p>

          <button onClick={() => decreaseQuantity(element.id)}>-</button>

          <span>{element.quantity}</span>

          <button onClick={() => increaseQuantity(element.id)}>+</button>

          <button onClick={() => removeEelement(element.id)}>
            Remove
          </button>
        </div>
      ))}

      <h3 className="cart-total">
        Total: {
          cart.reduce(
            (total, element) =>
              total + element.price * element.quantity, 0)
        } $
      </h3>
    </div>

  </div>
)
}
export default App
