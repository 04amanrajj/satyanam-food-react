import React, { useEffect, useState } from "react";
import { useRestaurant } from "../contexts/RestaurantContext";
import { Box, Container, Typography, Grid, Skeleton } from "@mui/material";

const Footer = () => {
    const { restaurant } = useRestaurant();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (restaurant && Object.keys(restaurant).length > 0) {
            setLoading(false);
        }
    }, [restaurant]);

    return (
        <Box component="footer" sx={{ backgroundColor: "#f3f4f6", py: 5 }}>
            <Container maxWidth="lg">
                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <FooterContent restaurant={restaurant} />
                )}
            </Container>
        </Box>
    );
};

const SkeletonLoader = () => (
    <Box component="footer" sx={{ backgroundColor: "#f3f4f6", py: 5 }}>
        <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="space-between">
                {/* Brand Info */}
                <Grid item xs={12} md={3} textAlign={{ xs: "center", md: "left" }}>
                    <Typography variant="h6" fontWeight="bold">
                        <Skeleton animation="wave" variant="text" width={250} height={30} />
                    </Typography>
                    <Skeleton animation="wave" variant="text" width={100} height={20} />
                </Grid>

                {/* Navigation Links */}
                {[
                    { title: "Company", links: ["About", "Store", "FAQ"] },
                    { title: "Service", links: ["Delivery", "Payment", "Contacts"] },
                    { title: "Follow us", links: ["Instagram", "Facebook", "Twitter"] },
                ].map((section, index) => (
                    <Grid item xs={12} sm={4} md={2} key={index} textAlign={{ xs: "center", md: "left" }}>
                        <Skeleton animation="wave" variant="text" width={90} height={25} />
                        {section.links.map((link, i) => (
                            <Typography key={i} color="textSecondary">
                                <Skeleton animation="wave" variant="text" width={100} height={20} />
                            </Typography>
                        ))}
                    </Grid>
                ))}

                {/* Newsletter Subscription */}
                <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "left" }}>
                    <Typography fontWeight="bold" gutterBottom>
                        <Skeleton animation="wave" variant="text" width={200} height={25} />
                    </Typography>
                    <Box display="flex" justifyContent={{ xs: "center", md: "flex-start" }}>
                        <Skeleton variant="rectangular" width={200} height={40} />
                    </Box>
                    <Box mt={2}>
                        <Skeleton animation="wave" variant="text" width={150} height={20} />
                        <Skeleton animation="wave" variant="text" width={150} height={20} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    </Box>
);

const FooterContent = ({ restaurant }) => (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between ">
        {/* Left Side - Restaurant Info */}
        <div className="text-left mb-6 md:mb-0 w-full md:w-auto">
            <h1 className="text-2xl font-bold mb-2">{restaurant?.name}</h1>
            <p className="text-gray-600">2025 © All rights reserved</p>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between w-full md:w-auto">
            {[
                { title: "Company", links: ["About", "FAQ"] },
                { title: "Service", links: ["Delivery", "Payment", "Contacts"] },
                { title: "Follow us", links: ["Instagram", "Facebook", "Twitter"] },
            ].map((section, index) => (
                <div key={index} className="text-left mb-6 md:mb-0 md:mr-10 w-full md:w-auto">
                    <h5 className="font-bold mb-1">{section.title}</h5>
                    <ul className="pl-1">
                        {section.links.map((link, i) => (
                            <li key={i}>
                                <a
                                    href={restaurant?.socialMedia?.[link.toLowerCase()] || (link === "Twitter" ? "https://twitter.com" : "#")}
                                    className="text-gray-600 hover:text-gray-800 transition"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        {/* Right Side - Newsletter */}
        <div className="text-center md:text-left w-full md:w-auto">
            <h4 className="font-bold mb-2">Get our newsletters</h4>
            <form className="flex justify-center md:justify-start">
                <input
                    type="email"
                    placeholder="Your email"
                    className="p-2 border border-gray-300 rounded-l-md focus:outline-none w-3/4 md:w-auto"
                />
                <button type="submit" className="p-2 bg-gray-700 text-white rounded-r-md">
                    <i className="fas fa-check"></i>
                </button>
            </form>
            <div className="mt-2">
                <a href="/terms" className="text-gray-600 mr-4 hover:text-gray-800 transition">
                    Terms & Conditions
                </a>
                <a href="/privacy" className="text-gray-600 hover:text-gray-800 transition">
                    Privacy Policy
                </a>
            </div>
        </div>
    </div>

);

export default Footer;
