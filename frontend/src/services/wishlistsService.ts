import axios from "axios";
import type Product from "../Entities/Product";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/wishlist",
  withCredentials: true,
});

export type WishlistItem = Product & { wishlisted_at: string };

export const getWishlist = () =>
  axiosInstance.get<WishlistItem[]>("/").then((res) => res.data);

export const getWishlistProductIds = () =>
  axiosInstance.get<number[]>("/ids").then((res) => res.data);

export const addToWishlist = (productId: number) =>
  axiosInstance.post(`/${productId}`);

export const removeFromWishlist = (productId: number) =>
  axiosInstance.delete(`/${productId}`);