import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function Privacy() {
    return (
        <div className="main-container" style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", minHeight: "80vh" }}>
            <div className="glassmorphic legal-screen-card" style={{ padding: "40px", borderRadius: "var(--radius-lg)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-primary)", textDecoration: "none", fontWeight: "600", marginBottom: "30px", fontSize: "0.95rem", transition: "var(--transition-smooth)" }} className="hover-glow">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </Link>

                <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--color-primary)", marginBottom: "10px", fontFamily: "'Outfit', sans-serif" }}>Privacy Policy</h1>
                <p style={{ color: "var(--secondary-text-color)", fontSize: "0.95rem", marginBottom: "30px" }}>Last Updated: April 12, 2026</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "25px", color: "var(--primary-text-color)", lineHeight: "1.7" }}>
                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-user-shield"></i> 1. Information We Collect
                        </h2>
                        <p>
                            We collect personal information that you provide voluntarily during the ordering process, including your name, email address, physical shipping address, and phone number. This information is securely transmitted to our backend server to complete thali preparation and dispatch.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-server"></i> 2. Database Sync & Polling Logs
                        </h2>
                        <p>
                            To offer dynamic thali status updates, our platform registers your order under your phone number. The live order tracker utilizes secure polling protocols to query our backend server periodically. We do not store financial transactions or sensitive credit card details on our local database.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-cookie-bite"></i> 3. Storage & Local Sessions
                        </h2>
                        <p>
                            Our React codebase utilizes browser storage mechanisms (specifically `localStorage`) to maintain your shopping basket selections across active sessions. You can clear this data at any time by emptying your basket or resetting your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)" }}>
                            <i className="fas fa-envelope-open-text"></i> 4. Contact & Communications
                        </h2>
                        <p>
                            By subscribing to our premium newsletter or submitting an order, you agree to receive communications regarding your thali status updates, fresh dish additions, and special discounts. We will never sell or rent your personal information to third parties.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
