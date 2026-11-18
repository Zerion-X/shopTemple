import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import useUser from "../Auth/useUser";
import { getWishlist } from "../../services/wishlistsService";

export const wishlistItemsKey = ["wishlist", "items"];

const useWishlist = () => {
  const { data: user } = useUser();

  return useQuery({
    queryKey: wishlistItemsKey,
    queryFn: getWishlist,
    enabled: !!user,
    staleTime: ms("5m"),
  });
};

export default useWishlist;