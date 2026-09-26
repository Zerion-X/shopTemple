import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../services/authService";

const AdminPage = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();

      queryClient.setQueryData(["profile"], null);

      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="mx-auto max-w-[900px] p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-32 items-center justify-center overflow-hidden rounded-full bg-cyan-500 text-4xl font-semibold text-white">
            {user?.full_name?.charAt(0).toUpperCase() || "A"}
          </div>

          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <p className="text-gray-500">{user?.full_name}</p>
        </div>

        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

        <h2 className="text-xl font-semibold">Dashboard</h2>

        <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <p className="text-sm text-gray-500">Sales</p>
          <h3 className="text-2xl font-bold">$0</h3>
        </div>

        <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <p className="text-sm text-gray-500">Orders</p>
          <h3 className="text-2xl font-bold">0</h3>
        </div>

        <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <p className="text-sm text-gray-500">Customers</p>
          <h3 className="text-2xl font-bold">0</h3>
        </div>

        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="w-full rounded-md border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Product Management
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="w-full rounded-md border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Orders Management
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="w-full rounded-md border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Users Management
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="w-full rounded-md border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Categories Management
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/brands")}
          className="w-full rounded-md border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Brands Management
        </button>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="my-5 rounded-md border border-red-500 px-4 py-2 font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
      >
        Log out
      </button>
    </div>
  );
};

export default AdminPage;
