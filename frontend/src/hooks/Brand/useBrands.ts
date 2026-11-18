import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../../services/brandsService";
import ms from "ms";

const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: ms("20m"),
    gcTime: ms("30m")
  });

export default useBrands;