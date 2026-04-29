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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-7 bg-gray-200 rounded w-36" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-52 bg-gray-100 rounded" />
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
      <div className="text-gray-600">종가 <span className="font-medium text-gray-900">{formatPrice(close)}</span></div>
      <div className="text-gray-500">고가 {formatPrice(high)} / 저가 {formatPrice(low)}</div>
      <div className="text-gray-500">거래량 {volume?.toLocaleString()}</div>
    </div>
  )
}

export default function NasdaqIntradayChart() {
  const { data, isLoading, isFetching, dataUpdatedAt } = useNasdaqIntraday()

  if (isLoading) return <SkeletonChart />

  const candles = data?.candles ?? []
  const isPositive = (data?.change ?? 0) >= 0
  const color = isPositive ? '#16a34a' : '#dc2626'
  const fillColor = isPositive ? '#dcfce7' : '#fee2e2'

  const prices = candles.map((c) => c.close)
  const minPrice = Math.min(...prices) * 0.9995
  const maxPrice = Math.max(...prices) * 1.0005

  const updatedStr = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('ko-KR')
    : ''

  // x축 레이블: 30분 간격만 표시
  const tickTimes = candles
    .filter((_, i) => i % 30 === 0)
    .map((c) => c.time)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              NASDAQ 당일 1분봉
            </h3>
            {isFetching && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-500">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                갱신 중
              </span>
            )}
          </div>
          {data && !data.error && (
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(data.currentPrice)}
              </span>
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? '▲' : '▼'} {formatChange(data.change)} ({formatPercent(data.changePercent)})
              </span>
            </div>
          )}
        </div>
        {updatedStr && (
          <span className="text-xs text-gray-400 self-start sm:self-auto">
            최근 갱신: {updatedStr}
          </span>
        )}
      </div>

      {!data || data.error || candles.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-sm text-gray-400">
          {data?.error === true ? '데이터 로드 실패' : '장 마감 또는 데이터 없음'}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={candles} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="nasdaqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              ticks={tickTimes}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatPrice(v, 0)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            {data && (
              <ReferenceLine
                y={data.openPrice}
                stroke="#9ca3af"
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
