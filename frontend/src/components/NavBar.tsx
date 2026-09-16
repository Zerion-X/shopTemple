import { useState } from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiShoppingCart } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";

import SearchInput from "./SearchInput";
import CategoriesBar from "./CategoriesBar";
import useUser from "../hooks/useUser";

const NavBar = () => {
  const { data: user, isFetching } = useUser();

  const isLoggedIn = !!user;

  // NEW LOGIC: controls whether the category menu is visible.
  const [showCategories, setShowCategories] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#FDEBED] text-[#79163F]"
      onMouseLeave={() => setShowCategories(false)}
    >
      {/* Main navbar */}
      <div className="mx-auto flex h-[76px] w-full max-w-[1600px] items-center px-5 md:px-8">
        {/* Mobile menu */}
        <button
          type="button"
          className="mr-4 rounded-full p-2 transition-colors hover:bg-[#FCE1E5] md:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={22} strokeWidth={1.7} />
        </button>

        {/* Shop */}
        <div className="hidden md:block">
          <button
            type="button"
            onMouseEnter={() => setShowCategories(true)}
            className="relative py-2 text-[13px] font-medium tracking-[0.18em] text-[#79163F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C93663] after:transition-all after:duration-300 hover:after:w-full"
          >
            SHOP
          </button>
        </div>

        {/* Brand */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.12em] text-[#79163F] md:text-3xl"
        >
          SHOPTEMPLE
        </Link>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1 md:gap-3">
          {/* Search */}
          <div className="hidden w-44 md:block lg:w-56">
            <SearchInput />
          </div>

          {/* User */}
          {isFetching ? (
            <div className="m-2 size-5 animate-spin rounded-full border-2 border-[#F5BFC9] border-t-[#C93663]" />
          ) : isLoggedIn ? (
            <Link
              to={`/${user.role === "admin" ? user.role : "profile"}`}
              aria-label="Profile"
              className="rounded-full p-2.5 text-[#79163F] transition-colors hover:bg-[#FCE1E5] hover:text-[#C93663]"
            >
              <CgProfile size={21} strokeWidth={0.5} />
            </Link>
          ) : (
            <Link
              to="/login"
              aria-label="Login"
              className="rounded-full p-2.5 text-[#79163F] transition-colors hover:bg-[#FCE1E5] hover:text-[#C93663]"
            >
              <CgProfile size={21} strokeWidth={0.5} />
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="rounded-full p-2.5 text-[#79163F] transition-colors hover:bg-[#FCE1E5] hover:text-[#C93663]"
          >
            <CiShoppingCart size={24} strokeWidth={1} />
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-[#F5BFC9] px-5 py-3 md:hidden">
        <SearchInput />
      </div>

      {/* Categories */}
      {showCategories && (
        <div onMouseEnter={() => setShowCategories(true)} className="w-full">
          <CategoriesBar />
        </div>
      )}
    </header>
  );
};

export default NavBar;
