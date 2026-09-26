import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUser from "../hooks/Auth/useUser";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="size-6 animate-spin rounded-full border-2 border-[#F5BFC9] border-t-[#C93663]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
