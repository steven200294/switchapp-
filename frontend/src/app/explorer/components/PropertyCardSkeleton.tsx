export default function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-xl bg-gray-200 mb-3" />
      
      <div className="flex flex-col space-y-2 ">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mt-1" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}
