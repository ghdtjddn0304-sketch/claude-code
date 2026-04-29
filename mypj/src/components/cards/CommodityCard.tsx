'use client'

import type { MarketItem } from '@/types'
import { formatPrice, formatPercent, formatChange, formatKRW } from '@/lib/formatters'
import Sparkline from '@/components/charts/Sparkline'
import Badge from '@/components/ui/Badge'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorCard from '@/components/ui/ErrorCard'

interface CommodityCardProps {
  item: MarketItem
  isLoading: boolean
}

export default function CommodityCard({ item, isLoading }: CommodityCardProps) {
  if (isLoading) return <LoadingSkeleton />
  if (item.error) return <ErrorCard name={item.name} />

  const isPositive = item.change >= 0
  const color = isPositive ? '#16a34a' : '#dc2626'
  const isKRW = item.currency === 'KRW'
  const priceStr = isKRW
    ? formatKRW(item.price)
    : formatPrice(item.price)

  const unitLabel = item.symbol === 'GC=F'
    ? 'USD/oz'
    : item.symbol === 'CL=F'
    ? 'USD/bbl'
    : item.currency || ''

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-medium text-gray-500">{item.name}</span>
        <Badge value={item.changePercent} formatted={formatPercent(item.changePercent)} />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">
        {priceStr}
        {unitLabel && <span className="text-sm font-normal text-gray-400 ml-1">{unitLabel}</span>}
      </div>
      <div className={`text-xs mb-2 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
        {isPositive ? '▲' : '▼'} {isKRW ? formatKRW(Math.abs(item.change)) : formatChange(item.change)}
      </div>
      <Sparkline data={item.sparkline} color={color} height={40} />
    </div>
  )
}
