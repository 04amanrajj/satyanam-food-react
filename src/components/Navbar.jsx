import React from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext"; // Import context
import "../styles/navbar.css";

export default function Navbar() {
    const { restaurant } = useRestaurant(); // Get restaurant data
    return (
        <header className="navbar items-center p-6 bg-white shadow-md">
            <div className="brandname text-2xl font-bold text-green-600">
                <Link to="/">
                    <h1>{restaurant?.name || "Restaurant"}</h1>
                </Link>
            </div>
            <nav className="links space-x-6">
                <Link className="text-black font-semibold" to="/">Home</Link>
                <Link className="text-gray-600" to="/menu">Menu</Link>
                <Link className="text-gray-600" to="/about">About Us</Link>
                <Link className="text-gray-600" to="/contact">Contact</Link>
                <Link className="text-gray-600" to="/user">Sign Up</Link>
            </nav>
        </header>
    )
}
