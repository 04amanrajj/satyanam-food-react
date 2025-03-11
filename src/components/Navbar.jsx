import React, { useEffect, useState } from "react";
import { getData } from "../services/service";
import '../styles/navbar.css';

export default function Navbar() {
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getData();
                setProduct(response.data);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])
    console.log(product);

    return loading ? (<h1>Loading....</h1>) : (
        <div className="navbar">
            <div className="brandname"> <h1>{product.restaurantDetails.name}</h1></div>
            <div className="links">
                <a href=" ">Cart</a>
                <a href=" ">Order</a>
                <a href=" ">Profile</a>
            </div>
        </div>
    )
}
