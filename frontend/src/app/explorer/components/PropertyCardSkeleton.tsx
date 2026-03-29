export default function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square rounded-xl bg-gray-200 mb-3" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col space-y-2">
        {/* Title / City */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        
        {/* Subtitle / Description */}
        <div className="h-4 bg-gray-200 rounded w-5/6 mt-1" />
        
        {/* Details */}
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        
        {/* Price */}
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}
