import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../services/authService";
import useUser from "../hooks/Auth/useUser";

const CustomerPage = () => {
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
    <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5] px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1100px]">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
            My Account
          </p>

          <h1 className="font-serif text-4xl tracking-wide text-[#79163F] md:text-5xl">
            Welcome, {user?.full_name?.split(" ")[0]}
          </h1>
        </div>

        {/* Main profile area */}
        <div className="grid gap-6 md:grid-cols-[0.85fr_1.5fr]">
          {/* Profile card */}
          <section className="flex flex-col items-center justify-center rounded-3xl border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-10 text-center shadow-sm">
            {/* Avatar */}
            <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-[#C93663] font-serif text-4xl text-white shadow-sm ring-8 ring-[#FCE1E5]">
              {user?.full_name?.charAt(0).toUpperCase() || "U"}
            </div>

            <h2 className="font-serif text-2xl text-[#79163F]">
              {user?.full_name}
            </h2>

            <p className="mt-2 text-sm text-[#A85A70]">ShopTemple customer</p>

            <div className="mt-8 h-px w-16 bg-[#F5BFC9]" />

            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[#B58A97]">
              Member
            </p>
          </section>

          {/* Account information */}
          <section className="rounded-3xl border border-[#F5BFC9] bg-[#FFFCFC] p-6 shadow-sm md:p-8">
            <div className="mb-7">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C93663]">
                Personal Information
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#79163F]">
                Account details
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Email */}
              <div className="rounded-2xl bg-[#FFF4F5] p-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#A85A70]">
                  Email
                </p>

                <p className="break-all text-sm text-[#79163F]">
                  {user?.email}
                </p>
              </div>

              {/* Address */}
              <div className="rounded-2xl bg-[#FFF4F5] p-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#A85A70]">
                  Address
                </p>

                <p className="text-sm text-[#79163F]">
                  123 Main St, Baku, Azerbaijan
                </p>
              </div>
            </div>

            {/* Account actions */}
            <div className="mt-8 border-t border-[#F5E1E5] pt-7">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#A85A70]">
                Your ShopTemple
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => navigate("/wishlist")}
                  className="group flex items-center justify-between rounded-2xl border border-[#F5BFC9] bg-[#FFFCFC] px-5 py-4 text-left transition-all duration-300 hover:border-[#E96886] hover:bg-[#FCE1E5]"
                >
                  <div>
                    <p className="font-medium text-[#79163F]">Wishlist</p>

                    <p className="mt-1 text-xs text-[#A85A70]">
                      View your saved items
                    </p>
                  </div>

                  <span className="text-xl text-[#C93663] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                {/* Orders */}
                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className="group flex items-center justify-between rounded-2xl border border-[#F5BFC9] bg-[#FFFCFC] px-5 py-4 text-left transition-all duration-300 hover:border-[#E96886] hover:bg-[#FCE1E5]"
                >
                  <div>
                    <p className="font-medium text-[#79163F]">Orders</p>

                    <p className="mt-1 text-xs text-[#A85A70]">
                      View your order history
                    </p>
                  </div>

                  <span className="text-xl text-[#C93663] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Logout */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#E7A9B7] px-6 py-2.5 text-sm font-medium text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
