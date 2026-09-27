import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";
import type Product from "../Entities/Product";

const apiClient = new APIClient<Product>("/products");

const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.getAll({}),
    staleTime: ms("5m"),
  });

export default useProducts;
