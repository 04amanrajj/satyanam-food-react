import axios from "axios";
// Base URL for the API
const baseUrl = "https://satyanaam-food-backend.onrender.com";
// const baseUrl = "https://satyanaam-food-backend.up.railway.app"

export const getData = async (url) => {
    try {
        const response = await axios.get(url ? url : baseUrl);
        return response.data.data;
    } catch (error) {
        console.error(`api fetch error : ${error.message}`);
        throw new Error("Failed to fetch restaurant data."); // Throw error for caller
    }
};

export const menuData = async () => {
    try {
        const response = await axios.get(baseUrl + "/menu");
        return response.data.data;
    } catch (error) {
        console.error(`api fetch error : ${error.message}`);
        throw new Error("Failed to fetch menu data."); // Throw error for caller
    }
};


export const getCategories = async (filters = {}, params = {}) => {
    try {
        const finalFilters = { ...filters, ...params };
        const response = await axios.get(`${baseUrl}/menu`, {
            params: finalFilters,
        });
        console.log(response);
        const items = response.data.data || [];
        if (items.length === 0) return {}; // No data, return empty object

        // Group items by category (assuming each item has a 'category' field)
        const categories = {};
        items.forEach((item) => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });

        return categories; // Return grouped data
    } catch (error) {
        console.error(error);
        return null; // Return null in case of an error
    }
}