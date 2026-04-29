interface SectionHeaderProps {
  title: string
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {title}
    </h2>
  )
}
