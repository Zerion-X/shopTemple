import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import { getWishlistProductIds } from "../../services/wishlistsService";

export const wishlistIdsKey = ["wishlist", "ids"];

const toSet = (ids: number[]) => new Set(ids);

const fetchWishlistIds = async () => {
  try {
    return await getWishlistProductIds();
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return [];
    }
    throw err;
  }
};

const useWishlistIds = () =>
  useQuery({
    queryKey: wishlistIdsKey,
    queryFn: fetchWishlistIds,
    select: toSet,
    retry: false,
    staleTime: ms("5m"),
  });

export default useWishlistIds;