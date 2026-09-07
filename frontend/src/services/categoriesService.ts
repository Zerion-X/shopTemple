import axios from "axios";
import type Category from "../Entities/Category";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/categories",
  withCredentials: true,
});

interface CreatePayload {
    name:string
}

export const create = (payload: CreatePayload) =>
  axiosInstance.post<Category>("/", payload).then((res) => {
    return res.data;
  });
