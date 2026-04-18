import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, menuData } from "../services/service";
import { Skeleton } from "@mui/material";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../styles/menu.css";

const Menu = () => {
  const { cart, addToCart, setCartOpen } = useRestaurant();
  
  // Data States
  const [products, setProducts] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation & UI States
  const [activeSection, setActiveSection] = useState("All");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, itemName: "", itemImage: "" });

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getCategories();
        const productsResponse = await menuData();
        setMenuCategories(Object.keys(categoriesResponse));
        setProducts(productsResponse);
        setLoading(false);
      } catch (error) {
        console.error("Menu data fetch failed:", error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto Dismiss Toast Feedback Popup after 2.5 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Map category names to FontAwesome icons defensively
  const getCategoryIcon = (catName) => {
    const name = catName.toLowerCase();
    if (name.includes("thali")) return "fas fa-bowl-food";
    if (name.includes("sweet") || name.includes("dessert")) return "fas fa-cookie-bite";
    if (name.includes("paneer")) return "fas fa-cheese";
    if (name.includes("chinese") || name.includes("fast") || name.includes("pizza") || name.includes("burger")) return "fas fa-pizza-slice";
    if (name.includes("drink") || name.includes("beverage")) return "fas fa-glass-cheers";
    if (name.includes("bread") || name.includes("roti") || name.includes("naan")) return "fas fa-bread-slice";
    return "fas fa-utensils";
  };

  // Scroll to section helper
  const scrollToSection = (sectionId, categoryName) => {
    setActiveSection(categoryName);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -90; // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Standardize description to join items using " + "
  const formatDescription = (desc) => {
    if (!desc) return "Prepared fresh daily using pure traditional ingredients.";
    const parts = desc.split(/[+,]/).map(p => p.trim()).filter(Boolean);
    return parts.join(" + ");
  };

  // Safe Cart Quantity Counter for mobile floating bubble
  const cartTotalQty = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  // Filter products by search query
  const searchFilteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group products by category (only include categories that have items matching search query)
  const groupedProducts = menuCategories.reduce((acc, category) => {
    const items = searchFilteredProducts.filter((p) => p.category === category);
    if (items.length > 0) {
      acc[category] = items;
    }
    return acc;
  }, {});

  // Intercept standard add to cart to display instant feedback popups
  const handleAddToCart = (item) => {
    addToCart(item);
    setToast({
      show: true,
      itemName: item.name,
      itemImage: item.image || "/coverpage/img1.jpeg"
    });
  };

  return (
    <div className="menu-page-wrapper">
      <div className="container px-4">
        {/* Header Block */}
        <header className="menu-header-section">
          <h1 className="menu-title">Explore Our Premium Menu</h1>
          <p className="menu-subtitle">Freshly prepared pure vegetarian traditional dishes prepared daily with love</p>
          
          {/* Combined Search & Filter Row */}
          <div className="search-filter-row">
            <div className="search-wrapper">
              <input
                className="search-input"
                placeholder="Search dishes..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            
            <button 
              className="mobile-category-select-icon-btn" 
              onClick={() => setIsFilterModalOpen(true)}
              aria-label="Select Category"
              title="Select Category"
            >
              <i className="fas fa-sliders-h"></i>
            </button>
          </div>
        </header>

        {/* --- Main Grid Layout --- */}
        <div className="menu-desktop-layout">
          
          {/* Sticky Left Sidebar Navigation (Desktop UI) */}
          <aside className="menu-sidebar-panel">
            <h2 className="sidebar-title">
              <i className="fas fa-list-ul"></i> Categories
            </h2>
            <nav className="sidebar-menu-list">
              <button
                className={`sidebar-menu-item ${activeSection === "All" ? "active" : ""}`}
                onClick={() => {
                  setActiveSection("All");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="sidebar-icon-wrap">
                  <i className="fas fa-utensils"></i>
                  <span>All Dishes</span>
                </div>
                <span className="sidebar-count">{searchFilteredProducts.length}</span>
              </button>

              {menuCategories.map((category, index) => {
                const count = searchFilteredProducts.filter((p) => p.category === category).length;
                if (count === 0) return null; // Hide category if no matches exist
                return (
                  <button
                    key={index}
                    className={`sidebar-menu-item ${activeSection === category ? "active" : ""}`}
                    onClick={() => scrollToSection(`category-section-${index}`, category)}
                  >
                    <div className="sidebar-icon-wrap">
                      <i className={getCategoryIcon(category)}></i>
                      <span>{category}</span>
                    </div>
                    <span className="sidebar-count">{count}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Main Catalog Content Area */}
          <main className="menu-main-content">
            {loading ? (
              // Skeletal Loader Grid
              <div className="menu-grid">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="menu-card">
                    <div className="menu-card-img-container">
                      <Skeleton variant="rectangular" width="100%" height="100%" />
                    </div>
                    <div className="menu-card-details">
                      <div className="menu-card-header">
                        <Skeleton variant="text" width="60%" height={28} />
                        <Skeleton variant="text" width="25%" height={28} />
                      </div>
                      <Skeleton variant="text" width="90%" height={20} style={{ margin: "10px 0" }} />
                      <div className="menu-card-footer">
                        <Skeleton variant="rectangular" width="30%" height={20} />
                        <Skeleton variant="rectangular" width="40%" height={36} style={{ borderRadius: "20px" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : Object.keys(groupedProducts).length === 0 ? (
              // Empty search state
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <i className="fas fa-search-minus" style={{ fontSize: "3rem", color: "var(--border-color)", marginBottom: "15px" }}></i>
                <h3 style={{ color: "var(--primary-text-color)", fontWeight: "700" }}>No matches found</h3>
                <p style={{ color: "var(--secondary-text-color)" }}>Try adjusting your keywords or browse all categories.</p>
              </div>
            ) : (
              // Grouped Categorized Lists
              Object.keys(groupedProducts).map((category, catIndex) => {
                const catProducts = groupedProducts[category];
                return (
                  <section 
                    key={category} 
                    id={`category-section-${catIndex}`} 
                    className="category-section"
                  >
                    {/* Category Title Header */}
                    <h2 className="category-section-title">
                      <i className={getCategoryIcon(category)} style={{ color: "var(--color-primary)" }}></i>
                      {category}
                      <span>{catProducts.length}</span>
                    </h2>

                    {/* Grids inside sections */}
                    <div className="menu-grid">
                      {catProducts.map((item) => {
                        const isAvailable = item.available !== false;
                        return (
                          <article 
                            key={item._id || item.id || item.name} 
                            className={`menu-card ${!isAvailable ? "outofstock" : ""}`}
                          >
                            {/* Image Container (top on desktop, right on mobile) */}
                            <div className="menu-card-img-container">
                              <img
                                src={item.image || "/coverpage/img1.jpeg"}
                                alt={item.name}
                                className="menu-card-img"
                                loading="lazy"
                              />
                              
                              {/* Veg Badge */}
                              <span className="menu-card-badge">
                                <i className="fas fa-leaf"></i> Veg
                              </span>

                              {/* Mobile Add to Cart Button overlaying image */}
                              {isAvailable && (
                                <button 
                                  className="menu-add-btn-mobile d-mobile-only" 
                                  onClick={() => handleAddToCart(item)}
                                >
                                  <i className="fas fa-cart-plus"></i>
                                </button>
                              )}

                              {!isAvailable && (
                                <div className="outofstock-badge">
                                  Out of Stock
                                </div>
                              )}
                            </div>

                            {/* Details Container (bottom on desktop, left on mobile) */}
                            <div className="menu-card-details">
                              <div className="menu-card-title-row">
                                <h3 className="menu-card-title">{item.name}</h3>
                                <span className="rating-pill">
                                  <i className="fas fa-star"></i> {item.rating || 4.9}
                                </span>
                              </div>

                              <p className="menu-card-desc">
                                {formatDescription(item.description)}
                              </p>

                              <div className="menu-card-footer">
                                <div className="menu-card-price-container">
                                  <div className="original-price-row">
                                    <span className="menu-card-price-original">Rs.{(item.price * 1.25).toFixed(2)}</span>
                                    <span className="discount-badge">20% off</span>
                                  </div>
                                  <span className="menu-card-price">Rs.{Number(item.price).toFixed(2)}</span>
                                </div>

                                {/* Desktop Add to Cart Button */}
                                {isAvailable && (
                                  <button 
                                    className="menu-add-btn-desktop d-desktop-only" 
                                    onClick={() => handleAddToCart(item)}
                                  >
                                    <i className="fas fa-shopping-cart"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </main>
        </div>
      </div>

      {/* --- Mobile Categories Bottom Sheet Modal --- */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div 
            className="mobile-filter-modal-overlay" 
            onClick={() => setIsFilterModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="mobile-filter-bottom-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle"></div>
              <div className="bottom-sheet-header">
                <h3>Select Category</h3>
                <button className="close-btn" onClick={() => setIsFilterModalOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="bottom-sheet-list">
                {menuCategories.map((category, index) => {
                  const count = searchFilteredProducts.filter((p) => p.category === category).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={index}
                      className="bottom-sheet-item"
                      onClick={() => {
                        scrollToSection(`category-section-${index}`, category);
                        setIsFilterModalOpen(false);
                      }}
                    >
                      <i className={getCategoryIcon(category)}></i>
                      <span>{category}</span>
                      <span className="count-badge">{count}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- User Feedback Cart added Toast Popup --- */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="cart-feedback-toast"
          >
            <img src={toast.itemImage} alt={toast.itemName} className="toast-img" />
            <div className="toast-content">
              <span className="toast-title">
                <i className="fas fa-check-circle" style={{ marginRight: "4px" }}></i> Added to Cart!
              </span>
              <span className="toast-subtitle">{toast.itemName}</span>
            </div>
            <button 
              className="toast-close" 
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            >
              <i className="fas fa-times"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating cart toggle badge (only visible on mobile screens via CSS rules) */}
      {cartTotalQty > 0 && (
        <button 
          className="mobile-cart-badge d-md-none" 
          onClick={() => setCartOpen(true)}
          aria-label="Open shopping cart"
        >
          <i className="fas fa-shopping-basket"></i>
          <span className="mobile-cart-count">{cartTotalQty}</span>
        </button>
      )}
    </div>
  );
};

export default Menu;
