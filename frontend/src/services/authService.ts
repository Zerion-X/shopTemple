import axios from "axios";
import type User from "../Entities/User";
export interface LoginResponse {
    user_id:number;
    full_name:string;
    email:string;
    role:string
    created_at:Date
}

export interface SignupResponse {
    user_id:number;
    full_name:string;
    email:string;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = (payload: LoginPayload) =>
  axiosInstance.post<LoginResponse>("/login", payload).then((res) => {
    return res.data;
  });

export interface SignupPayload {
  full_name: string;
  email: string;
  password: string;
}

export const signup = (payload: SignupPayload) =>
  axiosInstance.post<SignupResponse>("/signup", payload).then((res) => {
    return res.data;
  });

export const getMe = async () => {
  try {
    const response = await axiosInstance.get<User>("/me");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const logout = () =>
  axiosInstance.post("/logout");
