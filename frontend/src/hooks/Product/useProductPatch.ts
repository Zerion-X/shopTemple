import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchProduct } from "../../services/productService";
import type { PatchProductPayload } from "../../services/productService";

interface PatchProductVariables {
  productId: number | string;
  payload: PatchProductPayload;
}

const useProductPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: PatchProductVariables) =>
      patchProduct(productId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.productId],
      });
    },
  });
};

export default useProductPatch;