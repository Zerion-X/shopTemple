import axios from "axios";
import type Cart from "../Entities/Cart";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/cart",
  withCredentials: true,
});

export const getCart = () =>
  axiosInstance.get<Cart>("/").then((res) => res.data);

export const addToCart = (product_id: number, quantity = 1) =>
  axiosInstance
    .post("/items", { product_id, quantity })
    .then((res) => res.data);

export const updateCartItem = (product_id: number, quantity: number) =>
  axiosInstance
    .patch(`/items/${product_id}`, { quantity })
    .then((res) => res.data);

export const removeCartItem = (product_id: number) =>
  axiosInstance.delete(`/items/${product_id}`);

export const clearCart = () => axiosInstance.delete("/");
