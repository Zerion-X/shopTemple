import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCart } from "../../services/cartService";

const useCartClear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export default useCartClear;
