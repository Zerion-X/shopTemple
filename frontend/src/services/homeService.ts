import axios from "axios";
import type Product from "../Entities/Product";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/home",
  withCredentials: true,
});

export const getBestSellers = () =>
  axiosInstance.get<Product[]>("/best-sellers").then((res) => res.data);

export const getNewestProducts = () =>
  axiosInstance.get<Product[]>("/newest").then((res) => res.data);

export const getBudgetPicks = () =>
  axiosInstance.get<Product[]>("/budget-picks").then((res) => res.data);

export const getCategoryProducts = (categoryId: number) =>
  axiosInstance
    .get<Product[]>(`/category/${categoryId}`)
    .then((res) => res.data);