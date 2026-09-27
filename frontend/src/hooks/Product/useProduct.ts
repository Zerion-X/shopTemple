import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import ms from "ms";
import type Product from "../../Entities/Product";

const apiClient = new APIClient<Product>("/products");

const useProduct = (id: number) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => apiClient.get(id),
    staleTime: ms("5m"),
  });

export default useProduct;
