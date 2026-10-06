import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import ms from "ms";
import type Product from "../../Entities/Product";

const apiClient = new APIClient<Product>("/products");

const useProductsByBrandId = (brand_id: number) =>
  useQuery({
    queryKey: ["products", "brand", brand_id],
    queryFn: () => apiClient.getAll({} , `/brand/${brand_id}`),
    staleTime: ms("5m"),
  });

export default useProductsByBrandId;