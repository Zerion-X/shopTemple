const CardSkeleton = () => (
  <div className="animate-pulse border border-[#F5BFC9] bg-[#FFFCFC]">
    <div className="aspect-[4/5] bg-[#FCE1E5]" />
    <div className="space-y-3 px-4 py-4">
      <div className="mx-auto h-4 w-3/4 bg-[#FCE1E5]" />
      <div className="mx-auto h-3 w-1/3 bg-[#FFF0F2]" />
    </div>
  </div>
);

export default CardSkeleton;
