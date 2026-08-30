import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { CiShoppingCart } from "react-icons/ci";
import { ColorModeButton, useColorMode } from "../components/ui/color-mode";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import useUserQueryStore from "../store";
import { categories } from "../constants";

const NavBar = () => {
  const { colorMode } = useColorMode();
  const isUserLoggedIn = useUserQueryStore((s) => s.userQuery.isUserLoggedIn);

  return (
    <>
      <HStack justifyContent="space-between" padding="10px">
        <Link to="/">
          <Image src={logo} boxSize="60px" />
        </Link>
        <SearchInput />
        {isUserLoggedIn ? (
          <Link to="/profile">
            <Button variant="ghost">
              <CgProfile size={20} />
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="subtle">Login</Button>
          </Link>
        )}
        <Link to="/cart">
          <Button variant="ghost">
            <CiShoppingCart size={20} />
          </Button>
        </Link>
        <ColorModeButton />
        <Text whiteSpace="nowrap">{colorMode}</Text>
      </HStack>

      <Box
        display="flex"
        gap={2}
        overflowX="auto"
        paddingX="10px"
        paddingBottom="10px"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {categories.map((c) => (
          <Button
            key={c.id}
            variant="outline"
            borderRadius={25}
            flexShrink={0}
            borderWidth="2px"
          >
            {c.name}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default NavBar;
