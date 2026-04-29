'use client'

import { useQuery } from '@tanstack/react-query'
import type { MarketItem } from '@/types'
import { formatPrice, formatPercent, formatChange, formatKRW } from '@/lib/formatters'
import Sparkline from '@/components/charts/Sparkline'
import Badge from '@/components/ui/Badge'

interface SearchedStockCardProps {
  symbol: string
  onRemove: (symbol: string) => void
}

export default function SearchedStockCard({ symbol, onRemove }: SearchedStockCardProps) {
  const { data, isLoading } = useQuery<MarketItem>({
    queryKey: ['stock', symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stock/${encodeURIComponent(symbol)}`)
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  })

  const isPositive = (data?.changePercent ?? 0) >= 0
  const color = isPositive ? '#10e49e' : '#ff4d6d'
  const isKRW = data?.currency === 'KRW'

  return (
    <div className="dc p-4 relative group">
      <button
        onClick={() => onRemove(symbol)}
        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full
          text-[#3a506e] hover:text-[#ff4d6d] hover:bg-[rgba(255,77,109,0.1)]
          opacity-0 group-hover:opacity-100 transition-all text-xs"
        aria-label="제거"
      >
        ✕
      </button>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-[#1a2840] rounded w-20" />
          <div className="h-7 bg-[#1a2840] rounded w-28" />
          <div className="h-3 bg-[#1a2840] rounded w-20" />
          <div className="h-10 bg-[#111e30] rounded" />
        </div>
      ) : data?.error ? (
        <div className="flex flex-col justify-center items-center min-h-[100px]">
          <span className="text-xs text-[#3a506e] mb-1">{symbol}</span>
          <span className="text-sm text-[#3a506e]">데이터 로드 실패</span>
        </div>
      ) : data ? (
        <>
          <div className="flex justify-between items-start mb-2 pr-4">
            <div>
              <div className="num text-xs font-medium text-[#4facfe]">{data.symbol}</div>
              <div className="text-[11px] text-[#6b83a8] truncate max-w-[140px]">{data.name}</div>
            </div>
            <Badge value={data.changePercent} formatted={formatPercent(data.changePercent)} />
          </div>
          <div className="num text-2xl font-bold text-[#c9d8f5] mb-0.5 leading-none">
            {isKRW ? formatKRW(data.price) : formatPrice(data.price)}
            {data.currency && (
              <span className="num text-xs font-normal text-[#3a506e] ml-1.5">{data.currency}</span>
            )}
          </div>
          <div className="num text-[11px] mb-3" style={{ color }}>
            {isPositive ? '▲' : '▼'} {isKRW ? formatKRW(Math.abs(data.change)) : formatChange(data.change)}
          </div>
          <Sparkline data={data.sparkline} color={color} height={40} />
        </>
      ) : null}
    </div>
  )
}
