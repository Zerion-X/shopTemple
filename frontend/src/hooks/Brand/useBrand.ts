import { useQuery } from "@tanstack/react-query";
import { getBrand } from "../../services/brandsService";

const useBrandId = (brandId: number | string) =>
  useQuery({
    queryKey: ["brands", brandId],
    queryFn: () => getBrand(brandId),
    enabled: !!brandId,
  });

export default useBrandId;