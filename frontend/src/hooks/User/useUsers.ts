import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/userService";
import ms from "ms";


const useUsers =() => useQuery({
    queryKey:['users'],
    queryFn:getAllUsers,
    staleTime:ms("5m"),
    gcTime:ms("10m")
});

export default useUsers;