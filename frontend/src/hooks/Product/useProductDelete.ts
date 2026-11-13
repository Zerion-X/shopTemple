import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../services/productService";

const useProductDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number | string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export default useProductDelete;