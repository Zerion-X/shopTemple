import { useQuery } from "@tanstack/react-query";
import { getReviewById } from "../services/reviewsService";

const useReviewById = (reviewId: number | string) =>
  useQuery({
    queryKey: ["reviews", reviewId],
    queryFn: () => getReviewById(reviewId),
    enabled: !!reviewId,
  });

export default useReviewById;