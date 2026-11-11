import useCategoryId from "../../hooks/Category/useCategory";
import useBrandId from "../../hooks/Brand/useBrand";
import useProduct from "../../hooks/Product/useProduct";
import { Link } from "react-router-dom";

interface Props {
  id: number;
}

const SingleProduct = ({ id }: Props) => {
  const { data: product, isLoading, isError, error } = useProduct(id);

  const {
    data: category,
    isLoading: isLoadingCat,
    isError: isErrorCat,
  } = useCategoryId(product?.category_id ?? "");

  const {
    data: brand,
    isLoading: isLoadingBrand,
    isError: isErrorBrand,
  } = useBrandId(product?.brand_id ?? "");

  if (isLoading) return <p>Loading product...</p>;

  if (isError) return <p>{error.message}</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <section className="mx-auto max-w-[1200px] px-5 py-14 md:px-8">
      <div className="mb-8 flex items-center gap-2 text-xs tracking-wide text-[#9B6476]">
        <Link to="/" className="transition-colors hover:text-[#C93663]">
          Home
        </Link>

        <span>/</span>

        <Link to="/products" className="transition-colors hover:text-[#C93663]">
          Products
        </Link>

        <span>/</span>

        <span className="text-[#C93663]">{product.name}</span>
      </div>

      <div className="grid overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#FFF4F5] md:aspect-auto md:min-h-[550px]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="size-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-serif text-8xl text-[#E7A9B7]">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="absolute left-5 top-5 border border-[#F5BFC9] bg-[#FFFCFC]/90 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C93663]">
            Beauty Essential
          </span>
        </div>

        <div className="flex flex-col justify-center px-7 py-10 md:px-12 md:py-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
            Discover
          </p>

          <h1 className="font-serif text-3xl leading-tight tracking-wide text-[#79163F] md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6 border-b border-[#F5BFC9] pb-6">
            <p className="font-serif text-2xl text-[#C93663]">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <div className="mt-7">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#79163F]">
              Product Description
            </h2>

            <p className="text-sm leading-8 text-[#9B6476]">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          <div className="mt-8 space-y-4 border-t border-[#F5BFC9] pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9B6476]">Product ID</span>

              <span className="font-medium text-[#79163F]">
                #{product.product_id}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9B6476]">Category</span>

              {isLoadingCat ? (
                <span className="text-[#9B6476]">Loading...</span>
              ) : isErrorCat || !category ? (
                <span className="text-[#9B6476]">Unavailable</span>
              ) : (
                <Link
                  to={`/products/category/${product.category_id}`}
                  className="font-medium text-[#C93663] underline-offset-4 transition-colors hover:text-[#79163F] hover:underline"
                >
                  {category[0].name}
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9B6476]">Brand</span>

              {isLoadingBrand ? (
                <span className="text-[#9B6476]">Loading...</span>
              ) : isErrorBrand || !brand ? (
                <span className="text-[#9B6476]">Unavailable</span>
              ) : (
                <Link
                  to={`/products/brand/${product.brand_id}`}
                  className="font-medium text-[#C93663] underline-offset-4 transition-colors hover:text-[#79163F] hover:underline"
                >
                  {brand[0].name}
                </Link>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="mt-10 w-full bg-[#C93663] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#FFFCFC] transition-all duration-300 hover:bg-[#79163F]"
          >
            Add to Cart
          </button>

          <Link
            to="/products"
            className="mt-4 inline-block w-full border border-[#E7A9B7] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
