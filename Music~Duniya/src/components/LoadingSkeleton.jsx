export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass rounded-[1.5rem] p-3">
          <div className="skeleton aspect-[4/5] rounded-[1.25rem]" />
          <div className="skeleton mt-3 h-4 rounded-full" />
          <div className="skeleton mt-2 h-3 w-2/3 rounded-full" />
        </div>
      ))}
    </div>
  )
}
