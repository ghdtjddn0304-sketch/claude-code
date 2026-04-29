interface ErrorCardProps {
  name: string
}

export default function ErrorCard({ name }: ErrorCardProps) {
  return (
    <div className="dc p-4 flex flex-col justify-center items-center min-h-[120px]">
      <span className="text-xs text-[#3a506e] mb-1">{name}</span>
      <span className="text-sm text-[#3a506e]">데이터 로드 실패</span>
    </div>
  )
}
