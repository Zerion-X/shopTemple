import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDeleteReview } from "../../services/reviewsService";

const useAdminDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number | string) => adminDeleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export default useAdminDeleteReview;