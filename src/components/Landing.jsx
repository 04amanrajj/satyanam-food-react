import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import "../styles/landing.css";
import { getData } from "../services/service";
export default function Landing(props) {
    const [restaurent, setRestaurent] = useState({ name: "Welcome to Restaurant", tagline: "" });
    const [showMenu, setShowMenu] = useState(props.showMenu);
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
            console.log(showMenu);
            setLoading(false)
        }
        fetchData()
    }, [showMenu]);


    async function restaurantName() {
        try {
            const response = await getData();
            setRestaurent(response?.data?.restaurantDetails);
        } catch (error) {
            console.error(error);
        }
    }
    return loading ? (
        <div className="cover-page">
            <div className="cover-text">
                <h1>{restaurent.name}</h1>
            </div>
            <Carousel images={images} />
        </div>
    ) : (
        <div className="cover-page">
            <div className="cover-text">
                <h1>
                    {restaurent.name}
                    <span className="restaurant-tagline">{restaurent.tagline}</span>
                </h1>
            </div>
            <Carousel images={images} />
            <button className="browse-menu-button" onClick={() => setShowMenu(true)}>Browse Menu</button>
        </div>
    );
}
