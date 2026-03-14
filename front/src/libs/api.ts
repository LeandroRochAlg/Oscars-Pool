import axios from "axios";

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
    const requestUrl = String(error?.config?.url || '');
    const isAuthRequest = /\/login\/?$/.test(requestUrl);
    const isPublicAuthPath = ['/login', '/register', '/reset-password', '/action-handler'].some((path) =>
      window.location.pathname.startsWith(path)
    );

    if (error.response?.status === 401 && !isAuthRequest && !isPublicAuthPath) {
      localStorage.removeItem('user');
      window.location.href = '/login?redirect=' + window.location.pathname;
    }
    return Promise.reject(error);
  }
);

export default api;