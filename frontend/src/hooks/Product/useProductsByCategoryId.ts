import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import ms from "ms";
import type Product from "../../Entities/Product";

const apiClient = new APIClient<Product>("/products");

const useProductsByCategoryId = (category_id: number) =>
  useQuery({
    queryKey: ["products", "category", category_id],
    queryFn: () => apiClient.getAll({}, `/products/category/${category_id}`),
    staleTime: ms("5m"),
  });

export default useProductsByCategoryId;
