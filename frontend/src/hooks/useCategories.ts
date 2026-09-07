import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";
import type Category from "../Entities/Category";



const apiClient = new APIClient<Category>('/categories');

const useCategories =() => useQuery({
    queryKey:['categories'],
    queryFn:()=>
        apiClient.getAll({}),
    staleTime: ms('5m'), //5 minutes
});

export default useCategories;