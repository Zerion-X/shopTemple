import axios from "axios";
import type Category from "../Entities/Category";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/categories",
  withCredentials: true,
});

export const getCategories = () =>
  axiosInstance.get<Category[]>("/").then((res) => res.data);

interface CreatePayload {
  name: string;
  image: File;
}

export const create = (payload: CreatePayload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("image", payload.image);

  return axiosInstance
    .post<Category>("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

interface RemovePayload {
  category_id: number;
}

export const remove = (payload: RemovePayload) =>
  axiosInstance.delete<void>(`/${payload.category_id}`).then((res) => {
    return res.data;
  });