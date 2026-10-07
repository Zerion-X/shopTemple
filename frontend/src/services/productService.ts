import axios from "axios";
import type Product from "../Entities/Product";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/products",
  withCredentials: true,
});

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  category_id: number;
  brand_id: number;
  image?: File;
}

export interface UpdateProductPayload {
  name: string;
  description?: string;
  price: number;
  category_id: number;
  brand_id: number;
  image?: File;
}

export interface PatchProductPayload {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  brand_id?: number;
  image?: File;
}

const buildFormData = (payload: object) => {
  const formData = new FormData();

  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });

  return formData;
};

export const getProducts = () =>
  axiosInstance.get<Product[]>("/").then((res) => res.data);

export const getProductById = (productId: number | string) =>
  axiosInstance.get<Product>(`/${productId}`).then((res) => res.data);

export const getProductsByCategoryId = (categoryId: number | string) =>
  axiosInstance
    .get<Product[]>(`/category/${categoryId}`)
    .then((res) => res.data);

export const getProductsByBrandId = (brandId: number | string) =>
  axiosInstance
    .get<Product[]>(`/brand/${brandId}`)
    .then((res) => res.data);

export const createProduct = (payload: CreateProductPayload) =>
  axiosInstance
    .post<Product>("/", buildFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const updateProduct = (
  productId: number | string,
  payload: UpdateProductPayload,
) =>
  axiosInstance
    .put<Product>(`/${productId}`, buildFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const patchProduct = (
  productId: number | string,
  payload: PatchProductPayload,
) =>
  axiosInstance
    .patch<Product>(`/${productId}`, buildFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const deleteProduct = (productId: number | string) =>
  axiosInstance.delete(`/${productId}`);