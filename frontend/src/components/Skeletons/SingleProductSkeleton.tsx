const SingleProductSkeleton = () => (
  <section className="mx-auto max-w-[1200px] px-5 py-14 md:px-8 animate-pulse">
    {/* Breadcrumbs */}
    <div className="mb-8 flex items-center gap-3">
      <div className="h-3 w-12 bg-[#FCE1E5]" />
      <div className="h-3 w-2 bg-[#F5BFC9]" />
      <div className="h-3 w-16 bg-[#FCE1E5]" />
      <div className="h-3 w-2 bg-[#F5BFC9]" />
      <div className="h-3 w-28 bg-[#FCE1E5]" />
    </div>

    <div className="grid overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm md:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#FCE1E5] md:aspect-auto md:min-h-[550px]">
        <div className="absolute left-5 top-5 h-8 w-32 bg-[#F5BFC9]" />
      </div>

      {/* Product Information */}
      <div className="flex flex-col justify-center px-7 py-10 md:px-12 md:py-14">
        <div className="mb-5 h-3 w-20 bg-[#FCE1E5]" />

        <div className="h-10 w-3/4 bg-[#FCE1E5]" />

        {/* Price */}
        <div className="mt-6 border-b border-[#F5BFC9] pb-6">
          <div className="h-8 w-28 bg-[#FCE1E5]" />
        </div>

        {/* Description */}
        <div className="mt-7">
          <div className="mb-4 h-3 w-40 bg-[#FCE1E5]" />
          <div className="space-y-3">
            <div className="h-3 w-full bg-[#FFF0F2]" />
            <div className="h-3 w-full bg-[#FFF0F2]" />
            <div className="h-3 w-4/5 bg-[#FFF0F2]" />
            <div className="h-3 w-2/3 bg-[#FFF0F2]" />
          </div>
        </div>

        {/* Category and Brand */}
        <div className="mt-8 space-y-5 border-t border-[#F5BFC9] pt-6">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="h-3 w-16 bg-[#FFF0F2]" />
              <div className="h-3 w-24 bg-[#FCE1E5]" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-10 h-11 w-full bg-[#FCE1E5]" />
        <div className="mt-4 h-11 w-full bg-[#FFF0F2]" />
      </div>
    </div>
  </section>
);

export default SingleProductSkeleton;
