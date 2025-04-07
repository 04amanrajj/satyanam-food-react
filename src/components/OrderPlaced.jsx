import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added import for useNavigate

const OrderPlaced = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [isVisible, setIsVisible] = useState(true); // State to control visibility

    if (!isVisible) return null; // Hide component if not visible

    return (
        <div className="bg-blue-500 flex items-center justify-center duration-3000 rounded-3xl w-11/12 md:w-1/4 sm:w-1/2 ml-0 md:ml-6 shadow-lg p-6 mt-4 fixed md:sticky bottom-3 top-20 md:top-20 left-4 md:left-10 z-10">
            <div className="bg-blue-500 text-white rounded-3xl p-6 w-full max-w-sm">
                <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-6 mb-6">
                        <i className="fas fa-check text-blue-500 text-4xl"></i>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Order Confirmed</h1>
                    <p className="text-center mb-4">
                        Thank you for your order. You will receive email confirmation shortly.
                    </p>
                    <p className="text-center mb-8">
                        Check the status of your order on the <span className="font-bold">Order tracking</span> page
                    </p>
                    <button
                        className="bg-white text-blue-500 font-bold py-2 px-4 rounded-full mb-4 w-full"
                        onClick={() => {
                            setIsVisible(false)
                            navigate('/menu')
                        }} // Navigate to menu page
                    >
                        Continue Shopping
                    </button>
                    <button
                        className="border border-white text-white font-bold py-2 px-4 rounded-full mb-4 w-full"
                        onClick={() => navigate('/profile')} // Navigate to profile page
                    >
                        Profile
                    </button>
                    <button
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-full w-full"
                        onClick={() => setIsVisible(false)} // Hide the component
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPlaced;
