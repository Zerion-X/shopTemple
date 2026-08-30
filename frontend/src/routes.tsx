import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./pages/MainLayout";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import WishlistPage from "./pages/WhishlistPage";
import OrdersPage from "./pages/OrdersPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "orders", element: <OrdersPage /> },
    ],
  },
]);

export default router;
