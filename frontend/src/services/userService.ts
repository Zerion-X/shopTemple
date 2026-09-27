import axios from "axios";
import type User from "../Entities/User";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/user",
  withCredentials: true,
});
 
export interface UpdateUserPayload {
  full_name?: string;
  address?: string;
}

export const getAllUsers = () =>
  axiosInstance.get<User[]>("/").then((res) => res.data);

export const updateUser = (
  userId: number | string,
  payload: UpdateUserPayload
) =>
  axiosInstance.put<User>(`/${userId}`, payload).then((res) => res.data);

export const deleteUser = (userId: number | string) =>
  axiosInstance.delete(`/${userId}`);

