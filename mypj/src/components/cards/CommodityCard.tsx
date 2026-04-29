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
  const color = isPositive ? '#10e49e' : '#ff4d6d'
  const isKRW = item.currency === 'KRW'
  const priceStr = isKRW ? formatKRW(item.price) : formatPrice(item.price)

  const unitLabel = item.symbol === 'GC=F'
    ? 'USD/oz'
    : item.symbol === 'CL=F'
    ? 'USD/bbl'
    : item.currency || ''

  return (
    <div className="dc p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-medium text-[#6b83a8]">{item.name}</span>
        <Badge value={item.changePercent} formatted={formatPercent(item.changePercent)} />
      </div>
      <div className="num text-2xl font-bold text-[#c9d8f5] mb-0.5 leading-none">
        {priceStr}
        {unitLabel && <span className="num text-xs font-normal text-[#3a506e] ml-1.5">{unitLabel}</span>}
      </div>
      <div className="num text-[11px] mb-3" style={{ color }}>
        {isPositive ? '▲' : '▼'} {isKRW ? formatKRW(Math.abs(item.change)) : formatChange(item.change)}
      </div>
      <Sparkline data={item.sparkline} color={color} height={40} />
    </div>
  )
}
