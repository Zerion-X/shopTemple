import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateReview,
  type UpdateReviewPayload,
} from "../../services/reviewsService";

const useReviewUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: number | string;
      payload: UpdateReviewPayload;
    }) => updateReview(productId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "products", variables.productId],
        exact:true
      });
    },
  });
};

export default useReviewUpdate;