import { NextResponse } from 'next/server'
import { FRED_SERIES } from '@/lib/constants'
import type { MacroItem, MacroApiResponse } from '@/types'

export const dynamic = 'force-dynamic'

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations'

interface FredObservation {
  date: string
  value: string
}

async function fetchFredSeries(
  seriesId: string,
  name: string,
  unit: string
): Promise<MacroItem> {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) {
    return { id: seriesId, name, value: 0, unit, date: '', sparkline: [], error: true }
  }

  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}&sort_order=desc&limit=13&file_type=json`
  const res = await fetch(url, { next: { revalidate: 3600 } })

  if (!res.ok) throw new Error(`FRED error for ${seriesId}: ${res.status}`)

  const data = await res.json()
  const observations: FredObservation[] = (data.observations ?? []).filter(
    (o: FredObservation) => o.value !== '.'
  )

  if (observations.length === 0) throw new Error(`No FRED data for ${seriesId}`)

  const latest = observations[0]
  const sparkline = [...observations]
    .reverse()
    .map((o) => ({ date: o.date, value: parseFloat(o.value) }))

  return {
    id: seriesId,
    name,
    value: parseFloat(latest.value),
    unit,
    date: latest.date,
    sparkline,
  }
}

async function safeFetch(
  seriesId: string,
  name: string,
  unit: string
): Promise<MacroItem> {
  try {
    return await fetchFredSeries(seriesId, name, unit)
  } catch {
    return { id: seriesId, name, value: 0, unit, date: '', sparkline: [], error: true }
  }
}

export async function GET() {
  const [cpi, fedFunds, unemployment, gdpGrowth] = await Promise.all([
    safeFetch(FRED_SERIES.CPI, 'CPI (소비자물가)', 'Index'),
    safeFetch(FRED_SERIES.FED_FUNDS, '연방기금금리', '%'),
    safeFetch(FRED_SERIES.UNEMPLOYMENT, '실업률', '%'),
    safeFetch(FRED_SERIES.GDP_GROWTH, 'GDP 성장률', '%'),
  ])

  const response: MacroApiResponse = { cpi, fedFunds, unemployment, gdpGrowth }
  return NextResponse.json(response)
}
