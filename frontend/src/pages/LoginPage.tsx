import { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Heading,
  Field,
  Input,
  Separator,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import useUserQueryStore from "../store";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();
  const setIsUserLoggedIn = useUserQueryStore((s) => s.setIsUserLoggedIn);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: (data) => {
        setIsUserLoggedIn(true);
        localStorage.setItem("token", data.token);
        console.log("token received:", data.token);
        navigate("/");
      },
    });
  };

  return (
    <Box maxWidth="500px" margin="auto" padding={6}>
      <VStack gap={2} marginBottom={6}>
        <Heading size="lg">Welcome Back</Heading>
        <Text fontSize="sm" color="gray.500">
          Log in to your account
        </Text>
      </VStack>

      <form onSubmit={handleSubmit}>
        <VStack align="stretch" gap={4}>
          <Field.Root required>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="john@example.com"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
            />
          </Field.Root>

          {error && (
            <Text fontSize="sm" color="red.500">
              {error.message || "Invalid email or password."}
            </Text>
          )}

          <Button
            type="submit"
            colorPalette="cyan"
            loading={isPending}
            marginTop={2}
          >
            Log In
          </Button>
        </VStack>
      </form>

      <Separator marginY={6} />

      <HStack>
        <Text fontSize="sm" textAlign="center" color="gray.500">
          Don't have an account?{" "}
        </Text>
        <Button
          color="cyan.500"
          fontWeight="medium"
          variant="plain"
          onClick={() => navigate("/register")}
        >
          Sign up
        </Button>
      </HStack>
    </Box>
  );
};

export default LoginPage;
