import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <NavBar />
      <Box padding={5} flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
