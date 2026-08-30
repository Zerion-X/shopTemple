import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { get } from "../services/authService";

const useUser =() => useQuery({
    queryKey: ["profile"],
        queryFn: get,
        staleTime:ms("1m") //1 minute
});

export default useUser;