import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import "../styles/landing.css";
import { getData } from "../services/service";
import { Link } from "react-router-dom";
export default function Landing(props) {
    const [restaurant, setrestaurant] = useState({ name: "Welcome to Restaurant", tagline: "" });
    const [loading, setLoading] = useState(true);
    const images = [
        "/coverpage/img1.jpeg",
        "/coverpage/img2.jpeg",
        "/coverpage/img3.jpeg",
        "/coverpage/img4.jpeg",
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await restaurantName();
            setLoading(false)
        }
        fetchData()
    }, []);


    async function restaurantName() {
        try {
            const response = await getData();
            console.log(response);

            setrestaurant(response.restaurantDetails);
        } catch (error) {
            console.error(error);
        }
    }
    console.log(restaurant)
    return loading ? (
        <div className="cover-page">
            <div className="cover-text">
                <h1>{restaurant.name}</h1>
            </div>
            <Carousel images={images} />
        </div>
    ) : (
        <div className="cover-page">
            <div className="cover-text">
                <h1>
                    {restaurant.name}
                    <span className="restaurant-tagline">{restaurant.tagline}</span>
                </h1>
            </div>
            <Carousel images={images} />
            <button className="browse-menu-button">
                <Link to="/menu">Browse Menu</Link>
            </button>
        </div>
    );
}
