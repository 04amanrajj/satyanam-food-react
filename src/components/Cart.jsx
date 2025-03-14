import React, { useEffect } from "react";
import "../styles/cart.css";
import { Link } from "react-router-dom";

const Cart = ({ cartItems, setCartItems }) => {
  // Function to remove item from cart
  const removeFromCart = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);

  return (
    <div className="cart bg--primary">
      <h3 className="cart-title">Your Cart</h3>
      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">₹{item.price}</p>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(index)}>
                X
              </button>
            </div>
          ))
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )}
      </div>

      {/* Total Price & Checkout Button */}
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <p className="cart-total">Total: ₹{totalPrice}</p>
          <Link className="checkout-btn bg-green-500 text-white cart-button py-2 px-4 rounded-full mt-4" to="/checkout">Place Order</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
