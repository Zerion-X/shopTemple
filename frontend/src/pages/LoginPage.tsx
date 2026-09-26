import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/Auth/useLogin";
import { useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5] px-5 py-12">
      <div className="mx-auto max-w-[500px]">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <h1 className="font-serif text-3xl tracking-[0.04em] text-[#79163F]">
            Welcome Back
          </h1>

          <p className="text-sm text-[#875565]">Log in to your account</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-[#F5BFC9] bg-[#FFFCFC] p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#79163F]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="john@example.com"
                  required
                  className="rounded-xl border border-[#DA70D6] bg-[#DA70D6]/10 px-4 py-3 text-sm text-[#79163F] placeholder:text-[#A85A9F] outline-none transition-all duration-300 focus:border-[#E96886] focus:bg-[#FFF4F5] focus:ring-2 focus:ring-[#F5BFC9]"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#79163F]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="current-password-disabled"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  required
                  className="rounded-xl border border-[#DA70D6] bg-[#DA70D6]/10 px-4 py-3 text-sm text-[#79163F] placeholder:text-[#A85A9F] outline-none transition-all duration-300 focus:border-[#E96886] focus:bg-[#FFF4F5] focus:ring-2 focus:ring-[#F5BFC9]"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-[#FCE1E5] px-3 py-2 text-sm text-[#C93663]">
                  {error.message || "Invalid email or password."}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="mt-1 rounded-xl bg-[#C93663] px-4 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#B91E5B] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-7 border-t border-[#F5E1E5]" />

          {/* Register */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-center text-sm text-[#875565]">
              Don't have an account?
            </p>

            <button
              type="button"
              className="text-sm font-medium text-[#C93663] transition-colors duration-200 hover:text-[#79163F]"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
