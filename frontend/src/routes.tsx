import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./pages/MainLayout";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import WishlistPage from "./pages/WhishlistPage";
import OrdersPage from "./pages/OrdersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "authentication", element: <AuthenticationPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "orders", element: <OrdersPage /> },
    ],
  },
]);

export default router;
