import { Link } from "react-router-dom";
import useUser from "../../hooks/Auth/useUser";

const PromoBanner = () => {
  const { data: user } = useUser();

  if (user) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
      <div className="reveal relative isolate flex min-h-[260px] flex-col items-center justify-center gap-6 overflow-hidden bg-[#79163F] px-8 py-12 text-center md:flex-row md:justify-between md:px-14 md:text-left">
        <img
          src="/pic3.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover object-center"
        />

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#FCE1E5] drop-shadow-md">
            Join ShopTemple
          </p>
          <h2 className="font-serif text-2xl tracking-wide text-white drop-shadow-md md:text-3xl">
            Save your favorites and track every order
          </h2>
        </div>

        <Link
          to="/register"
          className="shrink-0 bg-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#79163F] transition-all duration-300 hover:bg-[#FCE1E5]"
        >
          Create account
        </Link>
      </div>
    </section>
  );
};

export default PromoBanner;
