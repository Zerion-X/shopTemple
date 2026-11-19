import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../../services/cartService";

const useCartDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product_id: number) => removeCartItem(product_id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export default useCartDelete;
