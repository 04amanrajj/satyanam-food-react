import React, { useEffect, useState } from "react";
import "../styles/checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []); // Removed cartItems from dependency array

  return (
    <div className="card bg--primary">
      <div className="row">
        <div className="col-md-8 cart-container">
          <div className="title">
            <div className="row">
              <div className="col">
                <h4><b>Food Cart</b></h4>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="row border-top border-bottom itemdiv">
              <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="display-1 fw-bold">Oops!</h1>
                  <p className="fs-3 text-danger">Your Cart is Empty.</p>
                  <p className="lead">Find something delicious to eat.</p>
                  <a href="/" className="btn btn-primary px-4 py-2">
                    <h3>Browse menu</h3>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h5>{item.name}</h5>
                    <p>Price: Rs.{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-4 summary">
          <h3>Summary</h3>
          <p>Total Items: {cartItems.length}</p>
          <button className="btn btn-success w-100">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
