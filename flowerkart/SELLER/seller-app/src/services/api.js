import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/seller",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("sellerToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
export default api;
