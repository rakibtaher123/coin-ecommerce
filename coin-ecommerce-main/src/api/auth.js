import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "https://gangaridai-auction.onrender.com";
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    const err = error?.response?.data || { error: "Server error" };
    throw err;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    const err = error?.response?.data || { error: "Server error" };
    throw err;
  }
};
