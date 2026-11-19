
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../../services/cartService";

interface AddToCartPayload {
  product_id: number;
  quantity?: number;
}

const useCartAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product_id, quantity = 1 }: AddToCartPayload) =>
      addToCart(product_id, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export default useCartAdd;
