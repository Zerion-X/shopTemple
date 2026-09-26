import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "../../services/brandsService";

const useBrandsCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

export default useBrandsCreate;