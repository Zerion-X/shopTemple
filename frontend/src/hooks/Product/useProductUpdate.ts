import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../services/productService";
import type { UpdateProductPayload } from "../../services/productService";

interface UpdateProductVariables {
  productId: number | string;
  payload: UpdateProductPayload;
}

const useProductUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: UpdateProductVariables) =>
      updateProduct(productId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.productId],
        exact:true
      });
    },
  });
};

export default useProductUpdate;