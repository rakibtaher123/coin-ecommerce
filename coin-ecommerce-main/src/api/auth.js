import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "https://gangaridai-auction.onrender.com";
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", {
  email: data.email,
  password: data.password,
});
