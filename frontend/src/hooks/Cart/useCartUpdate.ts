import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../../services/cartService";
import type Cart from "../../Entities/Cart";

interface UpdateCartPayload {
  product_id: number;
  quantity: number;
}

const useCartUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product_id, quantity }: UpdateCartPayload) =>
      updateCartItem(product_id, quantity),

    onMutate: async ({ product_id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      queryClient.setQueryData<Cart>(["cart"], (oldCart) => {
        if (!oldCart) return oldCart;

        return {
          ...oldCart,
          items: oldCart.items.map((item) =>
            item.product_id === product_id ? { ...item, quantity } : item,
          ),
        };
      });

      return { previousCart };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export default useCartUpdate;
