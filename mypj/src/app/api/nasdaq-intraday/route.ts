import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export interface IntradayCandle {
  time: string   // "HH:MM"
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface NasdaqIntradayResponse {
  candles: IntradayCandle[]
  currentPrice: number
  openPrice: number
  change: number
  changePercent: number
  error?: boolean
}

export async function GET() {
  try {
    const url =
      'https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC?interval=1m&range=1d'
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)', Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`Yahoo Finance error: ${res.status}`)

    const data = await res.json()
    const result = data?.chart?.result?.[0]
    if (!result) throw new Error('No data')

    const timestamps: number[] = result.timestamp ?? []
    const quote = result.indicators?.quote?.[0] ?? {}
    const opens: number[] = quote.open ?? []
    const highs: number[] = quote.high ?? []
    const lows: number[] = quote.low ?? []
    const closes: number[] = quote.close ?? []
    const volumes: number[] = quote.volume ?? []

    const candles: IntradayCandle[] = timestamps
      .map((ts, i) => ({
        time: new Date(ts * 1000).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/New_York',
        }),
        open: opens[i],
        high: highs[i],
        low: lows[i],
        close: closes[i],
        volume: volumes[i],
      }))
      .filter((c) => c.close != null && c.open != null)

    const meta = result.meta
    const currentPrice: number = meta.regularMarketPrice ?? candles.at(-1)?.close ?? 0
    const openPrice: number = meta.chartPreviousClose ?? candles[0]?.open ?? 0
    const change = currentPrice - openPrice
    const changePercent = openPrice ? (change / openPrice) * 100 : 0

    return NextResponse.json({
      candles,
      currentPrice,
      openPrice,
      change,
      changePercent,
    } satisfies NasdaqIntradayResponse)
  } catch {
    return NextResponse.json({ candles: [], currentPrice: 0, openPrice: 0, change: 0, changePercent: 0, error: true } satisfies NasdaqIntradayResponse)
  }
}
