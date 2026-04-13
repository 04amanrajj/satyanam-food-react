import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
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
                    <StyledExploreLink to="/menu">
                        Explore Menu &nbsp; <i className="fas fa-arrow-right"></i>
                    </StyledExploreLink>
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

const StyledExploreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: white;
  padding: 16px 36px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 10px 20px -5px rgba(30, 83, 60, 0.3);
  transition: color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease;
  cursor: pointer;

  i {
    margin-left: 8px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &::after {
    content: "";
    background: white;
    position: absolute;
    z-index: -1;
    left: -20%;
    right: -20%;
    top: 0;
    bottom: 0;
    transform: skewX(-45deg) scale(0, 1);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  }

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    box-shadow: 0 15px 30px -5px rgba(30, 83, 60, 0.4);
  }

  &:hover::after {
    transform: skewX(-45deg) scale(1, 1);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;
