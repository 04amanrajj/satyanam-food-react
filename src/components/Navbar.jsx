import React, { useEffect, useState } from "react";
import { getData } from "../services/service";
import '../styles/navbar.css';

export default function Navbar() {
    const [product, setProduct] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getData();
                setProduct(response.data);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [])
    console.log(product);

    return (
        <div className="navbar">
            <div className="brandname"> <h1>{product?.restaurantDetails?.name || "Restaurant"}</h1></div>
            <div className="links">
                <a href=" ">Cart</a>
                <a href=" ">Order</a>
                <a href=" ">Profile</a>
            </div>
        </div>
    )
}
