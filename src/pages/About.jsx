import React, { useEffect, useState } from "react";
import { getData } from "../services/service";
import "../styles/global.css";

const About = () => {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData();
        setRestaurant(response.restaurantDetails);
      } catch (error) {
        console.error("Failed to load restaurant details:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="main-container" style={{ padding: "60px 20px", minHeight: "85vh" }}>
      <div className="container mx-auto" style={{ maxWidth: "1200px" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span style={{ 
            color: "var(--color-primary)", 
            fontWeight: "700", 
            letterSpacing: "3px", 
            fontSize: "0.9rem",
            textTransform: "uppercase",
            display: "inline-block",
            marginBottom: "10px"
          }}>
            Premium Traditional Food Service
          </span>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "800", 
            color: "var(--primary-text-color)",
            margin: "0 0 15px 0",
            fontFamily: "'Outfit', sans-serif"
          }}>
            Delivery & Services
          </h1>
          <div style={{ 
            height: "4px", 
            width: "80px", 
            background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
            margin: "0 auto",
            borderRadius: "999px"
          }}></div>
        </div>

        {/* Main Content Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
          
          {/* Left Column: Ordering & Delivery Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Card 1: Order Methods */}
            <div className="glassmorphic legal-screen-card" style={{ padding: "30px", borderRadius: "var(--radius-lg)" }}>
              <h2 style={{ 
                fontSize: "1.4rem", 
                fontWeight: "700", 
                color: "var(--color-primary)", 
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <i className="fas fa-shopping-basket" style={{ color: "var(--color-secondary)" }}></i> ORDER METHODS
              </h2>
              
              <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={{ 
                  background: "rgba(46, 204, 113, 0.1)", 
                  borderRadius: "50%", 
                  width: "50px", 
                  height: "50px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <i className="fas fa-laptop" style={{ color: "var(--color-primary)", fontSize: "1.2rem" }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--primary-text-color)", marginBottom: "6px" }}>ON OUR WEBSITE</h3>
                  <p style={{ color: "var(--secondary-text-color)", fontSize: "0.95rem", lineHeight: "1.5" }}>
                    Select your favorite dishes and premium traditional thalis through our real-time interactive menu and checkout securely.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ 
                  background: "rgba(230, 126, 34, 0.1)", 
                  borderRadius: "50%", 
                  width: "50px", 
                  height: "50px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <i className="fas fa-phone-alt" style={{ color: "var(--color-secondary)", fontSize: "1.2rem" }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--primary-text-color)", marginBottom: "6px" }}>BY PHONE</h3>
                  <p style={{ color: "var(--secondary-text-color)", fontSize: "0.95rem", lineHeight: "1.5" }}>
                    Call our hotline directly to order your meal or check today's specials:<br />
                    <strong style={{ color: "var(--color-primary)", fontSize: "1rem" }}>{restaurant?.contact?.phone || "+91 99999 99999"}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Delivery & Pickup Methods */}
            <div className="glassmorphic legal-screen-card" style={{ padding: "30px", borderRadius: "var(--radius-lg)" }}>
              <h2 style={{ 
                fontSize: "1.4rem", 
                fontWeight: "700", 
                color: "var(--color-primary)", 
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <i className="fas fa-truck-loading" style={{ color: "var(--color-secondary)" }}></i> DELIVERY & PICKUP
              </h2>
              
              <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={{ 
                  background: "rgba(46, 204, 113, 0.1)", 
                  borderRadius: "50%", 
                  width: "50px", 
                  height: "50px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <i className="fas fa-truck" style={{ color: "var(--color-primary)", fontSize: "1.2rem" }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--primary-text-color)", marginBottom: "6px" }}>EXPRESS DELIVERY</h3>
                  <p style={{ color: "var(--secondary-text-color)", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "8px" }}>
                    We deliver fresh and piping hot traditional foods straight to your door in less than 60 minutes.
                  </p>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: "600" }}>
                    Hours: {restaurant?.operatingHours?.mondayToFriday || "10:00 AM - 10:00 PM"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ 
                  background: "rgba(230, 126, 34, 0.1)", 
                  borderRadius: "50%", 
                  width: "50px", 
                  height: "50px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <i className="fas fa-store" style={{ color: "var(--color-secondary)", fontSize: "1.2rem" }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--primary-text-color)", marginBottom: "6px" }}>SELF PICKUP</h3>
                  <p style={{ color: "var(--secondary-text-color)", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "8px" }}>
                    Place your order on the web, track its readiness status, and pick it up directly from our outlet.
                  </p>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-secondary)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                    Hours: {restaurant?.operatingHours?.mondayToFriday || "10:00 AM - 10:00 PM"}
                  </span>
                  <div style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    padding: "10px 14px", 
                    borderRadius: "8px", 
                    fontSize: "0.85rem", 
                    color: "var(--secondary-text-color)",
                    border: "1px solid var(--border-color)"
                  }}>
                    <strong style={{ color: "var(--primary-text-color)" }}>Address: </strong>
                    {restaurant ? `${restaurant.address.line1}, ${restaurant.address.city}, ${restaurant.address.state} - ${restaurant.address.zipcode}` : "Srinath Dham, Udaipur, Rajasthan"}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps & Highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Map Container Card */}
            <div className="glassmorphic legal-screen-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              <h2 style={{ 
                fontSize: "1.4rem", 
                fontWeight: "700", 
                color: "var(--color-primary)", 
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingLeft: "10px"
              }}>
                <i className="fas fa-map-marked-alt" style={{ color: "var(--color-secondary)" }}></i> FIND US ON THE MAP
              </h2>
              
              <iframe
                style={{ 
                  width: "100%", 
                  height: "300px", 
                  borderRadius: "12px", 
                  border: "1px solid var(--border-color)",
                  marginBottom: "20px"
                }}
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d904.4130984802746!2d73.824053!3d24.943909!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39680d005b02db7f%3A0xc9cc198672b0269d!2sSrinath%20dham!5e0!3m2!1sen!2sus!4v1734886482424!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
                title="Google Maps Location of Satyanam Food Center"
              ></iframe>

              {/* Delivery Feature Highlights Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "15px", padding: "10px" }}>
                
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <i className="fas fa-check-circle" style={{ color: "var(--color-primary)", fontSize: "1.5rem" }}></i>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--primary-text-color)", margin: 0 }}>
                    Free Delivery<br />
                    <span style={{ fontSize: "0.75rem", color: "var(--secondary-text-color)", fontWeight: "400" }}>Over ₹500 orders</span>
                  </p>
                </div>

                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <i className="fas fa-clock" style={{ color: "var(--color-primary)", fontSize: "1.5rem" }}></i>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--primary-text-color)", margin: 0 }}>
                    45 Mins Average<br />
                    <span style={{ fontSize: "0.75rem", color: "var(--secondary-text-color)", fontWeight: "400" }}>Delivery window</span>
                  </p>
                </div>

                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <i className="fas fa-wallet" style={{ color: "var(--color-primary)", fontSize: "1.5rem" }}></i>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--primary-text-color)", margin: 0 }}>
                    Cash / Card<br />
                    <span style={{ fontSize: "0.75rem", color: "var(--secondary-text-color)", fontWeight: "400" }}>Paid at your door</span>
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
