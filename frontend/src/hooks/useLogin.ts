import { useMutation } from "@tanstack/react-query";
import { login, type LoginPayload } from "../services/authService";


const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });

export default useLogin;