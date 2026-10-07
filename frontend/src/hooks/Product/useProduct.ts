import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { getProductById } from "../../services/productService";

const useProduct = (id: number) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    staleTime: ms("5m"),
  });

export default useProduct;