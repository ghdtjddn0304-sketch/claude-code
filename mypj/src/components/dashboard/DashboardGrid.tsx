'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useMarketData } from '@/hooks/useMarketData'
import { useMacroData } from '@/hooks/useMacroData'
import { useSentimentData } from '@/hooks/useSentimentData'
import DashboardHeader from './DashboardHeader'
import SectionHeader from './SectionHeader'
import MarketCard from '@/components/cards/MarketCard'
import MacroCard from '@/components/cards/MacroCard'
import SentimentCard from '@/components/cards/SentimentCard'
import CommodityCard from '@/components/cards/CommodityCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import NasdaqIntradayChart from '@/components/charts/NasdaqIntradayChart'
import StockSearch from '@/components/search/StockSearch'
import SearchedStockCard from '@/components/search/SearchedStockCard'

const LS_KEY = 'dashboard_watched_stocks'

interface WatchedStock { symbol: string; name: string }

export default function DashboardGrid() {
  const queryClient = useQueryClient()
  const market = useMarketData()
  const macro = useMacroData()
  const sentiment = useSentimentData()

  const [watched, setWatched] = useState<WatchedStock[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) setWatched(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  function addStock(symbol: string, name: string) {
    setWatched((prev) => {
      if (prev.some((s) => s.symbol === symbol)) return prev
      const next = [...prev, { symbol, name }]
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }

  function removeStock(symbol: string) {
    setWatched((prev) => {
      const next = prev.filter((s) => s.symbol !== symbol)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }

  const isFetching = market.isFetching || macro.isFetching || sentiment.isFetching
  const dataUpdatedAt = market.dataUpdatedAt ?? 0

  function handleRefresh() {
    queryClient.invalidateQueries()
  }

  const emptyMarketItem = {
    symbol: '', name: '', price: 0, change: 0, changePercent: 0,
    previousClose: 0, sparkline: [], currency: '', error: true,
  }
  const emptyMacroItem = {
    id: '', name: '', value: 0, unit: '', date: '', sparkline: [], error: true,
  }
  const emptySentiment = {
    score: 0, rating: '', previousClose: 0, oneWeekAgo: 0, oneMonthAgo: 0,
    oneYearAgo: 0, historicalData: [], error: true,
  }

  return (
    <>
      <DashboardHeader isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} onRefresh={handleRefresh} />

      {/* 종목 검색 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader title="관심 종목" />
        </div>
        <div className="mb-4">
          <StockSearch
            onAdd={addStock}
            existingSymbols={watched.map((s) => s.symbol)}
          />
        </div>
        {watched.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watched.map((s) => (
              <SearchedStockCard
                key={s.symbol}
                symbol={s.symbol}
                onRemove={removeStock}
              />
            ))}
          </div>
        )}
        {watched.length === 0 && (
          <p className="text-sm text-[#3a506e]">
            종목을 검색해서 추가하면 여기에 표시됩니다.
          </p>
        )}
      </section>

      {/* 나스닥 1분봉 차트 */}
      <section className="mb-8">
        <NasdaqIntradayChart />
      </section>

      {/* 주요 주가지수 */}
      <section className="mb-8">
        <SectionHeader title="주요 주가지수" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {market.isLoading
            ? Array.from({ length: 5 }).map((_, i) => <LoadingSkeleton key={i} />)
            : (market.data?.indices ?? Array(5).fill(emptyMarketItem)).map((item, i) => (
                <MarketCard key={item.symbol || i} item={item} isLoading={false} />
              ))}
        </div>
      </section>

      {/* 거시경제 지표 */}
      <section className="mb-8">
        <SectionHeader title="거시경제 지표" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {macro.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} />)
          ) : (
            <>
              <MacroCard item={macro.data?.cpi ?? { ...emptyMacroItem, name: 'CPI' }} isLoading={false} />
              <MacroCard item={macro.data?.fedFunds ?? { ...emptyMacroItem, name: '연방기금금리' }} isLoading={false} />
              <MacroCard item={macro.data?.gdpGrowth ?? { ...emptyMacroItem, name: 'GDP 성장률' }} isLoading={false} />
              <MacroCard item={macro.data?.unemployment ?? { ...emptyMacroItem, name: '실업률' }} isLoading={false} />
            </>
          )}
        </div>
      </section>

      {/* 시장 심리 */}
      <section className="mb-8">
        <SectionHeader title="시장 심리" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SentimentCard
              data={sentiment.data ?? emptySentiment}
              isLoading={sentiment.isLoading}
            />
          </div>
          <MarketCard
            item={market.data?.vix ?? { ...emptyMarketItem, name: 'VIX', symbol: '^VIX' }}
            isLoading={market.isLoading}
          />
        </div>
      </section>

      {/* 환율 / 원자재 */}
      <section className="mb-8">
        <SectionHeader title="환율 / 원자재" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {market.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} />)
            : (
              <>
                {(market.data?.commodities ?? [emptyMarketItem, emptyMarketItem]).map((item, i) => (
                  <CommodityCard key={item.symbol || `c${i}`} item={item} isLoading={false} />
                ))}
                {(market.data?.fx ?? [emptyMarketItem, emptyMarketItem]).map((item, i) => (
                  <CommodityCard key={item.symbol || `fx${i}`} item={item} isLoading={false} />
                ))}
              </>
            )}
        </div>
      </section>
    </>
  )
}
