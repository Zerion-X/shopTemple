import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import type Product from "../../Entities/Product";
import useInView from "../../hooks/Home/useInView";
import HomeProductCard from "./HomeProductCard";
import CardSkeleton from "../Skeletons/CardSkeleton";

interface Props {
  eyebrow: string;
  title: string;
  moreLink?: string;
  queryKey: QueryKey;
  queryFn: () => Promise<Product[]>;
  rows?: 1 | 2;
  badge?: string;
}

const arrowClass =
  "flex size-10 items-center justify-center border border-[#E7A9B7] text-lg text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E7A9B7] disabled:hover:bg-transparent";

const CarouselSection = ({
  eyebrow,
  title,
  moreLink,
  queryKey,
  queryFn,
  rows = 1,
  badge,
}: Props) => {
  const { ref, inView } = useInView();
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey,
    queryFn,
    enabled: inView,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const updateEdge = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setEdge((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, []);

  useEffect(() => {
    updateEdge();
  }, [data, updateEdge]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Loaded but nothing to show: hide the whole section
  if (inView && !isLoading && !isError && data?.length === 0) return null;

  const showSkeleton = !inView || isLoading;

  return (
    <section ref={ref} className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
      <div className="reveal mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl tracking-wide text-[#79163F] md:text-4xl">
            {title}
          </h2>
          {moreLink && (
            <Link
              to={moreLink}
              className="mt-3 inline-block text-xs tracking-widest text-[#9B6476] underline underline-offset-4 transition hover:text-[#C93663]"
            >
              VIEW ALL
            </Link>
          )}
        </div>

        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={edge.start}
            aria-label={`Scroll ${title} left`}
            className={arrowClass}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={edge.end}
            aria-label={`Scroll ${title} right`}
            className={arrowClass}
          >
            ›
          </button>
        </div>
      </div>

      {isError ? (
        <p className="text-center text-sm text-[#9B6476]">
          Couldn't load this section.
        </p>
      ) : (
        <div
          ref={scrollerRef}
          onScroll={updateEdge}
          role="region"
          aria-label={title}
          className={`[scrollbar-width:none] [&::-webkit-scrollbar]:hidden grid snap-x snap-mandatory auto-cols-[46%] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain scroll-smooth py-3 sm:auto-cols-[31%] lg:auto-cols-[23%] lg:gap-5 xl:auto-cols-[19%] ${
            rows === 2 ? "grid-rows-2" : "grid-rows-1"
          }`}
        >
          {showSkeleton
            ? Array.from({ length: rows * 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            : data?.map((product) => (
                <HomeProductCard
                  key={product.product_id}
                  product={product}
                  badge={badge}
                />
              ))}
        </div>
      )}
    </section>
  );
};

export default CarouselSection;
