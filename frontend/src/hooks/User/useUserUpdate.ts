import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../services/userService";
import type { UpdateUserPayload } from "../../services/userService";

interface UpdateUserVariables {
  userId: number | string;
  payload: UpdateUserPayload;
}

const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateUserVariables) =>
      updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useUserUpdate;