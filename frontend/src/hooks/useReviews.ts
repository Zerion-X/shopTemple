import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../services/reviewsService";

const useReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

export default useReviews;