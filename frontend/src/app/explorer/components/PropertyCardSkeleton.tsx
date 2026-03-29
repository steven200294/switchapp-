export default function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-gray-200 mb-3" />
      <div className="px-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
    </div>
  );
}
