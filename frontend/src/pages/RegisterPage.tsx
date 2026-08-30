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
import useSignup from "../hooks/useSignup";
import useUserQueryStore from "../store";
import { isAxiosError } from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useSignup();
  const setIsUserLoggedIn = useUserQueryStore((s) => s.setIsUserLoggedIn);

  const [formData, setFormData] = useState({
    full_name: "",
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
        navigate("/");
      },
    });
  };

  return (
    <Box maxWidth="500px" margin="auto" padding={6}>
      <VStack gap={2} marginBottom={6}>
        <Heading size="lg">Create an Account</Heading>
        <Text fontSize="sm" color="gray.500">
          Sign up to get started
        </Text>
      </VStack>

      <form onSubmit={handleSubmit}>
        <VStack align="stretch" gap={4}>
          <Field.Root required>
            <Field.Label>Full Name</Field.Label>
            <Input
              value={formData.full_name}
              onChange={handleChange("full_name")}
              placeholder="John Doe"
            />
          </Field.Root>

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
              {error && (
                <Text fontSize="sm" color="red.500">
                  {isAxiosError(error) &&
                  typeof error.response?.data === "string"
                    ? error.response.data
                    : "Something went wrong. Please try again."}
                </Text>
              )}
            </Text>
          )}

          <Button
            type="submit"
            colorPalette="cyan"
            loading={isPending}
            marginTop={2}
          >
            Sign Up
          </Button>
        </VStack>
      </form>

      <Separator marginY={6} />

      <HStack>
        <Text fontSize="sm" textAlign="center" color="gray.500">
          Already have an account?{" "}
        </Text>
        <Button
          color="cyan.500"
          fontWeight="medium"
          variant="plain"
          onClick={() => navigate("../login")}
        >
          Login
        </Button>
      </HStack>
    </Box>
  );
};

export default RegisterPage;
