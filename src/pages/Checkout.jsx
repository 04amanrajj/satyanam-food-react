import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../styles/checkout.css";

export default function Checkout() {
    const { cart, clearCart } = useRestaurant();
    const safeCart = Array.isArray(cart) ? cart : [];

    // Wizard navigation state
    const [step, setStep] = useState(1);

    // Form inputs state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        zip: "",
        deliveryNotes: ""
    });

    // Promo code state
    const [promoCode, setPromoCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCode, setAppliedCode] = useState("");
    const [promoSuccess, setPromoSuccess] = useState("");
    const [promoError, setPromoError] = useState("");

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "" });
    const [upiId, setUpiId] = useState("");

    // Live order tracking simulation state
    const [orderId, setOrderId] = useState("");
    const [trackerStep, setTrackerStep] = useState(1);

    // Active backend order placing & tracking states
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState("");

    // Calculations
    const subtotal = safeCart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 40;
    const grandTotal = parseFloat((subtotal + deliveryFee - discountAmount).toFixed(2));

    // Handle Promo Code Application and calculate percentage discount amounts
    const handleApplyPromo = (e) => {
        e.preventDefault();
        setPromoError("");
        setPromoSuccess("");

        const formattedCode = promoCode.trim().toUpperCase();
        if (formattedCode === "WELCOME10") {
            const calculatedDiscount = parseFloat((subtotal * 0.10).toFixed(2));
            setDiscountAmount(calculatedDiscount);
            setAppliedCode("WELCOME10");
            setPromoSuccess("WELCOME10 (10% discount) applied successfully!");
        } else if (formattedCode === "SATYANAM20") {
            const calculatedDiscount = parseFloat((subtotal * 0.20).toFixed(2));
            setDiscountAmount(calculatedDiscount);
            setAppliedCode("SATYANAM20");
            setPromoSuccess("SATYANAM20 (20% discount) applied successfully!");
        } else {
            setPromoError("Invalid promotional code! Try WELCOME10 or SATYANAM20.");
        }
    };

    // Handle inputs changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    // Checkout Form Validation logic for delivery data
    const isStep2Valid = () => {
        return formData.name && formData.email && formData.phone && formData.street && formData.city && formData.zip;
    };

    // Verify mock UPI address structures and credit card CVV bounds
    const isStep3Valid = () => {
        if (paymentMethod === "COD") return true;
        if (paymentMethod === "Card") return cardData.number && cardData.expiry && cardData.cvc;
        if (paymentMethod === "UPI") return upiId.includes("@");
        return false;
    };

    // Handle Order Submission and structure API request payloads
    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        setOrderError("");

        const orderPayload = {
            cart: {
                items: safeCart.map(item => ({
                    item: {
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        category: item.category
                    },
                    quantity: item.quantity || 1
                })),
                totalprice: parseFloat(grandTotal)
            },
            userAddress: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipcode}`,
            userMSG: formData.notes || "",
            userMail: formData.email,
            userName: formData.name,
            userPhone: Number(formData.phone)
        };

        try {
            const response = await axios.post("https://satyanaam-food-backend.onrender.com/order/new", orderPayload);
            const createdOrder = response.data?.data;
            if (createdOrder && createdOrder._id) {
                setOrderId(createdOrder._id);
                setStep(4);
                setTrackerStep(1); // Pending initially as default starting state
                clearCart();
            } else {
                throw new Error("Could not fetch the registered order object from backend database.");
            }
        } catch (error) {
            console.error("Order placement failed:", error);
            setOrderError(error.response?.data?.message || error.message || "Failed to submit order to restaurant backend.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // Live order tracking polled from backend status changes and active intervals
    useEffect(() => {
        if (step === 4 && orderId) {
            const pollStatus = async () => {
                try {
                    const response = await axios.post("https://satyanaam-food-backend.onrender.com/order", {
                        userName: formData.name,
                        userPhone: Number(formData.phone)
                    });
                    
                    const ordersList = response.data;
                    if (Array.isArray(ordersList)) {
                        // Find this specific placed order
                        const currentOrder = ordersList.find(o => o._id === orderId);
                        if (currentOrder) {
                            const currentStatus = currentOrder.status; // "Pending", "Preparing", or "Delivered"
                            console.log("Polled backend order status:", currentStatus);
                            if (currentStatus === "Pending") {
                                setTrackerStep(1);
                            } else if (currentStatus === "Preparing") {
                                setTrackerStep(2);
                            } else if (currentStatus === "Delivered") {
                                setTrackerStep(4); // Fully delivered
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error polling order status:", err);
                }
            };

            pollStatus();
            const interval = setInterval(pollStatus, 5000); // Check status every 5 seconds
            return () => clearInterval(interval);
        }
    }, [step, orderId, formData.name, formData.phone]);

    // Empty State fallback when basket count hits zero
    if (safeCart.length === 0 && step !== 4) {
        return (
            <div className="checkout-page-container">
                <div className="checkout-wizard-card" style={{ gridTemplateColumns: "1fr", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <div className="tracker-success-icon" style={{ background: "rgba(220, 53, 69, 0.08)", color: "#dc3545" }}>
                        <i className="fas fa-shopping-basket"></i>
                    </div>
                    <h2 style={{ fontWeight: 800 }}>Your Basket is Empty!</h2>
                    <p style={{ color: "var(--secondary-text-color)", maxWidth: "450px" }}>
                        You cannot checkout with an empty basket. Head over to our dishes menu and find something delicious to eat!
                    </p>
                    <Link to="/menu" className="wizard-next-btn" style={{ textDecoration: "none", width: "fit-content" }}>
                        Browse Delicious Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-container">
            <div className="checkout-wizard-card">
                {/* 1. Header Timeline Progress Tracker wizard indicator nodes */}
                <div className="checkout-progress-header">
                    <div className="checkout-steps-tracker">
                        <div className={`checkout-step-node ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
                            <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
                            <span className="step-label">Order Items</span>
                        </div>
                        <div className={`checkout-step-node ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
                            <div className="step-circle">{step > 2 ? "✓" : "2"}</div>
                            <span className="step-label">Delivery Address</span>
                        </div>
                        <div className={`checkout-step-node ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>
                            <div className="step-circle">{step > 3 ? "✓" : "3"}</div>
                            <span className="step-label">Payment Options</span>
                        </div>
                        <div className={`checkout-step-node ${step === 4 ? "active" : ""}`}>
                            <div className="step-circle">4</div>
                            <span className="step-label">Status Tracker</span>
                        </div>
                    </div>
                </div>

                {/* 2. Left side Main Step Controls rendering wizard step wrappers */}
                <div className="checkout-main-content">
                    {/* STEP 1: Review Items & Promo codes */}
                    {step === 1 && (
                        <>
                            <h2 className="checkout-step-title">
                                <i className="fas fa-clipboard-list"></i>
                                <span>Step 1: Review Basket & Promos</span>
                            </h2>
                            <div className="promo-section">
                                <span className="form-label">Have a discount coupon?</span>
                                <form className="promo-form" onSubmit={handleApplyPromo}>
                                    <input 
                                        type="text" 
                                        placeholder="WELCOME10 or SATYANAM20" 
                                        className="promo-input"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        disabled={!!appliedCode}
                                    />
                                    <button 
                                        type="submit" 
                                        className="promo-btn"
                                        disabled={!!appliedCode}
                                    >
                                        Apply
                                    </button>
                                </form>
                                {promoSuccess && <span className="promo-status-msg success">{promoSuccess}</span>}
                                {promoError && <span className="promo-status-msg error">{promoError}</span>}
                                {!appliedCode && (
                                    <span style={{ fontSize: "0.85rem", color: "var(--secondary-text-color)" }}>
                                        💡 Use promo code <b>WELCOME10</b> for 10% off, or <b>SATYANAM20</b> for 20% off!
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                    {/* STEP 2: Address details */}
                    {step === 2 && (
                        <>
                            <h2 className="checkout-step-title">
                                <i className="fas fa-map-marked-alt"></i>
                                <span>Step 2: Enter Delivery Details</span>
                            </h2>
                            <div className="checkout-form-grid">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        className="form-input" 
                                        placeholder="Aman Raj" 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        className="form-input" 
                                        placeholder="+91 98765 43210" 
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="checkout-form-grid full">
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className="form-input" 
                                        placeholder="aman@example.com" 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input 
                                        type="text" 
                                        name="street" 
                                        className="form-input" 
                                        placeholder="Flat 302, Srinath Dham, Sukher" 
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="checkout-form-grid">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        className="form-input" 
                                        placeholder="Udaipur" 
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ZIP Code</label>
                                    <input 
                                        type="text" 
                                        name="zip" 
                                        className="form-input" 
                                        placeholder="313001" 
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Delivery Note (Optional)</label>
                                <textarea 
                                    name="deliveryNotes" 
                                    className="form-input" 
                                    rows="3" 
                                    placeholder="Leave at gate, ring doorbell, etc."
                                    value={formData.deliveryNotes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </>
                    )}

                    {/* STEP 3: Payment details */}
                    {step === 3 && (
                        <>
                            <h2 className="checkout-step-title">
                                <i className="fas fa-credit-card"></i>
                                <span>Step 3: Select Payment Method</span>
                            </h2>
                            <div className="payment-tabs">
                                <div 
                                    className={`payment-tab-option ${paymentMethod === "COD" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("COD")}
                                >
                                    <input 
                                        type="radio" 
                                        name="payMethod" 
                                        className="payment-radio"
                                        checked={paymentMethod === "COD"} 
                                        onChange={() => setPaymentMethod("COD")}
                                    />
                                    <div className="payment-tab-details">
                                        <span className="payment-tab-title">Cash on Delivery (COD)</span>
                                        <span className="payment-tab-desc">Pay with cash or digital scanner upon delivery arrival.</span>
                                    </div>
                                </div>

                                <div 
                                    className={`payment-tab-option ${paymentMethod === "UPI" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("UPI")}
                                >
                                    <input 
                                        type="radio" 
                                        name="payMethod" 
                                        className="payment-radio"
                                        checked={paymentMethod === "UPI"} 
                                        onChange={() => setPaymentMethod("UPI")}
                                    />
                                    <div className="payment-tab-details">
                                        <span className="payment-tab-title">UPI Scan & Pay (Mock GPay / PhonePe)</span>
                                        <span className="payment-tab-desc">Instantly checkout using your direct virtual payment address.</span>
                                    </div>
                                </div>

                                {paymentMethod === "UPI" && (
                                    <div className="form-group" style={{ padding: "0 20px" }}>
                                        <label className="form-label">UPI ID</label>
                                        <input 
                                            type="text" 
                                            name="upiId" 
                                            placeholder="aman@okaxis" 
                                            className="form-input"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div 
                                    className={`payment-tab-option ${paymentMethod === "Card" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("Card")}
                                >
                                    <input 
                                        type="radio" 
                                        name="payMethod" 
                                        className="payment-radio"
                                        checked={paymentMethod === "Card"} 
                                        onChange={() => setPaymentMethod("Card")}
                                    />
                                    <div className="payment-tab-details">
                                        <span className="payment-tab-title">Credit / Debit Card (Mock)</span>
                                        <span className="payment-tab-desc">Process online card verification safely.</span>
                                    </div>
                                </div>

                                {paymentMethod === "Card" && (
                                    <div className="credit-card-form" style={{ padding: "0 20px" }}>
                                        <div className="form-group">
                                            <label className="form-label">Card Number</label>
                                            <input 
                                                type="text" 
                                                name="number" 
                                                placeholder="4111 2222 3333 4444" 
                                                className="form-input"
                                                value={cardData.number}
                                                onChange={handleCardChange}
                                                maxLength="19"
                                                required
                                            />
                                        </div>
                                        <div className="checkout-form-grid">
                                            <div className="form-group">
                                                <label className="form-label">Expiry Date</label>
                                                <input 
                                                    type="text" 
                                                    name="expiry" 
                                                    placeholder="MM/YY" 
                                                    className="form-input"
                                                    value={cardData.expiry}
                                                    onChange={handleCardChange}
                                                    maxLength="5"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">CVV / CVC</label>
                                                <input 
                                                    type="password" 
                                                    name="cvc" 
                                                    placeholder="123" 
                                                    className="form-input"
                                                    value={cardData.cvc}
                                                    onChange={handleCardChange}
                                                    maxLength="3"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* STEP 4: Confirmed & Live tracking progress */}
                    {step === 4 && (
                        <div className="live-tracker-box">
                            <div className="tracker-success-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div>
                                <h2 style={{ fontWeight: 800, margin: "0 0 8px 0" }}>Order Placed Successfully!</h2>
                                <p style={{ color: "var(--secondary-text-color)", margin: 0 }}>
                                    Thank you for your order! Your delicious thali is now cooking in our kitchen.
                                </p>
                            </div>
                            <div className="tracker-order-id">
                                Order ID: <b>{orderId}</b>
                            </div>

                            <div className="live-status-timeline">
                                <div className={`status-node ${trackerStep >= 1 ? "active" : ""} ${trackerStep > 1 ? "completed" : ""}`}>
                                    <div className="status-icon-circle">
                                        {trackerStep > 1 ? "✓" : <i className="fas fa-receipt"></i>}
                                    </div>
                                    <div className="status-node-info">
                                        <span className="status-node-title">Order Confirmed</span>
                                        <span className="status-node-desc">Kitchen has accepted your premium thali order</span>
                                    </div>
                                </div>

                                <div className={`status-node ${trackerStep >= 2 ? "active" : ""} ${trackerStep > 2 ? "completed" : ""}`}>
                                    <div className="status-icon-circle">
                                        {trackerStep > 2 ? "✓" : <i className="fas fa-utensils"></i>}
                                    </div>
                                    <div className="status-node-info">
                                        <span className="status-node-title">Preparing in Kitchen</span>
                                        <span className="status-node-desc">Our master chefs are assembling your traditional dishes</span>
                                    </div>
                                </div>

                                <div className={`status-node ${trackerStep >= 3 ? "active" : ""} ${trackerStep > 3 ? "completed" : ""}`}>
                                    <div className="status-icon-circle">
                                        {trackerStep > 3 ? "✓" : <i className="fas fa-shipping-fast"></i>}
                                    </div>
                                    <div className="status-node-info">
                                        <span className="status-node-title">Out for Delivery</span>
                                        <span className="status-node-desc">Our delivery partner is rushing to your address</span>
                                    </div>
                                </div>

                                <div className={`status-node ${trackerStep === 4 ? "active" : ""}`}>
                                    <div className="status-icon-circle">
                                        <i className="fas fa-home"></i>
                                    </div>
                                    <div className="status-node-info">
                                        <span className="status-node-title">Delivered Hot</span>
                                        <span className="status-node-desc">Enjoy your fresh and pure SatyaNaam food!</span>
                                    </div>
                                </div>
                            </div>

                            <Link to="/" className="wizard-next-btn" style={{ textDecoration: "none", marginTop: "16px" }}>
                                Return to Homepage
                            </Link>
                        </div>
                    )}

                    {/* Step Action Button controls */}
                    {step < 4 && (
                        <div className="checkout-action-row">
                            {step > 1 ? (
                                <button 
                                    className="wizard-back-btn"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Go Back
                                </button>
                            ) : (
                                <Link to="/menu" className="wizard-back-btn" style={{ textDecoration: "none" }}>
                                    Back to Menu
                                </Link>
                            )}

                            {step === 1 && (
                                <button 
                                    className="wizard-next-btn"
                                    onClick={() => setStep(2)}
                                >
                                    Proceed to Address
                                </button>
                            )}

                            {step === 2 && (
                                <button 
                                    className="wizard-next-btn"
                                    onClick={() => setStep(3)}
                                    disabled={!isStep2Valid()}
                                    style={{ opacity: isStep2Valid() ? 1 : 0.5, cursor: isStep2Valid() ? "pointer" : "not-allowed" }}
                                >
                                    Proceed to Payment
                                </button>
                            )}

                            {step === 3 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                                    {orderError && (
                                        <div style={{ 
                                            color: "#dc3545", 
                                            fontSize: "0.85rem", 
                                            fontWeight: "600", 
                                            textAlign: "center", 
                                            background: "rgba(220, 53, 69, 0.08)", 
                                            padding: "10px", 
                                            borderRadius: "8px",
                                            border: "1px solid rgba(220, 53, 69, 0.2)"
                                        }}>
                                            <i className="fas fa-exclamation-circle" style={{ marginRight: "5px" }}></i>
                                            {orderError}
                                        </div>
                                    )}
                                    <button 
                                        className="wizard-next-btn"
                                        onClick={handlePlaceOrder}
                                        disabled={!isStep3Valid() || isPlacingOrder}
                                        style={{ 
                                            opacity: (isStep3Valid() && !isPlacingOrder) ? 1 : 0.5, 
                                            cursor: (isStep3Valid() && !isPlacingOrder) ? "pointer" : "not-allowed",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px"
                                        }}
                                    >
                                        {isPlacingOrder ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Placing Order...
                                            </>
                                        ) : (
                                            `Place Order (Rs.${grandTotal})`
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Right side persistent Summary panel sidebar calculations */}
                {step < 4 && (
                    <div className="checkout-summary-sidebar">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-items-list">
                            {safeCart.map((item) => (
                                <div className="summary-item-row" key={item.id}>
                                    <div>
                                        <span className="summary-item-name">{item.name}</span>
                                        <span style={{ fontSize: "0.85rem", color: "var(--secondary-text-color)", display: "block" }}>
                                            Qty: {item.quantity || 1} x Rs.{item.price}
                                        </span>
                                    </div>
                                    <span className="summary-item-price">Rs.{item.price * (item.quantity || 1)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-bill-details">
                            <div className="summary-bill-row">
                                <span>Cart Subtotal</span>
                                <span>Rs.{subtotal}</span>
                            </div>
                            <div className="summary-bill-row">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="summary-bill-row discount">
                                    <span>Discount ({appliedCode})</span>
                                    <span>-Rs.{discountAmount}</span>
                                </div>
                            )}
                            <div className="summary-bill-row total">
                                <span>Grand Total</span>
                                <span>Rs.{grandTotal}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
