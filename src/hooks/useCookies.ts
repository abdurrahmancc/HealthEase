"use client";
import axios from "axios";

export const setCookie = async (token: string) => {
    try {
        await axios.post("/api/auth/setCookie", { token }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
};

export const getCookie = async () => {
    try {
        const response = await axios.get("/api/auth/getCookie", { withCredentials: true});
        return response.data.token;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
};

export const removeCookie = async () => {
    try {
        const response = await axios.delete("/api/auth/deleteCookie", { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
};