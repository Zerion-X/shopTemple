import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remove } from "../../services/brandsService";

const useBrandsDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

export default useBrandsDelete;