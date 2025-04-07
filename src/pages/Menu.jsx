import "../styles/menu.css";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCategories, menuData } from "../services/service";
import { Skeleton } from "@mui/material";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [hideCart, setHideCart] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query
  const [bill, setBill] = useState({ null: true });
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || []; // Initialize cart from localStorage
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getCategories();
        const productsResponse = await menuData();
        setMenuCategories(Object.keys(categoriesResponse)); // Extract category names
        setProducts(productsResponse);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const addToCart = (product) => {
    setCartItems((prev) => {
      const updatedCart = [...prev, { ...product, quantity: 1 }]; // Add quantity field
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
      return updatedCart;
    });
  };

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "All" || product.category === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ); // Filter by search query
  console.log(hideCart);
  return (
    <div>
      <div className={`menu-container w-11/12 mx-auto mb-20 p-2 md:p-4`}>
        <div className="flex flex-col md:flex-row w-full justify-between items-center ">
          <div className="mt-4 flex justify-around">
            <h2 className="text-5xl text-pri brandname font-bold">
              Find The Best Food
            </h2>
          </div>
          <div className="relative">
            <input
              className="border bg-white rounded-full py-2 px-5 pl-10"
              placeholder="  Search Here"
              type="text"
              value={searchQuery} // Bind input to searchQuery state
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex category-div space-x-4 mt-1">
            <button
              className={`py-2 px-3 mt-2  category-title w-max rounded-full ${selectedCategory === "All"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {menuCategories.map((category, index) => (
              <button
                key={index}
                className={`py-2 px-2 mt-2 category-title w-max rounded-full ${selectedCategory === category
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row relative">
          <div className="grid grid-cols-1 md:w- lg:grid-cols-4 gap-6 mt-6 item-cards w-full relative" >
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-0 rounded-3xl shadow-md flex flex-col"
                >
                  {/* Image Skeleton */}
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={160}
                    className="rounded-t-3xl"
                  />

                  <div className="px-4 py-4">
                    {/* Title Skeleton */}
                    <Skeleton variant="text" width="70%" height={30} />

                    {/* Price Skeleton */}
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={25}
                      className="mt-0"
                    />

                    {/* Description Skeleton */}
                    <Skeleton
                      variant="text"
                      width="90%"
                      height={20}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      className="mt-0"
                    />

                    <div>
                      <div className="flex items-center mt-0">
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton
                          variant="text"
                          width={40}
                          height={20}
                          className="ml-2"
                        />
                        <Skeleton
                          variant="rectangular"
                          width="50%"
                          height={40}
                          className="mt-4 ml-auto rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
              : filteredProducts.map((item) => (
                <div
                  key={item.name}
                  className="bg-white relative item-card p-none rounded-3xl shadow-md"
                >
                  <div className="relative hidden md:block">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-40 object-cover rounded-t-3xl ${item.available ? "" : "outofstock"
                        }`}
                    />
                  </div>
                  <div className="p-4 pt-0 pb-4">
                    <h3 className="text-xl flex justify-between font-bold mt-4">
                      {item.name}
                      <span className="text-green-500"> Rs.{item.price}</span>
                    </h3>
                    <p className="text-gray-500 overflow-x-scroll mb-4">
                      {item.description.split(" + ").join(", ")}
                    </p>
                    <div>
                      {" "}
                      <div className="flex-col items-center rating mt-2">
                        <div>
                          {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                              <i
                                key={index}
                                className={`fas ${item.rating >= starValue
                                  ? "fa-star text-yellow-500"
                                  : item.rating >= starValue - 0.5
                                    ? "fa-star-half-alt text-yellow-500"
                                    : "fa-star text-gray-300"
                                  }`}
                              ></i>
                            );
                          })}
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }} // Slightly shrink on click
                        transition={{ type: "spring", stiffness: 200 }}
                        onClick={() => addToCart(item)}
                        className="bg-green-500 text-white cart-button py-2 px-4 ml-10 rounded-full mt-4"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {hideCart ? (
            <button
              onClick={() => { setHideCart(false); setShowCart(true) }} // Set `hideCart` to false to show the cart
              className="fixed bottom-10 right-20 bg-green-500 text-white py-3 px-6 rounded-full shadow-lg"
            >
              <i className="fas fa-shopping-cart"></i> Cart
            </button>
          ) : (
            showCart ? (
              <Cart
                setBill={setBill}
                cartItems={cartItems}
                setCartItems={setCartItems}
                setShowCart={setShowCart}
                setHideCart={setHideCart}
              />
            ) : (
              <Checkout
                bill={bill}
                setBill={setBill}
                cartItems={cartItems}
                setCartItems={setCartItems}
                setShowCart={setShowCart}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
