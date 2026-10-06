import { Link, useParams } from "react-router-dom";
import useProductsByCategoryId from "../../hooks/Product/useProductsByCategoryId";
const CategoryProducts = () => {
  const { category_id } = useParams<{ category_id: string }>();
  const categoryId = Number(category_id);
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useProductsByCategoryId(categoryId);
  if (!category_id || Number.isNaN(categoryId)) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <p className="text-center text-sm text-[#9B6476]">
          Invalid category ID.
        </p>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <p className="text-center text-sm text-[#9B6476]">
          Loading products...
        </p>
      </section>
    );
  }
  if (isError) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <p className="text-center text-sm text-red-500">{error.message}</p>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
      {/* Back */}
      <Link
        to="/products"
        className="mb-10 inline-block border border-[#E7A9B7] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
      >
        ← Back to Products
      </Link>
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
          Category Collection
        </p>
        <h1 className="font-serif text-3xl tracking-wide text-[#79163F] md:text-4xl">
          Products In This Category
        </h1>
        <p className="mt-3 text-sm text-[#9B6476]">
          Explore products from this beauty category.
        </p>
      </div>
      {/* No products */}
      {!products || products.length === 0 ? (
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
            We couldn't find any products in this category.
          </p>
        </div>
      ) : (
        <>
          {/* Products */}
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
                  <h2 className="line-clamp-1 font-serif text-lg text-[#79163F]">
                    {product.name}
                  </h2>
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
  );
};
export default CategoryProducts;
