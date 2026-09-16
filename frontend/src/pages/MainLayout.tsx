import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <div className="flex-1 p-5">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
