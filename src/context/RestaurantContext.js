import { createContext, useState, useEffect, useContext } from "react";
import { getData, menuData } from "../services/service"; // Import API functions

// Create Context
const RestaurantContext = createContext();

// Context Provider
export const RestaurantProvider = ({ children }) => {
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const restaurantData = await getData(); // Fetch restaurant details
                setRestaurant(restaurantData.restaurantDetails || {});

                const menuItems = await menuData(); // Fetch menu data
                setMenu(menuItems || []);
            } catch (error) {
                console.error(`Error fetching data: ${error.message}`);
            }
        }

        fetchData();
    }, []);

    return (
        <RestaurantContext.Provider value={{ restaurant, menu }}>
            {children}
        </RestaurantContext.Provider>
    );
};

// Custom Hook to Use Context
export const useRestaurant = () => {
    return useContext(RestaurantContext);
};
