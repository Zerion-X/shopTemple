import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { getMe } from "../services/authService";

const useUser =() => useQuery({
    queryKey: ["profile"],
        queryFn: getMe,
        staleTime:ms("0"),
        refetchOnWindowFocus:false,
        refetchOnMount: "always",
        retry:false
});

export default useUser;