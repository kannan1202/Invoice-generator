import axios from "axios";

//axios instance
const api = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true
});

export default api;