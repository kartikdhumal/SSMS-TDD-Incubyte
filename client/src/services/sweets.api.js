import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = localStorage.getItem("token");
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllSweets = () => API.get("/sweets");

export const searchSweets = (params) =>
  API.get("/sweets/search", { params });

export const createSweet = (data) =>
  API.post("/sweets", data);

export const updateSweet = (id, data) =>
  API.put(`/sweets/${id}`, data);

export const deleteSweet = (id) =>
  API.delete(`/sweets/${id}`);

export const purchaseSweet = (id, quantity) =>
  API.post(`/sweets/${id}/purchase`, { quantity });

export const restockSweet = (id, quantity) =>
  API.post(`/sweets/${id}/restock`, { quantity });
