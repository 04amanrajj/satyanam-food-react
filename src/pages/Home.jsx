import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext";
import Suggestions from "../components/Suggestions";

export default function Home() {
    const { restaurant, menu } = useRestaurant();
    const [previewItems, setPreviewItems] = useState({
        thali: "/coverpage/img2.jpeg",
        chole: "/coverpage/img1.jpeg",
        paneer: "/coverpage/img3.jpeg"
    });

    // Dynamically retrieve real menu images for hero previews once menu loads
    useEffect(() => {
        if (menu && menu.length > 0) {
            const choleItem = menu.find(item => item.name?.toLowerCase().includes("chole") || item.id === 1);
            const paneerItem = menu.find(item => item.name?.toLowerCase().includes("paneer") || item.id === 2);
            const thaliItem = menu.find(item => item.name?.toLowerCase().includes("thali") || item.id === 3);

            setPreviewItems({
                thali: thaliItem?.image || "/coverpage/img2.jpeg",
                chole: choleItem?.image || "/coverpage/img1.jpeg",
                paneer: paneerItem?.image || "/coverpage/img3.jpeg"
            });
        }
    }, [menu]);

    return (
        <div className="main-container">
            {/* Immersive Hero Grid Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-subtitle">
                        {restaurant?.tagline || "Authentic taste of tradition"}
                    </span>
                    <h1 className="hero-title">
                        Welcome to <br />
                        <span>{restaurant?.name || "SatyaNaam Food"}</span>
                    </h1>
                    <p className="hero-description">
                        Indulge in a premium, hand-crafted culinary journey featuring pure, traditional Indian flavors, freshly prepared with authentic spices and love.
                    </p>
                    <Link to="/menu" className="btn-primary hover-glow" style={{
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        padding: "16px 36px",
                        borderRadius: "var(--radius-md)",
                        fontWeight: "700",
                        fontSize: "1.05rem",
                        display: "inline-block",
                        textDecoration: "none",
                        boxShadow: "0 10px 20px -5px rgba(30, 83, 60, 0.3)",
                        transition: "var(--transition-smooth)"
                    }}>
                        Explore Menu &nbsp; <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="hero-visuals">
                    {/* Floating Thali Image */}
                    <div className="thali-container">
                        <img 
                            src={previewItems.thali} 
                            alt="Traditional Indian Thali Feast" 
                            className="thali-img"
                        />
                    </div>

                    {/* Floating Overlay Card 1 */}
                    <div className="floating-preview-card card-top-left glassmorphic">
                        <img 
                            src={previewItems.chole} 
                            alt="Chole Masala" 
                            className="preview-thumb"
                        />
                        <div>
                            <h4 className="preview-title">Chole Masala</h4>
                            <div className="preview-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                        </div>
                    </div>

                    {/* Floating Overlay Card 2 */}
                    <div className="floating-preview-card card-bottom-right glassmorphic">
                        <img 
                            src={previewItems.paneer} 
                            alt="Shahi Paneer" 
                            className="preview-thumb"
                        />
                        <div>
                            <h4 className="preview-title">Shahi Paneer</h4>
                            <div className="preview-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Dishes suggestions section */}
            <Suggestions dishes={menu} />
        </div>
    );
}
