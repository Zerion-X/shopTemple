import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import useUser from "../Auth/useUser";
import { getWishlistProductIds } from "../../services/wishlistsService";

export const wishlistIdsKey = ["wishlist", "ids"];

const toSet = (ids: number[]) => new Set(ids);

const useWishlistIds = () => {
  const { data: user } = useUser();

  return useQuery({
    queryKey: wishlistIdsKey,
    queryFn: getWishlistProductIds,
    select: toSet,
    enabled: !!user,
    staleTime: ms("5m"),
  });
};

export default useWishlistIds;