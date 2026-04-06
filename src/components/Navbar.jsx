import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../styles/navbar.css";

export default function Navbar({ darkMode, toggleDarkMode, onCartOpen }) {
    const { restaurant, cart } = useRestaurant();
    const [menuOpen, setMenuOpen] = useState(false);

    // Calculate total quantity of items in the cart
    const cartCount = Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 1), 0) : 0;

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                {/* Logo and Brand Name */}
                <Link to="/" className="brand-link">
                    <span className="brand-title brand-font">
                        {restaurant?.name || "SatyaNaam Food"}
                    </span>
                    <span className="brand-dot"></span>
                </Link>

                {/* Hamburger (Mobile Toggle) */}
                <button 
                    className="hamburger-btn" 
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                {/* Nav Menu Links & Buttons */}
                <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/menu" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Menu
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        About Us
                    </NavLink>
                    <NavLink 
                        to="/user" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Profile
                    </NavLink>

                    {/* Interactive Theme Toggle Button */}
                    <div className="theme-toggle-wrapper">
                        <button 
                            onClick={toggleDarkMode} 
                            className="theme-toggle-btn"
                            aria-label="Toggle theme mode"
                            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {darkMode ? (
                                <i className="fas fa-sun" style={{ color: "#f39c12" }}></i>
                            ) : (
                                <i className="fas fa-moon" style={{ color: "#f1c40f" }}></i>
                            )}
                        </button>
                    </div>

                    {/* Cart Trigger Bubble */}
                    <button 
                        type="button"
                        className="cart-bubble-btn"
                        onClick={() => {
                            onCartOpen();
                            setMenuOpen(false);
                        }}
                        aria-label="View shopping cart"
                        title="Shopping Cart"
                    >
                        <i className="fas fa-shopping-basket"></i>
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </button>
                </nav>
            </div>
        </header>
    );
}
