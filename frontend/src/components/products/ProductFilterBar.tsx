import { useState } from "react";
import useBrands from "../../hooks/Brand/useBrands";
import useCategories from "../../hooks/Category/useCategories";

interface ProductFilterBarProps {
  onBrandChange: (brand_id: number | undefined) => void;
  onCategoryChange: (category_id: number | undefined) => void;
}

const ProductFilterBar = ({
  onBrandChange,
  onCategoryChange,
}: ProductFilterBarProps) => {
  const { data: brands, isFetching: brandsLoading } = useBrands();
  const { data: categories, isFetching: categoriesLoading } = useCategories();

  const [selectedBrand, setSelectedBrand] = useState<number | undefined>(
    undefined,
  );

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );

  const handleBrandChange = (brand_id: number | undefined) => {
    setSelectedBrand(brand_id);
    onBrandChange(brand_id);
  };

  const handleCategoryChange = (category_id: number | undefined) => {
    setSelectedCategory(category_id);
    onCategoryChange(category_id);
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-8 md:px-8">
      <div className="border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm">
        {/* Categories */}
        <div className="border-b border-[#F5BFC9] px-5 py-5 md:px-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#C93663]">
              Category
            </span>

            <div className="h-px flex-1 bg-[#F5BFC9]" />
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center py-3">
              <div className="size-5 animate-spin border-2 border-[#F5BFC9] border-t-[#C93663]" />
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {/* All Categories */}
              <button
                type="button"
                onClick={() => handleCategoryChange(undefined)}
                className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                  selectedCategory === undefined
                    ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]"
                    : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"
                }`}
              >
                All
              </button>

              {categories?.map((category) => (
                <button
                  key={category.category_id}
                  type="button"
                  onClick={() => handleCategoryChange(category.category_id)}
                  className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                    selectedCategory === category.category_id
                      ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]"
                      : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="px-5 py-5 md:px-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#C93663]">
              Brand
            </span>

            <div className="h-px flex-1 bg-[#F5BFC9]" />
          </div>

          {brandsLoading ? (
            <div className="flex justify-center py-3">
              <div className="size-5 animate-spin border-2 border-[#F5BFC9] border-t-[#C93663]" />
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {/* All Brands */}
              <button
                type="button"
                onClick={() => handleBrandChange(undefined)}
                className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                  selectedBrand === undefined
                    ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]"
                    : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"
                }`}
              >
                All
              </button>

              {brands?.map((brand) => (
                <button
                  key={brand.brand_id}
                  type="button"
                  onClick={() => handleBrandChange(brand.brand_id)}
                  className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                    selectedBrand === brand.brand_id
                      ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]"
                      : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductFilterBar;
