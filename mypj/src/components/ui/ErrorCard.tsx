interface ErrorCardProps {
  name: string
}

export default function ErrorCard({ name }: ErrorCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-center items-center min-h-[120px]">
      <span className="text-xs text-gray-400 mb-1">{name}</span>
      <span className="text-sm text-gray-400">데이터 로드 실패</span>
    </div>
  )
}
