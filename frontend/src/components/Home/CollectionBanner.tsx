import { Link } from "react-router-dom";

const CollectionBanner = () => (
  <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8">
    <div className="reveal relative isolate flex min-h-[320px] flex-col items-center justify-center overflow-hidden bg-[#FCE1E5] px-8 py-14 text-center">
      <img
        src="/pic1.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover object-center"
      />

      <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#FCE1E5] drop-shadow-md">
        Explore
      </p>

      <h2 className="font-serif text-3xl tracking-wide text-white drop-shadow-md md:text-4xl">
        The Full Collection
      </h2>

      <Link
        to="/products"
        className="mt-7 inline-block bg-white px-10 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-[#79163F] transition-all duration-300 hover:bg-[#FCE1E5]"
      >
        Browse the full collection
      </Link>
    </div>
  </section>
);

export default CollectionBanner;
