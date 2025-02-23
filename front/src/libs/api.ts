import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // Import the API URL from the .env file using Vite's import.meta.env
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token;
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      const navigate = useNavigate();
      navigate('/login?redirect=' + window.location.pathname);
    }
    return Promise.reject(error);
  }
);

export default api;