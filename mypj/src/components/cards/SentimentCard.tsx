'use client'

import type { SentimentData } from '@/types'
import { getSentimentColor } from '@/lib/formatters'
import Sparkline from '@/components/charts/Sparkline'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorCard from '@/components/ui/ErrorCard'

interface SentimentCardProps {
  data: SentimentData
  isLoading: boolean
}

function CompareRow({ label, value }: { label: string; value: number }) {
  const { text } = getSentimentColor(value)
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${text}`}>{value}</span>
    </div>
  )
}

export default function SentimentCard({ data, isLoading }: SentimentCardProps) {
  if (isLoading) return <LoadingSkeleton />
  if (data.error) return <ErrorCard name="Fear & Greed Index" />

  const { bg, text, label } = getSentimentColor(data.score)
  const sparkData = data.historicalData.map((d) => d.y)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-gray-500">Fear & Greed Index</span>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${bg} ${text}`}>
          {label}
        </span>
      </div>

      <div className="flex items-end gap-3 mb-2">
        <span className={`text-4xl font-bold ${text}`}>{data.score}</span>
        <span className="text-sm text-gray-400 mb-1">/ 100</span>
      </div>

      {/* Meter bar */}
      <div className="w-full h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 mb-3 relative">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-700 rounded-full shadow"
          style={{ left: `calc(${data.score}% - 6px)` }}
        />
      </div>

      <div className="space-y-1 mb-3">
        <CompareRow label="어제" value={data.previousClose} />
        <CompareRow label="1주일 전" value={data.oneWeekAgo} />
        <CompareRow label="1개월 전" value={data.oneMonthAgo} />
        <CompareRow label="1년 전" value={data.oneYearAgo} />
      </div>

      <Sparkline data={sparkData} color="#6366f1" height={40} />
    </div>
  )
}
