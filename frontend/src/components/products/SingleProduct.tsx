import useProduct from "../../hooks/Product/useProduct";
import { Link } from "react-router-dom";

interface Props {
  id: number;
}

const SingleProduct = ({ id }: Props) => {
  const { data: product, isLoading, isError, error } = useProduct(id);

  if (isLoading) return <p>Loading product...</p>;

  if (isError) return <p>{error.message}</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <section className="mx-auto max-w-[1200px] px-5 py-14 md:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-xs tracking-wide text-[#9B6476]">
        <Link to="/" className="transition-colors hover:text-[#C93663]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#C93663]">Product</span>
      </div>

      {/* Product Container */}
      <div className="grid overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm md:grid-cols-2">
        {/* Product Image */}
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

        {/* Product Details */}
        <div className="flex flex-col justify-center px-7 py-10 md:px-12 md:py-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
            Discover
          </p>

          <h1 className="font-serif text-3xl leading-tight tracking-wide text-[#79163F] md:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-6 border-b border-[#F5BFC9] pb-6">
            <p className="font-serif text-2xl text-[#C93663]">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <div className="mt-7">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#79163F]">
              Product Description
            </h2>

            <p className="text-sm leading-8 text-[#9B6476]">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          {/* Product Details */}
          <div className="mt-8 space-y-4 border-t border-[#F5BFC9] pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9B6476]">Product ID</span>
              <span className="font-medium text-[#79163F]">
                #{product.product_id}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9B6476]">Category</span>
              <span className="font-medium text-[#79163F]">
                #{product.category_id}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9B6476]">Brand</span>
              <span className="font-medium text-[#79163F]">
                #{product.brand_id}
              </span>
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/products"
            className="mt-10 inline-block w-full border border-[#E7A9B7] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
