import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  type CreateReviewPayload,
} from "../services/reviewsService";

const useReviewCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "products", variables.product_id],
        exact:true
      });
    },
  });
};

export default useReviewCreate;