import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCategories, menuData } from "../services/service";
import { Skeleton } from "@mui/material";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../styles/menu.css";

const Menu = () => {
  const { cart, addToCart, setCartOpen } = useRestaurant();
  const [products, setProducts] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "All" || product.category === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Total quantity calculation for the mobile floating cart button
  const cartTotalQty = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  return (
    <div className="menu-page-wrapper">
      <div className="container px-4">
        {/* Header Block */}
        <header className="menu-header-section">
          <h1 className="menu-title">Explore Our Premium Menu</h1>
          <p className="menu-subtitle">Freshly prepared pure vegetarian delicacies crafted daily with handpicked spices</p>
          
          {/* Elegant Search Input */}
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
        </header>

        {/* Redesigned Premium Category Filter Bar */}
        <div className="filter-wrapper">
          <div className="categories-scroll-wrapper">
            <button
              className={`filter-tile ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All")}
            >
              <div className="filter-icon-circle">
                <i className="fas fa-utensils"></i>
              </div>
              <div className="filter-tile-info">
                <span className="filter-name">All Dishes</span>
                <span className="filter-count">{products.length} Items</span>
              </div>
            </button>
            {menuCategories.map((category, index) => {
              const count = products.filter(p => p.category === category).length;
              
              // Map categories to FontAwesome icons defensively
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

              return (
                <button
                  key={index}
                  className={`filter-tile ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="filter-icon-circle">
                    <i className={getCategoryIcon(category)}></i>
                  </div>
                  <div className="filter-tile-info">
                    <span className="filter-name">{category}</span>
                    <span className="filter-count">{count} Items</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="menu-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
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
              ))
            : filteredProducts.map((item) => {
                const isAvailable = item.available !== false;
                return (
                  <article 
                    key={item._id || item.id || item.name} 
                    className={`menu-card ${!isAvailable ? "outofstock" : ""}`}
                  >
                    {/* Image Area */}
                    <div className="menu-card-img-container">
                      <img
                        src={item.image || "/coverpage/img1.jpeg"}
                        alt={item.name}
                        className="menu-card-img"
                        loading="lazy"
                      />
                      
                      {/* Premium Pure Veg tag overlay */}
                      <span className="menu-card-badge">
                        <i className="fas fa-leaf"></i> Veg
                      </span>

                      {!isAvailable && (
                        <div className="outofstock-badge">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Details Area */}
                    <div className="menu-card-details">
                      <div className="menu-card-header">
                        <h3 className="menu-card-title">{item.name}</h3>
                        <div className="menu-card-price-row">
                          <span className="menu-card-price">Rs.{item.price}</span>
                          <span className="menu-card-price-original">Rs.{Math.round(item.price * 1.25)}</span>
                        </div>
                      </div>

                      <p className="menu-card-desc">
                        {item.description ? item.description.split(" + ").join(", ") : "Prepared fresh daily using pure traditional ingredients."}
                      </p>

                      <div className="menu-card-footer">
                        {/* Rating Stars */}
                        <div className="menu-card-rating">
                          {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            const rating = item.rating || 4.5;
                            return (
                              <i
                                key={index}
                                className={`fas ${
                                  rating >= starValue
                                    ? "fa-star"
                                    : rating >= starValue - 0.5
                                    ? "fa-star-half-alt"
                                    : "fa-star"
                                }`}
                                style={{ color: rating >= starValue - 0.5 ? "#f1c40f" : "var(--border-color)" }}
                              ></i>
                            );
                          })}
                        </div>

                        {/* Interactive Add button */}
                        {isAvailable && (
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onClick={() => addToCart(item)}
                            className="menu-add-btn"
                          >
                            <i className="fas fa-plus"></i> Add
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
      </div>

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
