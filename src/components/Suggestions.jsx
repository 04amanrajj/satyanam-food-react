import React, { useState, useEffect } from "react";
import { Skeleton, Snackbar, Alert } from "@mui/material";
import { useRestaurant } from "../contexts/RestaurantContext";

export default function Suggestions({ dishes }) {
    const { addToCart } = useRestaurant();
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [addedDishName, setAddedDishName] = useState("");

    // Simulate standard skeleton screen load
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleAddToCartClick = (dish) => {
        addToCart(dish);
        setAddedDishName(dish.name);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    // Safely retrieve first 8 popular items for display
    const popularDishes = dishes && dishes.length > 0 
        ? [...dishes.slice(0, 4), ...dishes.slice(10, 14)]
        : [];

    return (
        <section className="suggestion-section">
            <div className="suggestion-header">
                <h2 className="section-title">Popular Dishes</h2>
                <span className="text-sec" style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                    Prepared Fresh Daily
                </span>
            </div>

            <div className="dishes-grid">
                {loading || popularDishes.length === 0 ? (
                    // Premium Skeleton Card Screen
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="skeleton-card">
                            <Skeleton 
                                variant="rectangular" 
                                width="100%" 
                                height={200} 
                                style={{ borderRadius: "var(--radius-md)", marginBottom: "16px" }}
                            />
                            <Skeleton variant="text" width="60%" height={24} style={{ marginBottom: "8px" }} />
                            <Skeleton variant="text" width="30%" height={20} style={{ marginBottom: "20px" }} />
                            <Skeleton variant="rectangular" width="100%" height={42} style={{ borderRadius: "var(--radius-md)" }} />
                        </div>
                    ))
                ) : (
                    // Render aesthetic cards
                    popularDishes.map((dish, index) => (
                        <article key={index} className="food-card">
                            <div className="food-card-img-wrapper">
                                <img 
                                    src={dish.image || "/coverpage/img1.jpeg"} 
                                    alt={dish.name} 
                                    className="food-card-img"
                                    loading="lazy"
                                />
                                <span className="food-badge-overlay badge-veg">
                                    <i className="fas fa-leaf" style={{ marginRight: "4px" }}></i>
                                    Pure Veg
                                </span>
                            </div>

                            <div className="food-card-body">
                                <h3 className="food-card-title">{dish.name}</h3>
                                
                                <div className="food-card-price-row">
                                    <span className="food-card-price">₹{dish.price}</span>
                                    <div className="food-card-rating">
                                        <i className="fas fa-star"></i>
                                        <span>4.9</span>
                                    </div>
                                </div>

                                <button 
                                    className="food-card-btn"
                                    onClick={() => handleAddToCartClick(dish)}
                                    aria-label={`Add ${dish.name} to cart`}
                                >
                                    <i className="fas fa-shopping-basket"></i>
                                    Add to Cart
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {/* Premium feedback toast notification */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={2000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="success" 
                    sx={{ 
                        width: '100%', 
                        borderRadius: "var(--radius-md)", 
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: "600",
                        boxShadow: "var(--shadow-lg)"
                    }}
                >
                    🎉 {addedDishName} added to cart!
                </Alert>
            </Snackbar>
        </section>
    );
}
