import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import useCategories from "../hooks/useCategories";

const CategoriesBar = () => {
  const { data: categories, isFetching, error } = useCategories();

  const containerRef = useRef<HTMLDivElement>(null);

  // NEW LOGIC: how many categories can actually fit.
  const [visibleCount, setVisibleCount] = useState(1);

  // NEW LOGIC: current page.
  const [currentPage, setCurrentPage] = useState(0);

  // NEW LOGIC: calculate based on the actual available width.
  useEffect(() => {
    if (!containerRef.current) return;

    const calculateVisibleCategories = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;

      /*
       * Space reserved for the two navigation arrows.
       * We also leave some breathing room around the categories.
       */
      const availableWidth = Math.max(0, width - 180);

      /*
       * Every category gets a predictable amount of space.
       */
      const categoryWidth = 150;

      const count = Math.max(1, Math.floor(availableWidth / categoryWidth));

      setVisibleCount(count);
    };

    calculateVisibleCategories();

    const observer = new ResizeObserver(calculateVisibleCategories);

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const totalPages = Math.ceil((categories?.length ?? 0) / visibleCount);

  // NEW LOGIC: prevent an invalid page after resizing.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const goNext = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages - 1));
  };

  const goPrevious = () => {
    setCurrentPage((page) => Math.max(page - 1, 0));
  };

  if (error) {
    return (
      <p className="w-full bg-[#FFF4F5] px-5 py-3 text-sm text-[#C93663]">
        {error.message}
      </p>
    );
  }

  if (isFetching) {
    return (
      <div className="flex h-[210px] w-full items-center justify-center border-t border-[#F5BFC9] bg-[#FFF4F5]">
        <div className="size-5 animate-spin rounded-full border-2 border-[#F5BFC9] border-t-[#C93663]" />
      </div>
    );
  }

  if (!categories?.length) {
    return null;
  }

  const startIndex = currentPage * visibleCount;

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + visibleCount,
  );

  return (
    <div className="w-full overflow-hidden border-t border-[#F5BFC9] bg-[#FFF4F5]">
      <div
        ref={containerRef}
        className="relative flex min-h-[210px] w-full items-center overflow-hidden px-16 py-8"
      >
        {/* Previous */}
        {currentPage > 0 && (
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous categories"
            className="absolute left-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#FCE1E5] p-3 text-[#79163F] shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-[#F5BFC9] hover:text-[#C93663] active:scale-95"
          >
            <FiChevronLeft size={22} />
          </button>
        )}

        {/* Category track */}
        <div
          key={currentPage}
          className="flex w-full items-center justify-center gap-6 animate-[fadeIn_300ms_ease-out] md:gap-8 lg:gap-10"
        >
          {visibleCategories.map((category) => (
            <button
              key={category.category_id}
              type="button"
              className="group flex w-[150px] shrink-0 flex-col items-center gap-4"
            >
              {/* Temporary image placeholder */}
              <div className="size-[92px] rounded-[42%] bg-[#C93663] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#E96886] md:size-[105px]" />

              {/* Category name */}
              <span className="whitespace-nowrap text-[15px] font-medium uppercase tracking-[0.14em] text-[#875565] transition-colors duration-200 group-hover:text-[#C93663] md:text-[16px]">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* Next */}
        {currentPage < totalPages - 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next categories"
            className="absolute right-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#FCE1E5] p-3 text-[#79163F] shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-[#F5BFC9] hover:text-[#C93663] active:scale-95"
          >
            <FiChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoriesBar;
