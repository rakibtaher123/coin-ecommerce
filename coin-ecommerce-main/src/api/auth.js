import axios from "axios";
const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response;
  } catch (error) {
    throw error.response || { data: { error: "Server error" }, status: 500 };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: data.email,
      password: data.password
    });
    return response;
  } catch (error) {
    throw error.response || { data: { error: "Server error" }, status: 500 };
  }
};
