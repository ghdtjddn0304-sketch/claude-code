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
    const validCloses = closes.filter((v): v is number => v != null)
    const sparkline = validCloses.slice(-60)

    const price = meta.regularMarketPrice ?? 0
    const prevClose =
      (validCloses.length >= 2 ? validCloses[validCloses.length - 2] : 0) ||
      (meta.regularMarketPreviousClose ?? meta.chartPreviousClose ?? 0)

    const change =
      meta.regularMarketChange != null && meta.regularMarketChange !== 0
        ? meta.regularMarketChange
        : prevClose > 0 ? price - prevClose : 0

    const changePercent =
      meta.regularMarketChangePercent != null && meta.regularMarketChangePercent !== 0
        ? meta.regularMarketChangePercent
        : prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0

    const item: MarketItem = {
      symbol,
      name: meta.shortName ?? meta.longName ?? symbol,
      price,
      change,
      changePercent,
      previousClose: prevClose,
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
