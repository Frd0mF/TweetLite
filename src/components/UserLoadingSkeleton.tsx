export const UserLoadingSkeleton = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 animate-pulse rounded-full bg-slate-500" />
      <div className="flex flex-col gap-y-1">
        <span className="h-8 w-40 animate-pulse bg-slate-500" />
      </div>
    </div>
  );
};
