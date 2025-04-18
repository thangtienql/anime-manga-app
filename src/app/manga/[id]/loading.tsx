export default function Loading() {
  return (
    <div className="w-full">
      {/* Top loading bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-blue-100 dark:bg-blue-900/30 overflow-hidden z-50">
        <div className="absolute h-full w-1/3 bg-gradient-to-r from-blue-400 to-blue-600 animate-loading-bar"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image skeleton with shimmer effect */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <div className="relative aspect-[2/3] w-full rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]"></div>
          <div className="mt-4 h-10 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]"></div>
        </div>
        
        {/* Details skeleton with shimmer */}
        <div className="flex-1">
          <div className="h-8 w-3/4 mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded"></div>
          <div className="h-6 w-1/2 mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded"></div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
            <div className="h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded-md delay-75"></div>
            <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded-md delay-150"></div>
          </div>
          
          <div className="mb-8">
            <div className="h-6 w-1/4 mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded"></div>
            <div className="h-4 w-full mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded"></div>
            <div className="h-4 w-full mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded delay-75"></div>
            <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded delay-150"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="h-6 w-1/4 mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded-full"></div>
                <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded-full delay-75"></div>
                <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded-full delay-150"></div>
              </div>
            </div>
            <div>
              <div className="h-6 w-1/4 mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded"></div>
              <div className="h-4 w-full mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded"></div>
              <div className="h-4 w-full mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded delay-75"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 