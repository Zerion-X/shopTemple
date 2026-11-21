import { useQuery } from "@tanstack/react-query";
import { orderKeys, type AdminOrder } from "../../Entities/Order";
import { getAllOrders } from "../../services/orderService";
import ms from "ms";

const useOrders = () =>
  useQuery<AdminOrder[]>({
    queryKey: orderKeys.admin,
    queryFn: getAllOrders,
    staleTime:ms("2m")
  });

export default useOrders;