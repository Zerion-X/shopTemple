import { useQuery } from "@tanstack/react-query";
import { getReviewsByProduct } from "../../services/reviewsService";

const useReviewsByProduct = (productId: number | string) =>
  useQuery({
    queryKey: ["reviews", "products", productId],
    queryFn: () => getReviewsByProduct(productId),
    enabled: !!productId,
    
  });

export default useReviewsByProduct;