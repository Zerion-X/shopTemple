import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../services/userService";

const useUserDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number | string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useUserDelete;