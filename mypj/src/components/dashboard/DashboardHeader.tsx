'use client'

import { useEffect, useState } from 'react'

interface DashboardHeaderProps {
  isFetching: boolean
  dataUpdatedAt: number
  onRefresh: () => void
}

export default function DashboardHeader({ isFetching, dataUpdatedAt, onRefresh }: DashboardHeaderProps) {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    if (dataUpdatedAt) {
      setTimeStr(new Date(dataUpdatedAt).toLocaleTimeString('ko-KR'))
    }
  }, [dataUpdatedAt])

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="live-dot w-1.5 h-1.5 rounded-full bg-[#10e49e]" />
          <span className="text-[10px] text-[#3a506e] tracking-[0.18em] uppercase font-mono">
            Live Market Data
          </span>
        </div>
        <h1
          className="text-3xl font-bold text-[#c9d8f5] leading-tight"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          경제 지표 대시보드
        </h1>
        <p className="text-xs text-[#3a506e] mt-1">주식 시장 핵심 지표 한눈에 보기</p>
      </div>

      <div className="flex items-center gap-3">
        {timeStr && (
          <span className="text-[11px] text-[#3a506e] font-mono">
            갱신: {timeStr}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
            border border-[rgba(79,140,255,0.2)] bg-[rgba(79,140,255,0.06)]
            text-[#6b83a8] hover:border-[rgba(79,172,254,0.4)] hover:text-[#4facfe] hover:bg-[rgba(79,172,254,0.1)]
            disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <svg
            className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isFetching ? '갱신 중' : '새로고침'}
        </button>
      </div>
    </div>
  )
}
