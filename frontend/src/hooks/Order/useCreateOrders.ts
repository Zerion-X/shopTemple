import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderKeys, type CreateOrderResponse } from "../../Entities/Order";
import { createOrder } from "../../services/orderService";

const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateOrderResponse, Error, string>({
    mutationFn: (shippingAddress) => createOrder(shippingAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: orderKeys.mine });
    },
  });
};

export default useCreateOrder;