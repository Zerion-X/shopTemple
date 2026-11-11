
import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import useUserQueryStore from "../store";
import useProducts from "../hooks/Product/useProducts";

const SearchInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);

  const setSearchText = useUserQueryStore(
    (s) => s.setSearchText
  );

  const searchText = useUserQueryStore(
    (s) => s.userQuery.searchText
  );

  const navigate = useNavigate();

  const { data: products, isLoading } = useProducts();

  // Filter products as the user types
  const suggestions = products
    ?.filter((product) => {
      const query = inputValue.trim().toLowerCase();

      return (
        query.length > 0 &&
        (product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query))
      );
    })
    .slice(0, 5) ?? [];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keep input synchronized with committed search
  useEffect(() => {
    setInputValue(searchText ?? "");
  }, [searchText]);

  // Select a product suggestion
  const handleSelectProduct = (productId: number) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    setSearchText("");
    setInputValue("");

    navigate(`/products/${productId}`);
  };

  // Submit a regular search
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = inputValue.trim();

    if (!query) {
      setSearchText("");
      setIsOpen(false);
      return;
    }

    setSearchText(query);
    setIsOpen(false);
    setSelectedIndex(-1);

    navigate("/");
  };

  // Keyboard navigation
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      setSelectedIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1
      );
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }

    if (
      event.key === "Enter" &&
      isOpen &&
      selectedIndex >= 0 &&
      suggestions[selectedIndex]
    ) {
      event.preventDefault();

      handleSelectProduct(
        suggestions[selectedIndex].product_id
      );
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1">
      <form onSubmit={handleSubmit}>
        <div className="relative w-full">
          <BsSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C93663]"
            size={15}
          />

          <input
            type="text"
            value={inputValue}
            placeholder="Search makeups..."
            autoComplete="off"
            onChange={(event) => {
              setInputValue(event.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (inputValue.trim()) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            className="w-full rounded-full border border-[#DA70D6] bg-[#DA70D6]/10 py-2 pl-10 pr-4 text-sm text-[#79163F] placeholder:text-[#A85A9F] outline-none transition-all duration-300 focus:border-[#E96886] focus:bg-[#FFF4F5] focus:ring-2 focus:ring-[#F5BFC9]"
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && inputValue.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#F5BFC9] bg-[#FFFCFC] shadow-xl">

          {isLoading ? (
            <p className="px-4 py-4 text-center text-sm text-[#9B6476]">
              Loading products...
            </p>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((product, index) => (
                <button
                  key={product.product_id}
                  type="button"
                  onClick={() =>
                    handleSelectProduct(product.product_id)
                  }
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    selectedIndex === index
                      ? "bg-[#FFF0F3]"
                      : "hover:bg-[#FFF4F5]"
                  }`}
                >
                  {/* Product image */}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="size-11 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex size-11 items-center justify-center rounded-md bg-[#FFF0F3] font-serif text-lg text-[#C93663]">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Product details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#79163F]">
                      {product.name}
                    </p>

                    <p className="text-xs text-[#9B6476]">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>

                  <BsSearch
                    size={12}
                    className="shrink-0 text-[#C93663]/60"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 py-4 text-center text-sm text-[#9B6476]">
              No matching products found.
            </p>
          )}

          {/* Search all results */}
          {!isLoading && (
            <button
              type="button"
              onClick={() => {
                setSearchText(inputValue.trim());
                setIsOpen(false);
                navigate("/");
              }}
              className="w-full border-t border-[#F5BFC9] px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-[#C93663] transition-colors hover:bg-[#FFF0F3]"
            >
              Search for "{inputValue.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
