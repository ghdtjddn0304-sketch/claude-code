import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export interface SearchResult {
  symbol: string
  name: string
  exchange: string
  type: string
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 1) return NextResponse.json([])

  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0&enableFuzzyQuery=false`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)', Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`Search error: ${res.status}`)

    const data = await res.json()
    const quotes = (data.quotes ?? []) as {
      symbol: string
      shortname?: string
      longname?: string
      typeDisp?: string
      exchDisp?: string
      quoteType?: string
    }[]

    const results: SearchResult[] = quotes
      .filter((q) => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'INDEX')
      .slice(0, 6)
      .map((q) => ({
        symbol: q.symbol,
        name: q.shortname ?? q.longname ?? q.symbol,
        exchange: q.exchDisp ?? '',
        type: q.typeDisp ?? q.quoteType ?? '',
      }))

    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
