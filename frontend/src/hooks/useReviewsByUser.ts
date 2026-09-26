import { useQuery } from "@tanstack/react-query";
import { getUserReviews } from "../services/reviewsService";

const useReviewsByUser = () =>
  useQuery({
    queryKey: ["reviews", "users"],
    queryFn: getUserReviews,
  });

export default useReviewsByUser;