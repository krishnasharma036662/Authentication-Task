import api from "./axios";

export const registerUser = (data) =>
    api.post("/auth/register", data);

export const loginUser = (data) =>
    api.post("/auth/login", data);

export const getMe = (token) =>
    api.get("/auth/get-me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

export const refreshToken = () =>
    api.post("/auth/refresh-token");

export const logout = () =>
    api.post("/auth/logout");

export const logoutAll = () =>
    api.post("/auth/logout-all");
