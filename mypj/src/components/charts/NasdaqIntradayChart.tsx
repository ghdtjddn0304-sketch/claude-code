'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useNasdaqIntraday } from '@/hooks/useNasdaqIntraday'
import { formatPrice, formatChange, formatPercent } from '@/lib/formatters'

function SkeletonChart() {
  return (
    <div className="dc p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-1">
          <div className="h-3 bg-[#1a2840] rounded w-24" />
          <div className="h-7 bg-[#1a2840] rounded w-36" />
        </div>
        <div className="h-5 bg-[#1a2840] rounded w-20" />
      </div>
      <div className="h-52 bg-[#111e30] rounded" />
    </div>
  )
}

interface TooltipPayload {
  payload?: { close: number; open: number; high: number; low: number; volume: number }
  label?: string
}

function CustomTooltip({ payload, label }: TooltipPayload) {
  if (!payload?.close) return null
  const { close, high, low, volume } = payload
  return (
    <div className="dc px-3 py-2 text-xs" style={{ minWidth: 140 }}>
      <div className="font-semibold text-[#6b83a8] mb-1 font-mono">{label}</div>
      <div className="text-[#6b83a8]">
        종가 <span className="font-medium text-[#c9d8f5] num">{formatPrice(close)}</span>
      </div>
      <div className="text-[#3a506e] num">
        고가 {formatPrice(high)} / 저가 {formatPrice(low)}
      </div>
      <div className="text-[#3a506e] num">
        거래량 {volume?.toLocaleString()}
      </div>
    </div>
  )
}

export default function NasdaqIntradayChart() {
  const { data, isLoading, isFetching, dataUpdatedAt } = useNasdaqIntraday()

  if (isLoading) return <SkeletonChart />

  const candles = data?.candles ?? []
  const isPositive = (data?.change ?? 0) >= 0
  const color = isPositive ? '#10e49e' : '#ff4d6d'

  const prices = candles.map((c) => c.close)
  const minPrice = Math.min(...prices) * 0.9995
  const maxPrice = Math.max(...prices) * 1.0005

  const updatedStr = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('ko-KR')
    : ''

  const tickTimes = candles
    .filter((_, i) => i % 30 === 0)
    .map((c) => c.time)

  return (
    <div className="dc p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className="text-[11px] font-semibold text-[#6b83a8] uppercase tracking-[0.16em]"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              NASDAQ 당일 1분봉
            </h3>
            {isFetching && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#4facfe]">
                <span className="live-dot w-1.5 h-1.5 bg-[#4facfe] rounded-full" />
                갱신 중
              </span>
            )}
          </div>
          {data && !data.error && (
            <div className="flex items-baseline gap-3 mt-1">
              <span className="num text-3xl font-bold text-[#c9d8f5]">
                {formatPrice(data.currentPrice)}
              </span>
              <span className="num text-sm font-medium" style={{ color }}>
                {isPositive ? '▲' : '▼'} {formatChange(data.change)} ({formatPercent(data.changePercent)})
              </span>
            </div>
          )}
        </div>
        {updatedStr && (
          <span className="text-[11px] text-[#3a506e] font-mono self-start sm:self-auto">
            갱신: {updatedStr}
          </span>
        )}
      </div>

      {!data || data.error || candles.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-sm text-[#3a506e]">
          {data?.error === true ? '데이터 로드 실패' : '장 마감 또는 데이터 없음'}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={candles} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="nasdaqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              ticks={tickTimes}
              tick={{ fontSize: 10, fill: '#3a506e', fontFamily: 'var(--font-jb)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: '#3a506e', fontFamily: 'var(--font-jb)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatPrice(v, 0)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(79,172,254,0.2)', strokeWidth: 1 }} />
            {data && (
              <ReferenceLine
                y={data.openPrice}
                stroke="rgba(79,140,255,0.25)"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            )}
            <Area
              type="linear"
              dataKey="close"
              stroke={color}
              strokeWidth={1.5}
              fill="url(#nasdaqFill)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
