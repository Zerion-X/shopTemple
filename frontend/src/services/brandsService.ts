import axios from "axios";
import type Brand from "../Entities/Brand";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/brands",
  withCredentials: true,
});

interface CreatePayload {
    name:string,
    image:File
}

export const create = (payload: CreatePayload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("image", payload.image);

  return axiosInstance
    .post<Brand>("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

interface RemovePayload {
    brand_id:number
}

export const remove = (payload:RemovePayload) =>
  axiosInstance.delete<void>(`/${payload.brand_id}`).then((res) => {
    return res.data;
  });
