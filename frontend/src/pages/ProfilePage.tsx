import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Separator,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  // karia change this
  const user = {
    full_name: "Test User",
    email: "test@gmail.com",
    address: "123 Main St, Baku, Azerbaijan",
  };

  return (
    <Box maxWidth="500px" margin="auto" padding={6}>
      <VStack gap={2} marginBottom={6}>
        <Avatar.Root size="2xl" colorPalette="cyan">
          <Avatar.Fallback name={user.full_name} />
        </Avatar.Root>
        <Heading size="lg">{user.full_name}</Heading>
      </VStack>

      <VStack align="stretch" gap={4}>
        <Box>
          <Text fontSize="sm" color="gray.500">
            Email
          </Text>
          <Text fontSize="md">{user.email}</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">
            Address
          </Text>
          <Text fontSize="md">{user.address}</Text>
        </Box>

        <Separator marginY={4} />

        <HStack gap={4}>
          <Button flex="1" onClick={() => navigate("/wishlist")}>
            Wishlists
          </Button>
          <Button
            flex="1"
            variant="outline"
            borderWidth="2px"
            onClick={() => navigate("/orders")}
          >
            Orders
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProfilePage;
