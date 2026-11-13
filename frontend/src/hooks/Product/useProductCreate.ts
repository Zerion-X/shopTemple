import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../services/productService";
import type { CreateProductPayload } from "../../services/productService";

const useProductCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export default useProductCreate;