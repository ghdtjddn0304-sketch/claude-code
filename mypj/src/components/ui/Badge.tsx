interface BadgeProps {
  value: number
  formatted: string
}

export default function Badge({ value, formatted }: BadgeProps) {
  const isPositive = value >= 0
  return (
    <span
      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md num ${
        isPositive
          ? 'bg-[rgba(16,228,158,0.1)] text-[#10e49e] ring-1 ring-[rgba(16,228,158,0.2)]'
          : 'bg-[rgba(255,77,109,0.1)] text-[#ff4d6d] ring-1 ring-[rgba(255,77,109,0.2)]'
      }`}
    >
      {formatted}
    </span>
  )
}
