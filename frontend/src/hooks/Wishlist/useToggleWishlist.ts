import { useMutation, useQueryClient , noop } from "@tanstack/react-query";

import { wishlistItemsKey } from "./useWishlist";
import { addToWishlist, removeFromWishlist, type WishlistItem,getWishlist } from "../../services/wishlistsService";
import { wishlistIdsKey } from "./useWishlistedIds";


interface ToggleVariables {
  productId: number;
  isWishlisted: boolean;
}

const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, isWishlisted }: ToggleVariables) =>
      isWishlisted ? removeFromWishlist(productId) : addToWishlist(productId),

    onMutate: async ({ productId, isWishlisted }) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousIds = queryClient.getQueryData<number[]>(wishlistIdsKey);
      const previousItems =
        queryClient.getQueryData<WishlistItem[]>(wishlistItemsKey);

      queryClient.setQueryData<number[]>(wishlistIdsKey, (old = []) =>
        isWishlisted
          ? old.filter((id) => id !== productId)
          : [...old, productId],
      );

  
      if (isWishlisted) {
        queryClient.setQueryData<WishlistItem[]>(wishlistItemsKey, (old) =>
          old?.filter((item) => item.product_id !== productId),
        );
      }

      return { previousIds, previousItems };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(wishlistIdsKey, context.previousIds);
      }
      if (context?.previousItems) {
        queryClient.setQueryData(wishlistItemsKey, context.previousItems);
      }
    },

    onSettled: () => {
    queryClient.invalidateQueries({ queryKey: wishlistIdsKey });

    queryClient
        .query({
        queryKey: wishlistItemsKey,
        queryFn: getWishlist,
        staleTime: 0,
        })
        .catch(noop);
},
  });
};

export default useToggleWishlist;

