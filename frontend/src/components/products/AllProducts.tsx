import { useState } from "react";
import { Link } from "react-router-dom";
import useBrands from "../../hooks/Brand/useBrands";
import useCategories from "../../hooks/Category/useCategories";
import useFilteredProducts from "../../hooks/Product/useFilteredProducts";
const AllProducts = () => {
  const [brand_id, setBrandId] = useState<number | undefined>(undefined);
  const [category_id, setCategoryId] = useState<number | undefined>(undefined);
  const { data: brands, isFetching: brandsLoading } = useBrands();
  const { data: categories, isFetching: categoriesLoading } = useCategories();
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useFilteredProducts({ brand_id, category_id });
  const clearFilters = () => {
    setBrandId(undefined);
    setCategoryId(undefined);
  };
  return (
    <>
      {/* Filters */}
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
                <button
                  type="button"
                  onClick={() => setCategoryId(undefined)}
                  className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${category_id === undefined ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]" : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"}`}
                >
                  All
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.category_id}
                    type="button"
                    onClick={() => setCategoryId(category.category_id)}
                    className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${category_id === category.category_id ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]" : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"}`}
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
                <button
                  type="button"
                  onClick={() => setBrandId(undefined)}
                  className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${brand_id === undefined ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]" : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"}`}
                >
                  All
                </button>
                {brands?.map((brand) => (
                  <button
                    key={brand.brand_id}
                    type="button"
                    onClick={() => setBrandId(brand.brand_id)}
                    className={`shrink-0 border px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300 ${brand_id === brand.brand_id ? "border-[#C93663] bg-[#FCE1E5] text-[#79163F]" : "border-[#E7A9B7] text-[#9B6476] hover:border-[#C93663] hover:bg-[#FFF4F5]"}`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Products */}
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        {isLoading && (
          <p className="text-center text-sm text-[#9B6476]">
            Loading products...
          </p>
        )}
        {isError && (
          <p className="text-center text-sm text-red-500"> {error.message} </p>
        )}
        {!isLoading && !isError && (!products || products.length === 0) && (
          <div className="border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[#F5BFC9] bg-[#FFF4F5]">
              <span className="font-serif text-2xl text-[#C93663]">✦</span>
            </div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
              Nothing Here Yet
            </p>
            <h2 className="font-serif text-3xl tracking-wide text-[#79163F]">
              No Products Found
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#9B6476]">
              We couldn't find any products matching your current selection. Try
              exploring another category or brand.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-7 border border-[#E7A9B7] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
            >
              Clear Filters
            </button>
          </div>
        )}
        {!isLoading && !isError && products && products.length > 0 && (
          <>
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
                Our Collection
              </p>
              <h2 className="font-serif text-3xl tracking-wide text-[#79163F] md:text-4xl">
                Discover Our Products
              </h2>
              <p className="mt-3 text-sm text-[#9B6476]">
                Explore our carefully selected beauty essentials.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="group overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    to={`/products/${product.product_id}`}
                    className="relative block aspect-[4/5] overflow-hidden bg-[#FFF4F5]"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center font-serif text-6xl text-[#E7A9B7]">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute left-3 top-3 border border-[#F5BFC9] bg-[#FFFCFC]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C93663]">
                      Beauty
                    </span>
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#79163F]/90 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-white transition-transform duration-300 group-hover:translate-y-0">
                      View Product
                    </div>
                  </Link>
                  <div className="flex flex-col items-center px-4 py-5 text-center">
                    <h3 className="line-clamp-1 font-serif text-lg text-[#79163F]">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-relaxed text-[#9B6476]">
                      {product.description || "Discover this beauty essential."}
                    </p>
                    <p className="mt-4 font-medium tracking-wide text-[#C93663]">
                      ${Number(product.price).toFixed(2)}
                    </p>
                    <Link
                      to={`/products/${product.product_id}`}
                      className="mt-4 inline-block border border-[#E7A9B7] px-6 py-2 text-xs font-medium uppercase tracking-[0.15em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
};
export default AllProducts;
