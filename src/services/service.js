import axios from "axios";
const baseUrl = "https://satyanaam-food-backend.onrender.com/";
export const getData = async () => {
    try {
        const response = await axios.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error(`error : ${error.message}`);
    }
}