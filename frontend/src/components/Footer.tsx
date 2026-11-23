import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import useUser from "../hooks/Auth/useUser";

const linkClass =
  "text-sm text-white/70 transition-colors duration-200 hover:text-[#F5BFC9]";

const headingClass =
  "mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-white";

const SOCIALS = [
  { label: "TikTok", href: "https://tiktok.com", icon: <FaTiktok size={18} /> },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram size={18} />,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <FaFacebookF size={18} />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: <FaTwitter size={18} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: <FaYoutube size={18} />,
  },
];

const LEGAL = ["Privacy", "Terms of Use", "Refund Policy", "Accessibility"];

const Footer = () => {
  const { data: user } = useUser();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const accountPath = user?.role === "admin" ? "/admin" : "/profile";

  const customerService = [
    { label: "Order Status", to: "/orders" },
    { label: "Shipping Information", to: "#" },
    { label: "Returns", to: "#" },
    { label: "Contact Us", to: "#" },
    { label: "Help & FAQs", to: "#" },
    { label: "My Account", to: accountPath },
  ];

  const shop = [
    { label: "Home", to: "/" },
    { label: "All Products", to: "/products" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Cart", to: "/cart" },
  ];

  const about = [
    { label: "About Us", to: "#" },
    { label: "Careers", to: "#" },
  ];

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: send the email to your backend
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="mt-16 text-white">
      <div className="grid lg:grid-cols-[1fr_2fr]">
        {/* Left panel: newsletter + wordmark */}
        <div className="flex flex-col bg-[#4A0E27] px-6 py-12 lg:min-h-[640px] lg:px-12">
          <h2 className="text-xl font-semibold uppercase tracking-wide">
            Down for more? We got you!
          </h2>

          <p className="mt-4 text-sm leading-6 text-white/80">
            The latest product drops, offers and new arrivals, straight to your
            inbox.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mt-8 flex items-center border border-white/60 transition-colors focus-within:border-white"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className="w-full bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-white/70"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="px-5 text-xl text-white transition-colors hover:text-[#F5BFC9]"
            >
              →
            </button>
          </form>

          {subscribed && (
            <p className="mt-3 text-sm text-[#F5BFC9]">
              Thanks for subscribing!
            </p>
          )}

          <p className="mt-8 text-xs leading-5 text-white/60">
            By subscribing to ShopTemple you agree to receive occasional
            promotional emails about new products and offers. Consent is not a
            condition of any purchase. You can unsubscribe at any time.
          </p>

          <p className="mt-16 font-serif text-2xl uppercase tracking-[0.3em] xl:text-3xl lg:mt-auto">
            ShopTemple
          </p>
        </div>

        {/* Right panel: columns */}
        <div className="flex flex-col bg-[#3D0B20] px-6 py-12 lg:px-16">
          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
            {/* Customer service */}
            <div>
              <h3 className={headingClass}>Customer Service</h3>

              <p className="text-sm leading-6 text-white/70">
                Operating hours are 9am to 6pm, Monday to Friday. Reach out
                today!
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <a href="mailto:support@shoptemple.com" className={linkClass}>
                    support@shoptemple.com
                  </a>
                </li>
                <li>
                  <a href="tel:+994000000000" className={linkClass}>
                    +994 00 000 00 00
                  </a>
                </li>
                {customerService.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h3 className={headingClass}>Shop</h3>

              <ul className="space-y-4">
                {shop.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div className="sm:col-span-2 xl:col-span-1">
              <h3 className={headingClass}>About</h3>

              <p className="text-sm leading-6 text-white/70">
                ShopTemple was created to bring the beauty essentials people
                love into one place: skincare, makeup, haircare, fragrance and
                body care from brands we trust.
              </p>

              <ul className="mt-6 space-y-4">
                {about.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-12 flex gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="text-white/80 transition-colors duration-200 hover:text-[#F5BFC9]"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 lg:mt-auto">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {LEGAL.map((label) => (
                <Link key={label} to="#" className={linkClass}>
                  {label}
                </Link>
              ))}
            </div>

            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} ShopTemple. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
