import React, { useState } from "react";
import OrderPlaced from "./OrderPlaced";

const Checkout = ({ setBill, bill, cartItems, setCartItems, setShowCart }) => {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({ name: false, contact: false, email: false, address: false });
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);

  const handleContinue = () => {
    if (paymentMethod === "UPI") {
      setShowOrderPlaced(true);
    } else {
      const name = document.getElementById("name").value.trim();
      const contact = document.getElementById("contact").value.trim();
      const email = document.getElementById("email").value.trim();

      const newErrors = {
        name: !name,
        contact: !contact || !/^\d{10}$/.test(contact),
        email: !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        address: !address.trim(),
      };

      setErrors(newErrors);

      if (!Object.values(newErrors).some((error) => error)) {
        setShowOrderPlaced(true);
      }
    }
  };

  if (showOrderPlaced) {
    return <OrderPlaced />;
  }

  if (paymentMethod === "UPI") {
    return (
      <div className="bg-white rounded-3xl w-11/12 md:w-1/4 sm:w-1/2 ml-0 md:ml-6 shadow-lg p-6 mt-4 fixed md:sticky bottom-3 md:top-20 left-5 md:left-10 z-10 h-4/5 md:h-screen overflow-y-scroll">
        <h1 className="text-xl font-bold mb-4">Scan QR to Pay</h1>
        <img
          src="/path/to/qr-code.png"
          alt="QR Code"
          className="w-full h-auto mb-4"
        />
        <button
          onClick={handleContinue}
          className="bg-yellow-500 mt-4 flex items-center justify-center relative w-full py-3 rounded-3xl text-white font-bold overflow-hidden"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white duration-3000 rounded-3xl w-11/12 md:w-1/4 sm:w-1/2 ml-0 md:ml-6 shadow-lg p-6 mt-4 fixed md:sticky bottom-3 md:top-20 left-5 md:left-10 z-10 h-4/5 md:h-screen overflow-y-scroll">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setShowCart(true)} className="fas fa-arrow-left text-xl"></button>
        <h1 className="text-xl font-bold">Checkout</h1>
        <i className="fas fa-shopping-cart text-xl"></i>
      </div>

      {/* Shipping Address */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
        <div className={`mb-4 p-2 bg-gray-100 rounded-lg ${errors.address ? "border border-red-500" : ""}`}>
          <textarea
            className="w-full p-2 bg-gray-100 rounded-lg"
            placeholder="Enter your shipping address here"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Contact Details */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
        <div className="mb-4 p-2 bg-gray-100 rounded-lg">
          <input
            id="name"
            type="text"
            className={`w-full mb-1 p-2 bg-gray-100 rounded-lg ${errors.name ? "border border-red-500" : ""}`}
            placeholder="Full Name"
          />
          <input
            id="contact"
            type="text"
            className={`w-full mb-1 p-2 bg-gray-100 rounded-lg ${errors.contact ? "border border-red-500" : ""}`}
            placeholder="Contact Number"
          />
          <input
            id="email"
            type="email"
            className={`w-full mb-1 p-2 bg-gray-100 rounded-lg ${errors.email ? "border border-red-500" : ""}`}
            placeholder="Email Address"
          />
        </div>
      </div>

      {/* Custom message */}
      <div>
        <span className="flex"><h2 className="text-lg font-semibold mb-4">Custom Message</h2> (Optional)</span>
        <div className="mb-4 p-2 bg-gray-100 rounded-lg">
          <textarea
            className="w-full p-2 bg-gray-100 rounded-lg"
            placeholder="Add instructions or notes for the delivery"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Payment Options */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment</h2>

        <div
          className="mb-3 p-3 bg-gray-100 rounded-lg flex justify-between items-center cursor-pointer"
          onClick={() => setPaymentMethod("UPI")}
        >
          <div className="flex items-center">
            <i className="fas fa-qrcode mr-1"></i>
            <span>UPI/Show QR</span>
          </div>
          <input type="radio" name="payment" checked={paymentMethod === "UPI"} readOnly />
        </div>

        <div
          className="mb-3 p-3 bg-gray-100 rounded-lg flex justify-between items-center cursor-pointer"
          onClick={() => setPaymentMethod("COD")}
        >
          <div className="flex items-center">
            <i className="fas fa-home mr-1"></i>
            <span>Cash on Delivery</span>
          </div>
          <input type="radio" name="payment" checked={paymentMethod === "COD"} readOnly />
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>Rs.{bill?.subtotal || ""}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Discount (20%)</span>
          <span>-Rs.{bill?.discount || ""}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery</span>
          <span>{bill?.delivery === 0 ? "Free" : `Rs.${bill.delivery || ""}`}</span>
        </div>
        <div className="border-t border-dashed my-2"></div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs.{bill?.total || ""}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleContinue}
        className="bg-yellow-500 mt-4 flex items-center justify-center relative w-full py-3 rounded-3xl text-white font-bold overflow-hidden"
      >
        Continue
      </button>
    </div>
  );
};

export default Checkout;
