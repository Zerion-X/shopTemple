import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useBrands from "../hooks/useBrands";

const AUTO_ADVANCE_MS = 4000;

const BrandsShowcase = () => {
  const { data: brands, isFetching, isError } = useBrands();
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (brands ? (prev + 1) % brands.length : 0));
  }, [brands]);

  const goToPrev = () => {
    setActiveIndex((prev) =>
      brands ? (prev - 1 + brands.length) % brands.length : 0,
    );
  };

  useEffect(() => {
    if (!brands || brands.length <= 1) return;

    const timer = setInterval(goToNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [brands, goToNext]);

  if (isFetching) {
    return (
      <div className="flex justify-center py-16">
        <div className="size-8 animate-spin border-2 border-[#F5BFC9] border-t-[#C93663]" />
      </div>
    );
  }

  if (isError || !brands?.length) return null;

  const activeBrand = brands[activeIndex];

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
          Discover
        </p>
        <h2 className="font-serif text-3xl tracking-wide text-[#79163F] md:text-4xl">
          Shop by Brand
        </h2>
      </div>

      <div className="relative overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm">
        <Link
          to={`/brands/${activeBrand.brand_id}`}
          className="group flex flex-col md:flex-row md:items-center"
        >
          {/* Image */}
          <div className="aspect-[4/3] w-full overflow-hidden bg-[#FFF4F5] md:aspect-auto md:h-[420px] md:w-1/2">
            {activeBrand.image_url ? (
              <img
                key={activeBrand.brand_id}
                src={activeBrand.image_url}
                alt={activeBrand.name}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center font-serif text-5xl text-[#E7A9B7]">
                {activeBrand.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex w-full flex-col items-center gap-4 px-8 py-10 text-center md:w-1/2 md:items-start md:px-14 md:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
              Featured Brand
            </p>
            <h3 className="font-serif text-3xl text-[#79163F] md:text-4xl">
              {activeBrand.name}
            </h3>
            <span className="mt-2 inline-block border border-[#E7A9B7] px-6 py-2.5 text-sm font-medium text-[#C93663] transition-all duration-300 group-hover:border-[#C93663] group-hover:bg-[#FCE1E5]">
              Shop Now
            </span>
          </div>
        </Link>

        {/* Arrows */}
        {brands.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous brand"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#FFFCFC]/90 p-2.5 text-[#79163F] shadow-sm transition-colors hover:bg-[#FCE1E5]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next brand"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#FFFCFC]/90 p-2.5 text-[#79163F] shadow-sm transition-colors hover:bg-[#FCE1E5]"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {brands.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {brands.map((brand, i) => (
            <button
              key={brand.brand_id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to ${brand.name}`}
              className={`h-2 transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-[#C93663]"
                  : "w-2 bg-[#F5BFC9] hover:bg-[#E7A9B7]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BrandsShowcase;
