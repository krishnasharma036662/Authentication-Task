import axios from "axios";

const api = axios.create({
    baseURL: "https://authentication-task-v8j8.onrender.com/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;