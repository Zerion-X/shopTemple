import useProduct from "../hooks/useProduct";

interface Props {
  id: number;
}

const ProductCard = ({ id }: Props) => {
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return ( 
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-sm">
        <h2>loading</h2>
        <div className="aspect-square animate-pulse bg-[#F8EFE5]" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-80 w-full max-w-sm items-center justify-center rounded-2xl bg-[#F8EFE5] text-[#8B5A3C]">
        Failed to load product.
      </div>
    );
  }
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-[#F8EFE5]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#8B5A3C]">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-lg font-semibold text-[#351522]">{product.name}</h2>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#8B5A3C]">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            type="button"
            className="rounded-full bg-[#351522] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5A2638]"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
