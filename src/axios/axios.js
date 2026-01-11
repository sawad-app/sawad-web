import axios from 'axios';

const api = axios.create({
    // Tự động lấy URL từ file .env tương ứng (local hoặc production)
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default api;