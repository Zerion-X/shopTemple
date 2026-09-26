import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/categoriesService";

const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

export default useCategories;