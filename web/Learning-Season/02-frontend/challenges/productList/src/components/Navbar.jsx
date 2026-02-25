
function Navbar({ cartItemCount }) {
    return (
        <nav className="navbar">
            <h1 style={{ margin: 0, color: '#333' }}>Product Store</h1>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <span>Cart: {cartItemCount} items</span>
            </div>
        </nav>
    )
}

export default Navbar;