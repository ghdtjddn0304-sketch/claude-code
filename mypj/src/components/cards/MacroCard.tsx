'use client'

import type { MacroItem } from '@/types'
import { formatMacroValue } from '@/lib/formatters'
import Sparkline from '@/components/charts/Sparkline'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorCard from '@/components/ui/ErrorCard'

interface MacroCardProps {
  item: MacroItem
  isLoading: boolean
}

export default function MacroCard({ item, isLoading }: MacroCardProps) {
  if (isLoading) return <LoadingSkeleton />
  if (item.error) return <ErrorCard name={item.name} />

  const sparkValues = item.sparkline.map((d) => d.value)
  const prev = sparkValues.at(-2) ?? item.value
  const isUp = item.value >= prev
  const color = isUp ? '#10e49e' : '#ff4d6d'

  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })
    : ''

  return (
    <div className="dc p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-medium text-[#6b83a8]">{item.name}</span>
        {dateStr && <span className="text-[10px] text-[#3a506e] font-mono">{dateStr}</span>}
      </div>
      <div className="num text-2xl font-bold text-[#c9d8f5] mb-0.5 leading-none">
        {formatMacroValue(item.value, item.unit)}
      </div>
      <div className="num text-[11px] mb-3" style={{ color }}>
        {isUp ? '▲' : '▼'} 전월 대비
      </div>
      <Sparkline data={sparkValues} color={color} height={40} />
    </div>
  )
}
