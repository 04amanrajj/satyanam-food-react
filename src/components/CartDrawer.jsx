import React from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../styles/cartdrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
    const { cart, updateQuantity, removeFromCart } = useRestaurant();

    // Defensive check
    const safeCart = Array.isArray(cart) ? cart : [];

    // Calculations
    const subtotal = safeCart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 40;
    const gst = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat((subtotal + deliveryFee + gst).toFixed(2));

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("cart-drawer-overlay")) {
            onClose();
        }
    };

    return (
        <div 
            className={`cart-drawer-overlay ${isOpen ? "open" : ""}`} 
            onClick={handleOverlayClick}
        >
            <div className="cart-drawer">
                {/* Header */}
                <div className="cart-drawer-header">
                    <h2 className="cart-drawer-title">
                        <i className="fas fa-shopping-basket"></i>
                        <span>Shopping Basket</span>
                    </h2>
                    <button 
                        className="cart-drawer-close-btn" 
                        onClick={onClose}
                        aria-label="Close cart drawer"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Items List */}
                <div className="cart-drawer-items">
                    {safeCart.length === 0 ? (
                        <div className="cart-drawer-empty">
                            <i className="fas fa-shopping-basket"></i>
                            <h3>Your basket is empty</h3>
                            <p>Add some delicious traditional Indian thalis to start ordering!</p>
                        </div>
                    ) : (
                        safeCart.map((item) => (
                            <div className="cart-drawer-item" key={item.id}>
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="cart-drawer-item-img" 
                                    loading="lazy"
                                />
                                <div className="cart-drawer-item-info">
                                    <h4 className="cart-drawer-item-name">{item.name}</h4>
                                    <span className="cart-drawer-item-price">Rs.{item.price}</span>
                                    
                                    {/* Quantity controls */}
                                    <div className="cart-drawer-quantity-controls">
                                        <button 
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                            aria-label="Decrease quantity"
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="qty-val">{item.quantity || 1}</span>
                                        <button 
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                            aria-label="Increase quantity"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Remove button */}
                                <button 
                                    className="cart-drawer-remove-btn"
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="Remove item from cart"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary Area */}
                {safeCart.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-drawer-summary-row">
                            <span>Subtotal</span>
                            <span>Rs.{subtotal}</span>
                        </div>
                        <div className="cart-drawer-summary-row">
                            <span>Delivery Fee</span>
                            <span>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span>
                        </div>
                        <div className="cart-drawer-summary-row">
                            <span>GST (5%)</span>
                            <span>Rs.{gst}</span>
                        </div>
                        <div className="cart-drawer-summary-row total">
                            <span>Total Amount</span>
                            <span>Rs.{total}</span>
                        </div>
                        
                        <Link 
                            to="/checkout" 
                            className="cart-drawer-checkout-btn"
                            onClick={onClose}
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
