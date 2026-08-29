import { Button, HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { CiShoppingCart } from "react-icons/ci";
import { ColorModeButton, useColorMode } from "../components/ui/color-mode";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import useUserQueryStore from "../store";

const NavBar = () => {
  const { colorMode } = useColorMode();
  const isUserLoggedIn = useUserQueryStore((s) => s.userQuery.isUserLoggedIn);

  return (
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
        <Link to="/authentication">
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
  );
};

export default NavBar;
