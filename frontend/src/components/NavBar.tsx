import { Box, Button, HStack, Image, Spinner, Text } from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { CiShoppingCart } from "react-icons/ci";
import { ColorModeButton, useColorMode } from "../components/ui/color-mode";
import SearchInput from "./SearchInput";
import CategoriesBar from "./CategoriesBar";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import useUser from "../hooks/useUser";

const NavBar = () => {
  const { colorMode } = useColorMode();
  const { data: user, isFetching } = useUser();

  const isLoggedIn = !!user;

  return (
    <>
      <HStack justifyContent="space-between" padding="10px">
        <Link to="/">
          <Image src={logo} boxSize="60px" />
        </Link>

        <SearchInput />

        {isFetching ? (
          <Spinner size="sm" />
        ) : isLoggedIn ? (
          <Link to={`/${user.role === "admin" ? user.role : "profile"}`}>
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
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <CategoriesBar />
      </Box>
    </>
  );
};

export default NavBar;
