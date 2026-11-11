import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../services/categoriesService";

const useCategoryId = (categoryId: number | string) =>
  useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => getCategory(categoryId),
    enabled: !!categoryId,
  });

export default useCategoryId;