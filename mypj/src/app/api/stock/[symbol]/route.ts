import { NextRequest, NextResponse } from 'next/server'
import type { MarketItem } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=3mo`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)', Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`Yahoo Finance error: ${res.status}`)

    const data = await res.json()
    const result = data?.chart?.result?.[0]
    if (!result) throw new Error('No data')

    const meta = result.meta
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? []
    const sparkline = closes.filter((v: number) => v != null).slice(-60)

    const item: MarketItem = {
      symbol,
      name: meta.shortName ?? meta.longName ?? symbol,
      price: meta.regularMarketPrice ?? 0,
      change: meta.regularMarketChange ?? 0,
      changePercent: meta.regularMarketChangePercent ?? 0,
      previousClose: meta.regularMarketPreviousClose ?? 0,
      sparkline,
      currency: meta.currency ?? 'USD',
    }

    return NextResponse.json(item)
  } catch {
    const item: MarketItem = {
      symbol, name: symbol, price: 0, change: 0, changePercent: 0,
      previousClose: 0, sparkline: [], currency: 'USD', error: true,
    }
    return NextResponse.json(item)
  }
}
