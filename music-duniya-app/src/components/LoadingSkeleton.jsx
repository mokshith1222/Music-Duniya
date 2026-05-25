export default function LoadingSkeleton({ type = 'music', count = 8 }) {
  if (type === 'artist') {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="skeleton size-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-3/4 rounded-full" />
              <div className="skeleton h-3 w-1/2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default for 'music' and 'album'
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="skeleton aspect-square w-full rounded-[2rem]" />
          <div className="px-2">
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton mt-2 h-3 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
