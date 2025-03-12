import React, { useState, useEffect } from 'react';
import "../styles/products.css";
import { Skeleton } from '@mui/material';
import Chip from '@mui/material/Chip';

function Products({ products, cartCounter }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (products.length > 0) {
            setLoading(false);
        }
    }, [products]);

    const getUser = JSON.parse(localStorage.getItem("user"));
    const userName = getUser?.name || "Guest";
    const userPhone = getUser?.phone || 9876543210;

    function addToCart(product) {
        console.log(product);
        
        let userCart = JSON.parse(localStorage.getItem("cart")) || {
            items: [],
            totalprice: 0,
            userPhone,
            userName,
        };

        // Add or update the item in cart
        const existingItem = userCart.items.find((item) => item.itemid === product._id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            userCart.items.push({ itemid: product._id, item: product, quantity: 1 });
        }

        // Update total price
        userCart.totalprice = userCart.items.reduce((total, item) => {
            return total + item.quantity * item.item.price;
        }, 0).toFixed(2);

        // Update cart details
        userCart.userName = userName;
        userCart.userPhone = userPhone;

        localStorage.setItem("cart", JSON.stringify(userCart));

        // Call cart counter function if provided
        if (cartCounter) {
            cartCounter();
        }
    }

    return loading ? (
        <div className='product-container'>
            {[...Array(5)].map((_, index) => (
                <div className='card' key={index}>
                    <Skeleton animation="wave" variant="rectangular" width="max" height={300} />
                    <Skeleton animation="wave" variant="text" width={200} height={40} />
                    <Skeleton animation="wave" variant="text" width={250} height={20} />
                    <Skeleton animation="wave" variant="text" width={100} height={20} />
                    <Skeleton animation="wave" variant="text" width={50} height={20} />
                    <Skeleton animation="wave" variant="rectangular" width="max" height={40} />
                </div>
            ))}
        </div>
    ) : (
        <div className='product-container'>
            {products.map((product) => (
                <div className='card' key={product._id}>
                    <img src={product.image} alt={product.name} width="300px" height="300px" />
                    <span><h2>{product.name}<Chip label={`★ ${product.rating}`} color="success" /></h2> </span>
                    <p>{product.description}</p>
                    <div className='price'>Rs.{product.price}</div>
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
}

export default Products;
