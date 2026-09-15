import {
  Box,
  VStack,
  Text,
  Button,
  Heading,
  Separator,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../services/authService";

const AdminPage = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();

      queryClient.setQueryData(["profile"], null);

      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <Box maxWidth="900px" margin="auto" padding={6}>
      <VStack align="stretch" gap={4}>
        <VStack>
          <Avatar.Root size="2xl" colorPalette="cyan">
            <Avatar.Fallback name={user?.full_name} />
          </Avatar.Root>

          <Heading size="lg">Admin Dashboard</Heading>

          <Text color="gray.500">{user?.full_name}</Text>
        </VStack>

        <Separator marginY={4} />

        <Heading size="md">Dashboard</Heading>

        <Box borderWidth="1px" borderRadius="lg" padding={5}>
          <Text fontSize="sm" color="gray.500">
            Sales
          </Text>

          <Heading size="lg">$0</Heading>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" padding={5}>
          <Text fontSize="sm" color="gray.500">
            Orders
          </Text>

          <Heading size="lg">0</Heading>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" padding={5}>
          <Text fontSize="sm" color="gray.500">
            Customers
          </Text>

          <Heading size="lg">0</Heading>
        </Box>

        <Separator marginY={4} />

        <Button size="lg" onClick={() => navigate("/admin/products")}>
          Product Management
        </Button>

        <Button size="lg" onClick={() => navigate("/admin/orders")}>
          Orders Management
        </Button>

        <Button size="lg" onClick={() => navigate("/admin/users")}>
          Users Management
        </Button>

        <Button size="lg" onClick={() => navigate("/admin/categories")}>
          Categories Management
        </Button>
      </VStack>
      <Button
        variant="outline"
        colorPalette="red"
        onClick={handleLogout}
        marginY={5}
      >
        Log out
      </Button>
    </Box>
  );
};

export default AdminPage;
