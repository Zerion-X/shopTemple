import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Box padding={5} flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminLayout;
