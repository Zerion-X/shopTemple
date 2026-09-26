import axios from "axios";
import type Brand from "../Entities/Brand";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/brands",
  withCredentials: true,
});

interface CreatePayload {
    name:string
}

export const create = (payload: CreatePayload) =>
  axiosInstance.post<Brand>("/", payload).then((res) => {
    return res.data;
  }); 
