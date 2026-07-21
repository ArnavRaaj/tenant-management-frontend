import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    // In a real app with Redux or localStorage, we get the token here
    // For now we'll check localStorage directly (ensure this runs client side)
    if (typeof window !== "undefined") {
      const authStorage = localStorage.getItem("auth");
      if (authStorage) {
        const { token } = JSON.parse(authStorage);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
