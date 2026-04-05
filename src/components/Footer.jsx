import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext";
import { Skeleton } from "@mui/material";
import "../styles/footer.css";

export default function Footer() {
    const { restaurant } = useRestaurant();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (restaurant && Object.keys(restaurant).length > 0) {
            setLoading(false);
        }
    }, [restaurant]);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for subscribing to our premium newsletter!");
    };

    if (loading) {
        return (
            <footer className="premium-footer">
                <div className="footer-grid">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div className="footer-column" key={idx}>
                            <Skeleton variant="text" width="60%" height={28} style={{ marginBottom: "16px" }} />
                            <Skeleton variant="text" width="100%" height={20} />
                            <Skeleton variant="text" width="90%" height={20} />
                            <Skeleton variant="text" width="80%" height={20} />
                        </div>
                    ))}
                </div>
            </footer>
        );
    }

    return (
        <footer className="premium-footer">
            <div className="footer-grid">
                {/* Column 1: Brand details */}
                <div className="footer-column">
                    <div className="footer-brand-title brand-font">
                        <span>SatyaNaam Food</span>
                        <span className="footer-brand-dot"></span>
                    </div>
                    <p className="footer-desc">
                        Bringing you the authentic taste of premium traditional Indian thalis, prepared fresh daily with natural, pure ingredients.
                    </p>
                    <div className="footer-socials">
                        <a 
                            href={restaurant?.socialMedia?.instagram || "https://instagram.com"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-badge"
                            aria-label="Follow us on Instagram"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a 
                            href={restaurant?.socialMedia?.facebook || "https://facebook.com"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-badge"
                            aria-label="Follow us on Facebook"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a 
                            href={restaurant?.socialMedia?.twitter || "https://twitter.com"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-badge"
                            aria-label="Follow us on Twitter"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>

                {/* Column 2: Navigation Links */}
                <div className="footer-column">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-links">
                        <li className="footer-link-item">
                            <Link to="/"><i className="fas fa-chevron-right" style={{ fontSize: "0.75rem" }}></i> Home</Link>
                        </li>
                        <li className="footer-link-item">
                            <Link to="/menu"><i className="fas fa-chevron-right" style={{ fontSize: "0.75rem" }}></i> Dishes Menu</Link>
                        </li>
                        <li className="footer-link-item">
                            <Link to="/about"><i className="fas fa-chevron-right" style={{ fontSize: "0.75rem" }}></i> About Us</Link>
                        </li>
                        <li className="footer-link-item">
                            <Link to="/user"><i className="fas fa-chevron-right" style={{ fontSize: "0.75rem" }}></i> Profile</Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Contact details */}
                <div className="footer-column">
                    <h3 className="footer-heading">Our Store</h3>
                    <div className="footer-contacts">
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>
                                {restaurant?.address?.line1 || "Srinath Dham, Sukher"}<br />
                                {restaurant?.address?.city || "Udaipur"}, {restaurant?.address?.state || "Rajasthan"}
                            </span>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-phone-alt"></i>
                            <span>{restaurant?.phone || "+91 94142 86424"}</span>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <span>{restaurant?.email || "info@satyanamfood.com"}</span>
                        </div>
                    </div>
                </div>

                {/* Column 4: Newsletter */}
                <div className="footer-column">
                    <h3 className="footer-heading">Newsletter</h3>
                    <p className="footer-desc" style={{ marginBottom: "4px" }}>
                        Subscribe to get latest updates, special discount coupons and new dishes!
                    </p>
                    <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
                        <input 
                            type="email" 
                            placeholder="example@gmail.com" 
                            className="newsletter-input" 
                            required 
                            aria-label="Email address for newsletter"
                        />
                        <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Copyright Area */}
            <div className="footer-bottom">
                <p className="footer-copy">
                    &copy; {new Date().getFullYear()} SatyaNaam Food Center. All rights reserved.
                </p>
                <div className="footer-legal-links">
                    <Link to="/terms">Terms of Service</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
