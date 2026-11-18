import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/categoriesService";
import ms from "ms";

const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: ms("20m"),
    gcTime: ms("30m")
  });

export default useCategories;