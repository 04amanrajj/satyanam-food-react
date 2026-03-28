import { createContext, useState, useEffect, useContext } from "react";
import { getData, menuData } from "../services/service"; // Import API functions
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert

// Create Context
const RestaurantContext = createContext();

// Context Provider
export const RestaurantProvider = ({ children }) => {
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [error, setError] = useState(null); // State for error handling
    const [open, setOpen] = useState(false); // State for Snackbar visibility

    useEffect(() => {
        async function fetchData() {
            try {
                const restaurantData = await getData(); // Fetch restaurant details
                setRestaurant(restaurantData.restaurantDetails || {});

                const menuItems = await menuData(); // Fetch menu data
                setMenu(menuItems || []);
            } catch (error) {
                console.error(`Error fetching data: ${error.message}`);
                setError(error.message); // Set error message
                setOpen(true); // Show Snackbar
            }
        }

        fetchData();
    }, []);

    const handleClose = () => {
        setOpen(false); // Close Snackbar
    };

    const [cart, setCart] = useState([]);

    // Load cart on startup
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Sync cart to localStorage whenever it changes
    const syncCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const addToCart = (item) => {
        const existing = cart.find(i => i.id === item.id);
        let updated;
        if (existing) {
            updated = cart.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
        } else {
            updated = [...cart, { ...item, quantity: 1 }];
        }
        syncCart(updated);
    };

    const removeFromCart = (itemId) => {
        const updated = cart.filter(i => i.id !== itemId);
        syncCart(updated);
    };

    const updateQuantity = (itemId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(itemId);
            return;
        }
        const updated = cart.map(i => i.id === itemId ? { ...i, quantity: newQty } : i);
        syncCart(updated);
    };

    const clearCart = () => {
        syncCart([]);
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <RestaurantContext.Provider value={{ 
                restaurant, 
                menu, 
                cart, 
                addToCart, 
                removeFromCart, 
                updateQuantity, 
                clearCart 
            }}>
                {children}
            </RestaurantContext.Provider>
        </>
    );
};

// Custom Hook to Use Context
export const useRestaurant = () => {
    return useContext(RestaurantContext);
};
