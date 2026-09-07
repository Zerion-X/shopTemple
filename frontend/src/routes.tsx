import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./pages/MainLayout";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import WishlistPage from "./pages/WhishlistPage";
import OrdersPage from "./pages/OrdersPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import UserManagementPage from "./pages/userManagementPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import AdminLayout from "./pages/AdminLayout";
import OrderManagementPage from "./pages/OrderManagementPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <CustomerPage /> },
          { path: "cart", element: <CartPage /> },
          { path: "wishlist", element: <WishlistPage /> },
          { path: "orders", element: <OrdersPage /> },
        ],
      },
    ],
  },
  {
    path: "admin/",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <AdminPage /> },
          { path: "users", element: <UserManagementPage /> },
          { path: "categories", element: <CategoryManagementPage /> },
          { path: "products", element: <ProductManagementPage /> },
          { path: "orders", element: <OrderManagementPage /> },
        ],
      },
    ],
  },
]);

export default router;
