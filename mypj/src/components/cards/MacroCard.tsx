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
  const color = isUp ? '#16a34a' : '#dc2626'

  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })
    : ''

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-medium text-gray-500">{item.name}</span>
        {dateStr && <span className="text-xs text-gray-400">{dateStr}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">
        {formatMacroValue(item.value, item.unit)}
      </div>
      <div className={`text-xs mb-2 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
        {isUp ? '▲' : '▼'} 전월 대비
      </div>
      <Sparkline data={sparkValues} color={color} height={40} />
    </div>
  )
}
