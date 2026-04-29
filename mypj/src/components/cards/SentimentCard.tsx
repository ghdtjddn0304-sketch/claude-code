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
  const { text, hex } = getSentimentColor(value)
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-[#3a506e]">{label}</span>
      <span className={`font-medium num ${text}`} style={{ color: hex }}>{value}</span>
    </div>
  )
}

export default function SentimentCard({ data, isLoading }: SentimentCardProps) {
  if (isLoading) return <LoadingSkeleton />
  if (data.error) return <ErrorCard name="Fear & Greed Index" />

  const { bg, label, hex } = getSentimentColor(data.score)
  const sparkData = data.historicalData.map((d) => d.y)

  return (
    <div className="dc p-4">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[11px] font-medium text-[#6b83a8]">Fear &amp; Greed Index</span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${bg}`} style={{ color: hex }}>
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="num text-4xl font-bold" style={{ color: hex }}>{data.score}</span>
        <span className="text-sm text-[#3a506e]">/ 100</span>
      </div>

      {/* Meter bar */}
      <div
        className="w-full h-1.5 rounded-full mb-4 relative"
        style={{ background: 'linear-gradient(to right, #ff4d6d, #ffd770, #10e49e)' }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{
            left: `calc(${data.score}% - 6px)`,
            background: '#c9d8f5',
            border: '2px solid #4facfe',
            boxShadow: '0 0 8px rgba(79,172,254,0.55)',
          }}
        />
      </div>

      <div className="space-y-1.5 mb-3">
        <CompareRow label="어제" value={data.previousClose} />
        <CompareRow label="1주일 전" value={data.oneWeekAgo} />
        <CompareRow label="1개월 전" value={data.oneMonthAgo} />
        <CompareRow label="1년 전" value={data.oneYearAgo} />
      </div>

      <Sparkline data={sparkData} color="#4facfe" height={40} />
    </div>
  )
}
