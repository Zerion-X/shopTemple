import { Link } from "react-router-dom";

const Hero = () => (
  <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#FCE1E5] md:min-h-[640px]">
    {/* Full-cover background image */}
    <img
      src="/pic2.jpg"
      alt="ShopTemple collection"
      loading="eager"
      fetchPriority="high"
      className="hero-image absolute inset-0 -z-20 size-full object-cover object-center"
    />

    {/* Gradient so the text stays readable */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#79163F]/75 via-[#79163F]/40 to-transparent" />

    <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
      <div className="max-w-xl text-center md:text-left">
        <p className="hero-item mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#FCE1E5]">
          New Collection
        </p>

        <h1
          style={{ animationDelay: "100ms" }}
          className="hero-item font-serif text-4xl leading-tight tracking-wide text-white md:text-6xl"
        >
          Discover Your Glow
        </h1>

        <p
          style={{ animationDelay: "200ms" }}
          className="hero-item mx-auto mt-5 max-w-md text-sm leading-7 text-white/90 md:mx-0"
        >
          Beauty essentials picked for you, from everyday care to special
          occasions.
        </p>

        <div
          style={{ animationDelay: "300ms" }}
          className="hero-item mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
        >
          <Link
            to="/products"
            className="bg-[#C93663] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-[#79163F]"
          >
            Shop Now
          </Link>

          <Link
            to="/products"
            className="border border-white/80 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-[#79163F]"
          >
            Browse All
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
