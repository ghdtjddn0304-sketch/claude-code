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
  const color = isPositive ? '#16a34a' : '#dc2626'
  const isKRW = data?.currency === 'KRW'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow relative group">
      <button
        onClick={() => onRemove(symbol)}
        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all text-xs"
        aria-label="제거"
      >
        ✕
      </button>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-7 bg-gray-200 rounded w-28" />
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
      ) : data?.error ? (
        <div className="flex flex-col justify-center items-center min-h-[100px]">
          <span className="text-xs text-gray-400 mb-1">{symbol}</span>
          <span className="text-sm text-gray-400">데이터 로드 실패</span>
        </div>
      ) : data ? (
        <>
          <div className="flex justify-between items-start mb-1 pr-4">
            <div>
              <div className="text-xs font-medium text-blue-600">{data.symbol}</div>
              <div className="text-xs text-gray-500 truncate max-w-[140px]">{data.name}</div>
            </div>
            <Badge value={data.changePercent} formatted={formatPercent(data.changePercent)} />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-0.5">
            {isKRW ? formatKRW(data.price) : formatPrice(data.price)}
            {data.currency && (
              <span className="text-sm font-normal text-gray-400 ml-1">{data.currency}</span>
            )}
          </div>
          <div className={`text-xs mb-2 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? '▲' : '▼'} {isKRW ? formatKRW(Math.abs(data.change)) : formatChange(data.change)}
          </div>
          <Sparkline data={data.sparkline} color={color} height={40} />
        </>
      ) : null}
    </div>
  )
}
