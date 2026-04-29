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
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">경제 지표 대시보드</h1>
        <p className="text-xs text-gray-400 mt-0.5">주식 시장 핵심 지표 한눈에 보기</p>
      </div>
      <div className="flex items-center gap-3">
        {timeStr && (
          <span className="text-xs text-gray-400">최근 갱신: {timeStr}</span>
        )}
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
