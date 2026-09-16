import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-5">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
