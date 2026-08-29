import {
  Box,
  HStack,
  Link as ChakraLink,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <Box borderTopWidth="1px" padding="20px" marginTop="40px">
      <VStack gap={4}>
        <HStack gap={6}>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/cart">Cart</Link>
        </HStack>

        <HStack gap={5}>
          <ChakraLink href="https://github.com" target="_blank">
            <FaGithub size={20} />
          </ChakraLink>
          <ChakraLink href="https://twitter.com" target="_blank">
            <FaTwitter size={20} />
          </ChakraLink>
          <ChakraLink href="https://instagram.com" target="_blank">
            <FaInstagram size={20} />
          </ChakraLink>
        </HStack>

        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} ShopTemple. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
