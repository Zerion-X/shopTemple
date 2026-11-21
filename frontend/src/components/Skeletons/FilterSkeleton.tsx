const FilterSkeleton = () => (
  <div className="flex gap-2 overflow-hidden pb-1">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="h-9 w-24 shrink-0 animate-pulse bg-[#FCE1E5]"
      />
    ))}
  </div>
);

export default FilterSkeleton;
