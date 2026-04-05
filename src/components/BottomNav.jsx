import React from "react";
import { NavLink } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../styles/navbar.css"; // Reuse navbar classes or declare custom ones
export default function BottomNav() {
    const { cart } = useRestaurant();
    const cartCount = Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 1), 0) : 0;

    return (
        <div className="bottom-nav-bar glassmorphic mobile-only-nav">
            <NavLink 
                to="/" 
                className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
            >
                <i className="fas fa-home"></i>
                <span>Home</span>
            </NavLink>

            <NavLink 
                to="/user" 
                className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
            >
                <i className="fas fa-user-circle"></i>
                <span>Profile</span>
            </NavLink>

            <NavLink 
                to="/checkout" 
                className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
            >
                <div className="bottom-nav-cart-wrapper">
                    <i className="fas fa-shopping-basket"></i>
                    {cartCount > 0 && (
                        <span className="bottom-nav-cart-badge">{cartCount}</span>
                    )}
                </div>
                <span>Cart</span>
            </NavLink>
        </div>
    );
}
