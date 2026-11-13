import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { getProductsByCategoryId } from "../../services/productService";

const useProductsByCategoryId = (id: number) =>
  useQuery({
    queryKey: ["products", "category", id],
    queryFn: () => getProductsByCategoryId(id),
    staleTime: ms("5m"),
  });

export default useProductsByCategoryId;