import { useMutation } from "@tanstack/react-query";
import { signup, type SignupPayload } from "../services/authService";


const useSignup = () =>
  useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
  });

export default useSignup;