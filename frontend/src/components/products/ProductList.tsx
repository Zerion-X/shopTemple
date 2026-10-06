import useFilteredProducts from "../../hooks/Product/useFilteredProducts";
import { Link } from "react-router-dom";

interface Props {
  brand_id?: number;
  category_id?: number;
  onClearFilters?: () => void;
}

const ProductList = ({ brand_id, category_id, onClearFilters }: Props) => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useFilteredProducts({
    brand_id,
    category_id,
  });

  if (isLoading) return <p>Loading products...</p>;

  if (isError) return <p>{error.message}</p>;

  if (!products || products.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <div className="border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
          {/* Decorative Icon */}
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[#F5BFC9] bg-[#FFF4F5]">
            <span className="font-serif text-2xl text-[#C93663]">✦</span>
          </div>

          {/* Heading */}
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
            Nothing Here Yet
          </p>

          <h2 className="font-serif text-3xl tracking-wide text-[#79163F]">
            No Products Found
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#9B6476]">
            We couldn't find any products matching your current selection. Try
            exploring another category or brand.
          </p>

          {/* Clear Filters */}
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-7 border border-[#E7A9B7] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
      {/* Heading */}
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="group overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image */}
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

              {/* Product Label */}
              <span className="absolute left-3 top-3 border border-[#F5BFC9] bg-[#FFFCFC]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C93663]">
                Beauty
              </span>

              {/* View Product Overlay */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#79163F]/90 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-white transition-transform duration-300 group-hover:translate-y-0">
                View Product
              </div>
            </Link>

            {/* Product Information */}
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
    </section>
  );
};

export default ProductList;
