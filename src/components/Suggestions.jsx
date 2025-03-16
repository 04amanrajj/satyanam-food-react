import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

const Suggestions = ({ dishes }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (dish) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...cart, dish]));
    navigate("/menu");
  };
  const limitedDishes = [...dishes.slice(0, 4), ...dishes.slice(19, 23)];
  return (
    <div className="suggestion p-6">
      <div className="container w-100 shadow-md mx-auto mb-20 p-20">
        <h1 className="text-4xl bg-white w-max p-4 rounded-full font-bold mb-6">
          Popular Dishes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-md p-none w-64"
              >
                <Skeleton className="rounded-t-3xl" variant="rectangular" width={256} height={160} />
                <div className="p-2">
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="20%" />
                  <Skeleton className="rounded-b-3xl" variant="rectangular" width="100%" height={40} />
                </div>
              </div>
            ))
            : limitedDishes.map((dish, index) => (
              <div
                key={index}
                className="card bg-white rounded-lg shadow-md p-none w-full relative"
              >
                <img
                  alt={dish.name}
                  className="rounded-t-lg w-full h-40 object-cover"
                  height="256"
                  src={dish.image}
                  width="256"
                />
                <div className="details">
                  <h3 className="text-gray-800 font-semibold text-lg">
                    {dish.name}
                  </h3>
                  <div className="flex m-0 items-center justify-between">
                    <span className="text-green-600 font-bold text-xl">
                      Rs.{dish.price}
                    </span>
                    <span className="text-green-600 flex items-center">
                      <i
                        className={`fas fa-circle text-xs mr-1 ${dish.isVeg ? "text-green-600" : "text-green-600"
                          }`}
                      ></i>
                      {dish.isVeg ? "Veg" : "Veg"}
                    </span>
                  </div>
                  <button
                    className="cart-btn mt-4 w-full bg-green-100 text-green-600 py-2 rounded-lg"
                    onClick={() => handleAddToCart(dish)}
                  >
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
