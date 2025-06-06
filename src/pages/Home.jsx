import React from "react";
import { menuData } from "../services/service";
import { useRestaurant } from "../contexts/RestaurantContext";
import Suggestions from "../components/Suggestions";
import MenuButton from "../components/ui/MenuButton";

const Home = ({ darkMode, setDarkMode, toggleDarkMode }) => {
    const { restaurant, menu } = useRestaurant();
    const [item, setItems] = React.useState([]);
    const images = React.useMemo(
        () => [
            "/coverpage/img1.jpeg",
            "/coverpage/img2.jpeg",
            "/coverpage/img3.jpeg",
            "/coverpage/img4.jpeg",
        ],
        []
    );

    React.useEffect(() => {
        async function fetchData() {
            try {
                const menuItems = await menuData();
                setItems(menuItems);
            } catch (error) {
                setItems(menu);
                console.error(`Error fetching menu data: ${error.message}`);
            }
        }
        fetchData();
    }, [menu]);
    console.log(darkMode)
    return (
        <div className="main-container">
            <main className="flex flex-col items-center mt-12 px-6">
                <div className="text-center">
                    <h1 className="brandname text-6xl text-pri font-bold">
                        {restaurant?.name || "Most Welcome "}
                    </h1>
                    <p className="text-gray-600 pb-10 text-pri font-bold mt-4">
                        {restaurant?.tagline || "Enjoy Our Delicious Food!"}
                    </p>
                    <MenuButton />
                </div>
                <div className="relative mt-12 w-2/3 md:w-1/2 lg:w-1/5">
                    <div
                        id="myCarousel"
                        className="carousel slide"
                        data-bs-ride="carousel"
                    >
                        <div className="food-img rounded-full carousel-inner cover-page">
                            {images?.map((imgSrc, index) => (
                                <div
                                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                                    key={index}
                                >
                                    <img
                                        src={item[index]?.image || imgSrc}
                                        className="rounded-full"
                                        alt={item[index]?.image || imgSrc}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#myCarousel"
                            data-bs-slide="prev"
                            style={{ opacity: 0 }}
                        >
                            <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Previous</span>
                        </button>

                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#myCarousel"
                            data-bs-slide="next"
                            style={{ opacity: 0 }}
                        >
                            <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                    <div className="feature md:absolute bottom-0 left-1/2 transform -translate-x-20 md:-translate-x-1/2 translate-y-3 md:translate-y-1/2 bg-white rounded-full shadow-lg items-center justify-center gap-1 p-2 hidden md:flex">
                        {/* First Box */}
                        <div className="box2 box-2 text-center rounded-full pr-6 py-1 pl-1">
                            <img
                                src={item[30]?.image || images[1]}
                                alt="Food"
                                className="food-img1 rounded-full"
                                width="100"
                                height="100"
                            />
                            <div>
                                <p className="mt-2 font-semibold text-gray-800">
                                    {item[30]?.name || "Delicious Item"}
                                </p>
                                <p className="flex justify-center text-yellow-500 mt-1">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </p>
                            </div>
                        </div>

                        {/* Second Box */}
                        <div className="box2 box-3 pr-6 py-1 pl-1 text-center rounded-full">
                            <img
                                src={item[20]?.image || images[1]}
                                alt="Food"
                                className="food-img1 rounded-full"
                                width="100"
                                height="100"
                            />
                            <div>
                                <p className="mt-2 font-semibold text-gray-800">
                                    {item[20]?.name || "Tasty Dish"}
                                </p>
                                <p className="flex justify-center text-yellow-500 mt-1">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Suggestions dishes={item} />
        </div>
    );
};
export default Home;
