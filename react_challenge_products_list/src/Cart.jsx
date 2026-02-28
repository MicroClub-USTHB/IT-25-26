import {CartItem} from "./CartItem.jsx"

export function Cart({productsInCart, onRemoveFromCart}) {
    return(
        <div className="cart">
            <h2>Cart</h2>
            {productsInCart.map((product,i) => (
                <CartItem key={i} 
                {...product} 
                quantity={1}
                onRemoveFromCart={()=>onRemoveFromCart(product.id)}
                />
            )
        )}
        </div>
        
    )
}