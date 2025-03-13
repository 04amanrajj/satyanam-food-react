import "../styles/products.css";
import React, { useState, useEffect } from "react";
import { menuData } from "../services/service";
import { Skeleton } from "@mui/material";
import Chip from "@mui/material/Chip";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await menuData();
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, []);

    const addToCart = (product) => {
        // Add product to cart logic here
        console.log(`Added ${product.name} to cart`);
    };

    return loading ? (
        <div className="product-container">
            {[...Array(5)].map((_, index) => (
                <div className="card" key={index}>
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="max"
                        height={300}
                    />
                    <Skeleton animation="wave" variant="text" width={200} height={40} />
                    <Skeleton animation="wave" variant="text" width={250} height={20} />
                    <Skeleton animation="wave" variant="text" width={100} height={20} />
                    <Skeleton animation="wave" variant="text" width={50} height={20} />
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="max"
                        height={40}
                    />
                </div>
            ))}
        </div>
    ) : (
        <div className="product-container">
            {products.map((product) => {
                const discountedPrice = (product.price * 0.8).toFixed(2);
                const isAvailable = product.available;

                return (
                    <div className="item" key={product._id}>
                        <div className="item-img">
                            <img
                                src={product.image}
                                className={isAvailable ? "" : "outofstock"}
                                alt={product.name}
                                width="300px"
                                height="300px"
                            />
                        </div>

                        <div className="item-details">
                            <h3 className="item-name">
                                {product.name}
                                <Chip label={`★ ${product.rating}`} color="success" />
                            </h3>

                            <p className="item-description">
                                <abbr title={product.description}>{product.description}</abbr>
                            </p>

                            <p
                                className="item-og-price"
                                style={{ color: "#999", textDecoration: "line-through" }}
                            >
                                Rs.{product.price.toFixed(2)}
                                <span className="badge rounded-pill text-bg-warning">
                                    20% off
                                </span>
                            </p>

                            <p className="item-price">Rs.{discountedPrice}</p>
                        </div>

                        <div className="cart-box">
                            <button
                                className={`btn-glow cart-button fa fa-cart-plus ${isAvailable ? "" : "outofstock"
                                    }`}
                                onClick={() => isAvailable && addToCart(product)}
                                disabled={!isAvailable}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Products;
