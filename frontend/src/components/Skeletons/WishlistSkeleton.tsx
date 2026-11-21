import ProductGridSkeleton from "./ProductGridSkeleton";

const WishlistSkeleton = () => (
  <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5]">
    <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
      <div className="mb-10 text-center animate-pulse">
        <div className="mx-auto mb-3 h-3 w-20 bg-[#FCE1E5]" />
        <div className="mx-auto h-9 w-64 bg-[#FCE1E5]" />
        <div className="mx-auto mt-4 h-3 w-48 bg-[#FFF0F2]" />
      </div>

      <ProductGridSkeleton count={8} />
    </section>
  </div>
);

export default WishlistSkeleton;
