interface Props {
  count?: number;
}

const ProductCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm">
    {/* Image */}
    <div className="aspect-[4/5] bg-[#FCE1E5]" />

    {/* Product Information */}
    <div className="flex flex-col items-center px-4 py-5">
      <div className="h-5 w-3/4 bg-[#FCE1E5]" />

      <div className="mt-4 w-full space-y-2">
        <div className="h-3 w-full bg-[#FFF0F2]" />
        <div className="h-3 w-2/3 bg-[#FFF0F2]" />
      </div>

      <div className="mt-5 h-4 w-20 bg-[#FCE1E5]" />

      <div className="mt-4 h-9 w-28 bg-[#FCE1E5]" />
    </div>
  </div>
);

const ProductGridSkeleton = ({ count = 8 }: Props) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export default ProductGridSkeleton;
