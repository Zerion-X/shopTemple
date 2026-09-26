import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../../services/brandsService";

const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

export default useBrands;