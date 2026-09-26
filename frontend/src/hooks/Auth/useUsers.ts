import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import APIClient from "../../services/api-client";
import type { LoginResponse } from "../../services/authService";


const apiClient = new APIClient<LoginResponse>('/users');

const useUsers =() => useQuery({
    queryKey:['users'],
    queryFn:()=>
        apiClient.getAll({}),
    staleTime: ms('5m'), //5 minutes
});

export default useUsers;