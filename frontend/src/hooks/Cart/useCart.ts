import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { getCart } from "../../services/cartService";

const useCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    staleTime: ms("1m"),
    gcTime: ms("10m"),
  });

export default useCart;
