import axios from "axios";

let productsCache = null;
let productsRequest = null;

export const getCachedProducts = () => productsCache || [];

export const getProducts = async () => {
  const URL = import.meta.env.VITE_API_URL + "/products";
  try {
    if (productsCache) return productsCache;
    if (!productsRequest) {
      productsRequest = axios.get(URL).then((response) => {
        productsCache = response.data;
        return productsCache;
      }).finally(() => {
        productsRequest = null;
      });
    }
    return productsRequest;
  } catch (error) {
    console.error("🔥 GET PRODUCTS ERROR 🔥", error);
    throw error;
  }
};
export const getProductById = async (id) => {
  const URL = `${import.meta.env.VITE_API_URL}/productsById/${id}`;
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("🔥 GET PRODUCT BY ID ERROR 🔥", error);
    throw error;
  } 
};

export const getProfile = async (id) => {
  const URL = `${import.meta.env.VITE_API_URL}/profile/${id}`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {   
    console.error("🔥 GET PROFILE ERROR 🔥", error);
    throw error;
  }
};

export const updateProfile = async (id, formData) => {
  const URL = `${import.meta.env.VITE_API_URL}/profileUpdate`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(URL, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("🔥 UPDATE PROFILE ERROR 🔥", error);
    throw error;
  }
};

export const submitReview = async (orderId, reviewData) => {
  const URL = `${import.meta.env.VITE_API_URL}/review/${orderId}`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(URL, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("🔥 SUBMIT REVIEW ERROR 🔥", error);
    throw error;
  }
};
