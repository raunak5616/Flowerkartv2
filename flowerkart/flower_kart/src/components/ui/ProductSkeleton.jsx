export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-[430px] rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="animate-skeleton h-56 rounded-2xl bg-gray-100" />
          <div className="mt-5 space-y-3">
            <div className="animate-skeleton h-3 w-24 rounded-full bg-gray-100" />
            <div className="animate-skeleton h-5 w-3/4 rounded-full bg-gray-100" />
            <div className="animate-skeleton h-3 w-full rounded-full bg-gray-100" />
            <div className="animate-skeleton h-3 w-2/3 rounded-full bg-gray-100" />
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="animate-skeleton h-8 w-24 rounded-full bg-gray-100" />
            <div className="animate-skeleton h-11 w-11 rounded-2xl bg-gray-100" />
          </div>
        </div>
      ))}
    </>
  );
}
