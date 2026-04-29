export interface MarketItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  sparkline: number[]
  currency: string
  error?: boolean
}

export interface MacroItem {
  id: string
  name: string
  value: number
  unit: string
  date: string
  sparkline: { date: string; value: number }[]
  error?: boolean
}

export interface SentimentData {
  score: number
  rating: string
  previousClose: number
  oneWeekAgo: number
  oneMonthAgo: number
  oneYearAgo: number
  historicalData: { x: string; y: number }[]
  error?: boolean
}

export interface MarketApiResponse {
  indices: MarketItem[]
  vix: MarketItem
  fx: MarketItem[]
  commodities: MarketItem[]
}

export interface MacroApiResponse {
  cpi: MacroItem
  fedFunds: MacroItem
  unemployment: MacroItem
  gdpGrowth: MacroItem
}
