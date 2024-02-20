import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",   // Import the API URL from the .env file using Vite's import.meta.env
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;