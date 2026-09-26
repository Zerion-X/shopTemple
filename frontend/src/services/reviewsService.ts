import axios from "axios";
import type Review from "../Entities/Review";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/reviews",
  withCredentials: true,
});

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  product_id: number;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export const getReviews = () =>
  axiosInstance.get<Review[]>("/").then((res) => res.data);

export const getReviewsByProduct = (productId: number | string) =>
  axiosInstance
    .get<Review[]>(`/product/${productId}`)
    .then((res) => res.data);

export const getUserReviews = () =>
  axiosInstance.get<Review[]>("/user").then((res) => res.data);

export const getReviewById = (reviewId: number | string) =>
  axiosInstance.get<Review[]>(`/${reviewId}`).then((res) => res.data);

export const createReview = (payload: CreateReviewPayload) =>
  axiosInstance.post<Review>("/", payload).then((res) => res.data);

export const updateReview = (
  productId: number | string,
  payload: UpdateReviewPayload
) =>
  axiosInstance
    .patch<Review>(`/${productId}`, payload)
    .then((res) => res.data);

export const deleteReview = (productId: number | string) =>
  axiosInstance.delete(`/${productId}`);

export const adminDeleteReview = (reviewId: number | string) =>
  axiosInstance.delete(`/admin/${reviewId}`);