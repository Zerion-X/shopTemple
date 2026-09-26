import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remove } from "../../services/categoriesService";

const useCategoriesDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export default useCategoriesDelete;