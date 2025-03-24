import React, { useState } from "react";

const Checkout = ({ setBill, bill, cartItems, setCartItems, setShowCart }) => {
  console.log(bill)
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  console.log(setShowCart)
  return (
    <div className="bg-white duration-3000 rounded-3xl  w-full md:w-1/4 sm:w-1/2 ml-0 md:ml-10 shadow-lg overflow-y-scroll p-6 mt-4  top-20 " style={{ height: "fit-content" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setShowCart(true)} className="fas fa-arrow-left text-xl"></button>
        <h1 className="text-xl font-bold">Checkout</h1>
        <i className="fas fa-shopping-cart text-xl"></i>
      </div>

      {/* Shipping Address */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
        <div className="mb-4 p-2 bg-gray-100 rounded-lg">
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
            type="text"
            className="w-full mb-1 p-2 bg-gray-100 rounded-lg"
            placeholder="Full Name"
          />
          <input
            type="text"
            className="w-full mb-1 p-2 bg-gray-100 rounded-lg"
            placeholder="Contact Number"
          />
          <input
            type="email"
            className="w-full mb-1 p-2 bg-gray-100 rounded-lg"
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
      <button className="bg-yellow-500 mt-4 flex items-center justify-center relative w-full py-3 rounded-3xl text-white font-bold overflow-hidden">
        Continue
      </button>
    </div>
  );
};

export default Checkout;
