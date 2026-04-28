import { useState } from "react";
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import products from './data/products';

function App() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        if (product.stock > 0) {
            setCart(prevCart => {
                const existingItem = prevCart.find(item => item.id === product.id);
                if (existingItem) {
                    return prevCart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevCart, { ...product, quantity: 1 }];
                }
            });
        }
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === productId
                        ? { ...item, quantity }
                        : item
                )
            );
        }
    };

    return (
        <div>
            <Navbar cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)} />
            <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
            </div>
        </div>
    );
}

export default App;