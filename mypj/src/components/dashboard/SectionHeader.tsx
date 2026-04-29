interface SectionHeaderProps {
  title: string
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-[3px] h-3.5 bg-[#4facfe] rounded-full opacity-70" />
      <h2
        className="text-[11px] font-semibold text-[#6b83a8] uppercase tracking-[0.16em]"
        style={{ fontFamily: 'var(--font-syne)' }}
      >
        {title}
      </h2>
    </div>
  )
}
