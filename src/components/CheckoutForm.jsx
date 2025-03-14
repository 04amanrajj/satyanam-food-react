import React, { useEffect, useState } from "react";

const CheckoutForm = (props) => {

  const [orderType, setOrderType] = useState("delivery");
  const [cart, setCart] = useState([]);

  const { cartItems, setCartItems } = props
  useEffect(() => {
    // Load cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, [cartItems]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "card",
  });

  const updateQuantity = (id, action) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = action === "inc" ? item.quantity + 1 : item.quantity - 1;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order placed:", { ...formData, cart, orderType });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="order-type">
        <button onClick={() => handleOrderTypeChange("delivery")} className={orderType === "delivery" ? "active" : ""}>Delivery</button>
        <button onClick={() => handleOrderTypeChange("pickup")} className={orderType === "pickup" ? "active" : ""}>Pickup</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="Phone" onChange={handleInputChange} required />
        {orderType === "delivery" && <input type="text" name="address" placeholder="Address" onChange={handleInputChange} required />}
        <select name="paymentMethod" onChange={handleInputChange}>
          <option value="card">Credit/Debit Card</option>
          <option value="cash">Cash on Delivery</option>
        </select>
        <button type="submit">Place Order</button>
      </form>
      <div className="cart-summary">
        <h3>Cart</h3>
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <span>{item.name} - ${item.price} x {item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, "inc")}>+</button>
            <button onClick={() => updateQuantity(item.id, "dec")}>-</button>
          </div>
        ))}
        <h4>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</h4>
      </div>
    </div>
  );
};

export default CheckoutForm;
