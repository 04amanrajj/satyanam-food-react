import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function Terms() {
    return (
        <div className="main-container" style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", minHeight: "80vh" }}>
            <div className="glassmorphic legal-screen-card" style={{ padding: "40px", borderRadius: "var(--radius-lg)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-primary)", textDecoration: "none", fontWeight: "600", marginBottom: "30px", fontSize: "0.95rem", transition: "var(--transition-smooth)" }} className="hover-glow">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </Link>

                <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--color-primary)", marginBottom: "10px", fontFamily: "'Outfit', sans-serif" }}>Terms of Service</h1>
                <p style={{ color: "var(--secondary-text-color)", fontSize: "0.95rem", marginBottom: "30px" }}>Last Updated: April 12, 2026</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "25px", color: "var(--text-color)", lineHeight: "1.7" }}>
                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-info-circle"></i> 1. Acceptance of Terms
                        </h2>
                        <p>
                            Welcome to SatyaNaam Food Center. By accessing or using our website, ordering our premium thalis, or interacting with our backend services, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our platform.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-shopping-bag"></i> 2. Ordering & Payment Policies
                        </h2>
                        <p>
                            All orders placed via our checkout workflow are processed through our live restaurant database. We reserve the right to accept or cancel orders in cases of incorrect pricing, unavailability of fresh ingredients, or delivery radius limitations. Payments made via cash-on-delivery (COD) must be settled in full upon delivery.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-truck"></i> 3. Freshness & Delivery Guidelines
                        </h2>
                        <p>
                            We pride ourselves on offering freshly prepared traditional foods daily. Delivery estimates provided in the live status tracker are estimates and may vary slightly due to traffic, weather conditions, or peak kitchen preparation times.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-shield-alt"></i> 4. Limitation of Liability
                        </h2>
                        <p>
                            SatyaNaam Food and its affiliates will not be liable for any indirect, incidental, or consequential damages arising from consumption of items containing allergens unless explicitly declared by the user in the "Special Instructions" checkout field.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
