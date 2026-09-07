import axios, { type AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true
});

class APIClient <T> {
    endpoint:string;

    constructor(enpoint:string){
        this.endpoint = enpoint
    }

    getAll = (config:AxiosRequestConfig) => {
        return axiosInstance
        .get<T[]>(this.endpoint,config)
        .then(res => res.data)
    }

    get = (id:number) => {
        return axiosInstance
        .get<T>(this.endpoint+'/'+id)
        .then(res => res.data)
    }
}

export default APIClient;

