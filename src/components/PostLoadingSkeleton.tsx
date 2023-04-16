export const PostLoadingSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-slate-500 p-4"
        >
          <div className="h-14 w-14 animate-pulse rounded-full bg-slate-500" />
          <div className="flex flex-col gap-y-1.5">
            <div className="flex gap-1 font-semibold text-slate-300">
              <span className="h-4 w-20 animate-pulse bg-slate-500" />
              <span className="h-4 w-20 animate-pulse bg-slate-500" />
            </div>
            <span
              style={{
                width: Math.floor(Math.random() * 100) + 100 + "%",
              }}
              className="h-6 animate-pulse bg-slate-500"
            />
          </div>
        </div>
      ))}
    </>
  );
};
