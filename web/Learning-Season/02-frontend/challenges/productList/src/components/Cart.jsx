

import styles from './Cart.module.css';

function Cart({ cart, removeFromCart, updateQuantity }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className={styles.cart}>
                <h2>Your Cart</h2>
                <p>Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className={styles.cart}>
            <h2>Your Cart</h2>
            {cart.map(item => (
                <div key={item.id} className={styles.cartItem}>
                    <img src={item.image} alt={item.title} className={styles.cartItemImage} />
                    <div className={styles.cartItemDetails}>
                        <h3>{item.title}</h3>
                        <p>${item.price}</p>
                        <div className={styles.quantityControls}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                    </div>
                    <button
                        className={styles.removeButton}
                        onClick={() => removeFromCart(item.id)}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <div className={styles.total}>
                <strong>Total: ${total.toFixed(2)}</strong>
            </div>
        </div>
    );
}

export default Cart;