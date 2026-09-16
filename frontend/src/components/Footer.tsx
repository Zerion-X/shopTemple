import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-[#efc1c9] bg-[#FFFCFC] px-5 py-7 text-[#875565]">
      <div className="flex flex-col items-center gap-5">
        {/* Navigation */}
        <nav className="flex gap-7 text-sm">
          <Link
            to="/"
            className="transition-colors duration-200 hover:text-[#C93663]"
          >
            Home
          </Link>

          <Link
            to="/profile"
            className="transition-colors duration-200 hover:text-[#C93663]"
          >
            Profile
          </Link>

          <Link
            to="/cart"
            className="transition-colors duration-200 hover:text-[#C93663]"
          >
            Cart
          </Link>
        </nav>

        {/* Socials */}
        <div className="flex gap-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition-colors duration-200 hover:text-[#C93663]"
          >
            <FaGithub size={18} />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="transition-colors duration-200 hover:text-[#C93663]"
          >
            <FaTwitter size={18} />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="transition-colors duration-200 hover:text-[#C93663]"
          >
            <FaInstagram size={18} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#B58A97]">
          © {new Date().getFullYear()} ShopTemple. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;