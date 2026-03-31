import axios from "axios";
export const getShop = async () =>{
    const URL = import.meta.env.VITE_MONGO_URI + "/shop";   
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("🔥 GET SHOP ERROR 🔥", error);
    }
}