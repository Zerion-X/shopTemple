const BrandShowcaseSkeleton = () => (
  <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
    <div className="mb-10 text-center">
      <div className="mx-auto mb-3 h-3 w-20 animate-pulse bg-[#FCE1E5]" />
      <div className="mx-auto h-9 w-56 animate-pulse bg-[#FCE1E5]" />
    </div>

    <div className="flex flex-col overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] md:flex-row">
      <div className="aspect-[4/3] w-full animate-pulse bg-[#FCE1E5] md:aspect-auto md:h-[420px] md:w-1/2" />

      <div className="flex w-full flex-col items-center justify-center gap-5 px-8 py-10 md:w-1/2">
        <div className="h-3 w-28 animate-pulse bg-[#FCE1E5]" />
        <div className="h-10 w-48 animate-pulse bg-[#FCE1E5]" />
        <div className="h-3 w-3/4 animate-pulse bg-[#FFF0F2]" />
        <div className="h-10 w-32 animate-pulse bg-[#FCE1E5]" />
      </div>
    </div>
  </section>
);

export default BrandShowcaseSkeleton;
