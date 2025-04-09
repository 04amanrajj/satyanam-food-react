import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../styles/navbar.css";

export default function Navbar({ darkMode, setDarkMode, toggleDarkMode }) {
    const { restaurant } = useRestaurant();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={`navbar ${darkMode ? 'bg-green-800 text-white' : 'bg-white text-black'} shadow-md`}>
            <div className="flex justify-between w-full items-center">
                <div className="brandname text-2xl font-bold text-green-600">
                    <Link to="/">
                        <h1 className="text-lg md:text-xl">{restaurant?.name || "Restaurant"}</h1>
                    </Link>
                </div>

                {/* Hamburger Button (Mobile) */}
                <button
                    className="md:hidden text-2xl z-20 text-gray-600"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                {/* Nav Links */}
                <nav
                    className={`absolute md:relative rounded-full bg-white md:bg-transparent w-full md:w-auto p-2.5 md:p-0 top-13 md:top-0 left-0 shadow-md md:shadow-none transition-all duration-300 ease-in-out ${menuOpen ? "block" : "hidden"
                        } md:flex space-x-6`}
                >
                    {/* Dark Mode Toggle */}
                    <div className="one-quarter" id="switch">
                        <input
                            type="checkbox"
                            className="checkbox toggle-theme"
                            id="chk"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                        />
                        {/*                         
                        <label className="label " htmlFor="chk">
                            <div className="ball" style={{ backgroundColor: darkMode ? 'text-gray-600' : 'bg-white', transform: darkMode ? "translateX(3px)" : "translateX(-18px)" }}></div>
                            <i className="fas fa-moon"></i>
                            <i className="fas fa-sun"></i>
                        </label> */}
                    </div>
                    <Link className="text-black font-semibold" to="/">Home</Link>
                    <Link className="text-gray-600" to="/menu">Menu</Link>
                    <Link className="text-gray-600" to="/about">About Us</Link>
                    <Link className="text-gray-600" to="/user">Sign Up</Link>
                </nav>
            </div>
        </header>
    );
}
