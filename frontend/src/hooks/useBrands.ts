import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";
import type Brand from "../Entities/Brand";


const apiClient = new APIClient<Brand>('/brands');

const useBrands =() => useQuery({ 
    queryKey:['brands'],
    queryFn:()=>
        apiClient.getAll({}),
    staleTime: ms('5m'), //5 minutes
});

export default useBrands; 