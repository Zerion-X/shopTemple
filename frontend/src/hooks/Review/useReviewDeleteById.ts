import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../../services/reviewsService";

const useReviewDeleteById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number | string) => deleteReview(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export default useReviewDeleteById;