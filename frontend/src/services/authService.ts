import axios from "axios";
import { type SignupResponse, type LoginResponse } from "./api-client";

const axiosInstance = axios.create({
    baseURL:"http://localhost:3000/api/auth"
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});


export interface LoginPayload {
  email: string;
  password: string;
}

export const login = (payload: LoginPayload) =>
  axiosInstance.post<LoginResponse>("/login", payload).then((res) => {
    const token = res.headers["x-auth-token"];
    return { ...res.data, token };
  });

export interface SignupPayload {
    full_name:string;
    email:string;
    password:string
}

export const signup = (payload: SignupPayload) =>
  axiosInstance.post<SignupResponse>("/signup", payload).then((res) => {
    const token = res.headers["x-auth-token"];
    return { ...res.data, token };
  });

export const get = () => 
    axiosInstance.get<LoginResponse>("/me").then(res => res.data)