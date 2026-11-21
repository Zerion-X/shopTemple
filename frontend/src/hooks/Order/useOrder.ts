import { useQuery } from "@tanstack/react-query";
import { type OrderDetails, orderKeys } from "../../Entities/Order";
import { getOrderById } from "../../services/orderService";
import ms from "ms";

const useOrder = (id: number | undefined) =>
  useQuery<OrderDetails>({
    queryKey: orderKeys.detail(id as number),
    queryFn: () => getOrderById(id as number),
    enabled: Number.isInteger(id) && (id as number) > 0,
    staleTime:ms("2m")
  });

export default useOrder;