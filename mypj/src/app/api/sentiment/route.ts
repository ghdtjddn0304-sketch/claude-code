import { NextResponse } from 'next/server'
import type { SentimentData } from '@/types'

export const dynamic = 'force-dynamic'

const CNN_URL = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata'

export async function GET() {
  try {
    const res = await fetch(CNN_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)', Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`CNN API error: ${res.status}`)

    const data = await res.json()
    const fg = data.fear_and_greed

    const historicalRaw: { x: number; y: number }[] =
      data.fear_and_greed_historical?.data ?? []

    const historicalData = historicalRaw.slice(-30).map((d) => ({
      x: new Date(d.x).toISOString().slice(0, 10),
      y: Math.round(d.y),
    }))

    const response: SentimentData = {
      score: Math.round(fg.score),
      rating: fg.rating,
      previousClose: Math.round(fg.previous_close),
      oneWeekAgo: Math.round(fg.previous_1_week),
      oneMonthAgo: Math.round(fg.previous_1_month),
      oneYearAgo: Math.round(fg.previous_1_year),
      historicalData,
    }

    return NextResponse.json(response)
  } catch {
    const fallback: SentimentData = {
      score: 0,
      rating: 'Unknown',
      previousClose: 0,
      oneWeekAgo: 0,
      oneMonthAgo: 0,
      oneYearAgo: 0,
      historicalData: [],
      error: true,
    }
    return NextResponse.json(fallback)
  }
}
