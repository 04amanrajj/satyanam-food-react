import React, { useState, useEffect } from "react";

const Cart = ({ setBill, cartItems, setCartItems, setShowCart }) => {
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [showInput, setShowInput] = useState(false); // State to toggle input visibility

  // Calculate subtotal, discount, tax, and total dynamically
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = isCouponApplied
    ? parseFloat((subtotal * 0.2).toFixed(2))
    : 0; // 20% discount if coupon applied
  const discountedSubtotal = subtotal - discount;
  const delivery = 0; // Free delivery for orders above $50
  const total = (discountedSubtotal + delivery).toFixed(2);

  // Update bill values whenever subtotal, discount, delivery, or total changes
  console.log(setBill);
  useEffect(() => {
    setBill({
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      delivery: delivery === 0 ? "Free" : delivery.toFixed(2),
      total: total,
    });
  }, [subtotal, discount, delivery, total, setBill]);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "FOOD20") {
      setIsCouponApplied(true);
      setShowInput(false); // Hide input after applying the coupon
    } else {
      alert("Invalid coupon code");
    }
  };

  // Handler to remove an item from the cart
  const removeItem = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
      return updatedCart;
    });
  };

  return (
    <div className="bg-white duration-3000 rounded-3xl w-1/4 ml-10 shadow-lg p-6 mt-4 sticky top-20 h-full">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold">Cart</h1>
        <button
          className="text-xl"
          onClick={() => {
            setCartItems([]);
            localStorage.removeItem("cart");
          }}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      <div className="overflow-y-scroll overflow-x-hidden h-64">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="flex items-center">
              <img
                alt={item.name}
                className="w-12 h-12 rounded-full"
                height="50"
                src={item.image}
                width="50"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg mb-0 font-semibold">
                  {item.name}
                </h3>
                <p className="text-gray-500">
                  Rs.{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => removeItem(item._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )}
      </div>
      <div className="mt-2 text-center text-gray-500">
        {!isCouponApplied ? (
          !showInput ? (
            <p
              onClick={() => setShowInput(true)} // Show input when clicking on the <p> tag
              className="cursor-pointer"
            >
              <i className="fas fa-tag text-red-500"></i> Do you have any
              discount code?
            </p>
          ) : (
            <div className="flex mt-1">
              <input
                type="text"
                className="border rounded-l-3xl p-2 flex-1"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                className="bg-yellow-500 text-white px-4 rounded-r-3xl"
                onClick={applyCoupon}
              >
                Apply
              </button>
            </div>
          )
        ) : (
          <p className="text-green-500 mt-2">
            Coupon applied successfully!
          </p>
        )}
      </div>
      <div className="bg-gray-100 rounded-3xl p-4 mt-6">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>Rs.{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Discount (20%)</span>
          <span>-Rs.{discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery</span>
          <span>
            {delivery === 0 ? "Free" : `Rs.${delivery.toFixed(2)}`}
          </span>
        </div>
        <div className="border-t border-dashed my-2"></div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs.{total}</span>
        </div>
      </div>
      <button
        className="bg-yellow-500 mt-4 flex items-center justify-center cart-checkout-btn relative w-full py-3 rounded-3xl text-white font-bold overflow-hidden"
        onClick={() => setShowCart(false)} // Navigate to /checkout
      >
        <span>
          Checkout <i className="fas fa-arrow-right ml-2"></i>
        </span>
      </button>
    </div>
  );
};

export default Cart;
