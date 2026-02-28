
function RemoveFromCart({onRemoveFromCart}) {
    return (
        <button onClick={onRemoveFromCart}>
            Remove from Cart
        </button>
    )
}
export function CartItem({id, title, price, image, quantity, onRemoveFromCart}) {
    return(
        <div className='cart-item' id={id}>
            <span>
                <h3 className="cart-item-title">{title}</h3>
            </span>
            <p className="cart-item-quantity"> Quantity : {quantity} </p>
            <p className="cart-item--price"> Total Price : {price*quantity}$</p>
            <img className="cart-item-image" width="20" height="20" src={image} />
            <RemoveFromCart onRemoveFromCart={onRemoveFromCart}/>
        </div>
    )
}