import { useQueryClient, useMutation } from "@tanstack/react-query";
import { orderKeys, type OrderStatus } from "../../Entities/Order";
import { updateOrderStatus } from "../../services/orderService";

const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { id: number; status: OrderStatus }
  >({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.admin });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.mine });
    },
  });
};

export default useUpdateOrderStatus;