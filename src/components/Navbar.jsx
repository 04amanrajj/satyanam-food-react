import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext"; // Import context
import "../styles/navbar.css";

export default function Navbar() {
    const { restaurant } = useRestaurant(); // Get restaurant data
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <header className="navbar p-6 bg-white shadow-md">
                <div className="flex justify-between w-full items-center">
                    <div className="brandname text-2xl font-bold text-green-600">
                        <Link to="/">
                            <h1>{restaurant?.name || "Restaurant"}</h1>
                        </Link>
                    </div>

                    {/* Hamburger Button (Mobile) */}
                    <button
                        className="md:hidden text-2xl text-gray-600"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>

                    {/* Nav Links */}
                    <nav
                        className={`absolute md:relative bg-white md:bg-transparent w-full md:w-auto top-16 md:top-0 left-0 p-6 md:p-0 shadow-md md:shadow-none transition-all duration-300 ease-in-out ${menuOpen ? "block" : "hidden"
                            } md:flex space-x-6`}
                    >
                        <Link className="text-black font-semibold" to="/">Home</Link>
                        <Link className="text-gray-600" to="/menu">Menu</Link>
                        <Link className="text-gray-600" to="/about">About Us</Link>
                        <Link className="text-gray-600" to="/user">Sign Up</Link>
                    </nav>
                </div>
            </header>
        </>)
}
