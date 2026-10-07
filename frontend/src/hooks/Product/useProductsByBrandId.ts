import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { getProductsByBrandId } from "../../services/productService";

const useProductsByBrandId = (id: number) =>
  useQuery({
    queryKey: ["products", "brand", id],
    queryFn: () => getProductsByBrandId(id),
    staleTime: ms("5m"),
  });

export default useProductsByBrandId;