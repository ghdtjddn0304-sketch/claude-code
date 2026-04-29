import { NextResponse } from 'next/server'
import { YAHOO_TICKERS, TICKER_NAMES, TICKER_CURRENCY } from '@/lib/constants'
import type { MarketItem, MarketApiResponse } from '@/types'

export const dynamic = 'force-dynamic'

const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible)',
  'Accept': 'application/json',
}

async function fetchTicker(symbol: string): Promise<MarketItem> {
  const url = `${YF_BASE}/${encodeURIComponent(symbol)}?interval=1d&range=1mo`
  const res = await fetch(url, {
    headers: HEADERS,
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`Yahoo Finance error for ${symbol}: ${res.status}`)

  const data = await res.json()
  const result = data?.chart?.result?.[0]
  if (!result) throw new Error(`No data for ${symbol}`)

  const meta = result.meta
  const closes: number[] = result.indicators?.quote?.[0]?.close ?? []
  const sparkline = closes.filter((v: number) => v != null).slice(-22)

  return {
    symbol,
    name: TICKER_NAMES[symbol] ?? symbol,
    price: meta.regularMarketPrice ?? 0,
    change: meta.regularMarketChange ?? 0,
    changePercent: meta.regularMarketChangePercent ?? 0,
    previousClose: meta.regularMarketPreviousClose ?? 0,
    sparkline,
    currency: TICKER_CURRENCY[symbol] ?? '',
  }
}

async function safeFetch(symbol: string): Promise<MarketItem> {
  try {
    return await fetchTicker(symbol)
  } catch {
    return {
      symbol,
      name: TICKER_NAMES[symbol] ?? symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      previousClose: 0,
      sparkline: [],
      currency: TICKER_CURRENCY[symbol] ?? '',
      error: true,
    }
  }
}

export async function GET() {
  const [sp500, nasdaq, dow, kospi, kosdaq, vix, gold, oil, dxy, usdkrw] =
    await Promise.all([
      safeFetch(YAHOO_TICKERS.SP500),
      safeFetch(YAHOO_TICKERS.NASDAQ),
      safeFetch(YAHOO_TICKERS.DOW),
      safeFetch(YAHOO_TICKERS.KOSPI),
      safeFetch(YAHOO_TICKERS.KOSDAQ),
      safeFetch(YAHOO_TICKERS.VIX),
      safeFetch(YAHOO_TICKERS.GOLD),
      safeFetch(YAHOO_TICKERS.OIL),
      safeFetch(YAHOO_TICKERS.DXY),
      safeFetch(YAHOO_TICKERS.USDKRW),
    ])

  const response: MarketApiResponse = {
    indices: [sp500, nasdaq, dow, kospi, kosdaq],
    vix,
    commodities: [gold, oil],
    fx: [dxy, usdkrw],
  }

  return NextResponse.json(response)
}
