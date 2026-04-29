interface BadgeProps {
  value: number
  formatted: string
}

export default function Badge({ value, formatted }: BadgeProps) {
  const isPositive = value >= 0
  return (
    <span
      className={`text-xs font-medium px-1.5 py-0.5 rounded ${
        isPositive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {formatted}
    </span>
  )
}
