import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../../services/reviewsService";
import ms from "ms";

const useReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    staleTime:ms("20m"),
    gcTime:ms("30m")
  });

export default useReviews;