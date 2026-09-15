import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner, Box } from "@chakra-ui/react";
import useUser from "../hooks/useUser";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" padding={10}>
        <Spinner />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
