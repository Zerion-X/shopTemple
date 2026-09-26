import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "../../services/categoriesService";

const useCategoriesCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export default useCategoriesCreate;