import axios from "axios";
// Base URL for the API
const baseUrl = "https://satyanaam-food-backend.onrender.com";
export const getData = async (url) => {
    try {
        const response = await axios.get(url ? url : baseUrl);
        return response.data;
    } catch (error) {
        console.error(`api fetch error : ${error.message}`);
    }
}
export const menuData = async () => {
    try {
        const response = await axios.get(baseUrl + "/menu");
        return response.data;
    } catch (error) {
        console.error(`api fetch error : ${error.message}`);
    }
}