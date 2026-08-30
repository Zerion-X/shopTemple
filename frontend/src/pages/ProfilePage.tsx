import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Separator,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

const ProfilePage = () => {
  const navigate = useNavigate();

  //   const { data: user, isPending, error } = useUser();

  //   if (isPending)
  //     return <Spinner margin="auto" display="block" marginTop={10} />;
  //   if (error) return <Text color="red.500">Failed to load profile.</Text>;

  return (
    <Box maxWidth="500px" margin="auto" padding={6}>
      <VStack gap={2} marginBottom={6}>
        <Avatar.Root size="2xl" colorPalette="cyan">
          <Avatar.Fallback name="test" />
        </Avatar.Root>
        <Heading size="lg">"tset"</Heading>
      </VStack>

      <VStack align="stretch" gap={4}>
        <Box>
          <Text fontSize="sm" color="gray.500">
            Email
          </Text>
          <Text fontSize="md">"test"</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">
            Address
          </Text>
          <Text fontSize="md">123 Main St, Baku, Azerbaijan</Text>
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
