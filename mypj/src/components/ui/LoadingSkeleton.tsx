export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-5 bg-gray-200 rounded w-14" />
      </div>
      <div className="h-7 bg-gray-200 rounded w-28 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
      <div className="h-10 bg-gray-100 rounded" />
    </div>
  )
}
