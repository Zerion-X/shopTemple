import { useQuery } from "@tanstack/react-query";
import type Order from "../../Entities/Order";
import { orderKeys } from "../../Entities/Order";
import { getMyOrders } from "../../services/orderService";
import ms from "ms";

const useMyOrders = () =>
  useQuery<Order[]>({
    queryKey: orderKeys.mine,
    queryFn: getMyOrders,
    staleTime:ms("2m")
  });

export default useMyOrders;