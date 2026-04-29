'use client'

import { useState, useEffect, useRef } from 'react'
import type { SearchResult } from '@/app/api/stock/search/route'

interface StockSearchProps {
  onAdd: (symbol: string, name: string) => void
  existingSymbols: string[]
}

export default function StockSearch({ onAdd, existingSymbols }: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.length < 1) { setResults([]); setIsOpen(false); return }

    timerRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/stock/search?q=${encodeURIComponent(query)}`)
        const data: SearchResult[] = await res.json()
        setResults(data)
        setIsOpen(data.length > 0)
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [query])

  function handleSelect(result: SearchResult) {
    onAdd(result.symbol, result.name)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="종목명 또는 티커 검색 (예: Apple, TSLA)"
          className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isSearching && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {results.map((r) => {
            const already = existingSymbols.includes(r.symbol)
            return (
              <button
                key={r.symbol}
                onClick={() => !already && handleSelect(r)}
                disabled={already}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors
                  ${already ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
              >
                <div>
                  <span className="font-medium text-gray-900">{r.symbol}</span>
                  <span className="ml-2 text-gray-500 text-xs">{r.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {r.exchange && (
                    <span className="text-xs text-gray-400">{r.exchange}</span>
                  )}
                  {already ? (
                    <span className="text-xs text-gray-400">추가됨</span>
                  ) : (
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
