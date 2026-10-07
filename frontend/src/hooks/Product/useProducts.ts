import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { getProducts } from "../../services/productService";

const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: ms("5m"),
  });

export default useProducts;