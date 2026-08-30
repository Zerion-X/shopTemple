import axios, { type AxiosRequestConfig } from "axios";


export interface FetchResponse <T>{
  results: T[];
}

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
    baseURL:"http://localhost:3000/api"
});

class APIClient <T> {
    endpoint:string;

    constructor(enpoint:string){
        this.endpoint = enpoint
    }

    getAll = (config:AxiosRequestConfig) => {
        return axiosInstance
        .get<FetchResponse<T>>(this.endpoint,config)
        .then(res => res.data)
    }

    get = (id:number) => {
        return axiosInstance
        .get<T>(this.endpoint+'/'+id)
        .then(res => res.data)
    }
}

export default APIClient;

