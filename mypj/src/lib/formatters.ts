export function formatPrice(n: number, decimals = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPercent(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

export function formatChange(n: number, decimals = 2): string {
  return `${n >= 0 ? '+' : ''}${formatPrice(n, decimals)}`
}

export function formatKRW(n: number): string {
  return n.toLocaleString('ko-KR', { maximumFractionDigits: 0 })
}

export function formatMacroValue(n: number, unit: string): string {
  if (unit === '%') return `${n.toFixed(2)}%`
  return formatPrice(n)
}

export function getSentimentColor(score: number): {
  bg: string
  text: string
  label: string
} {
  if (score <= 25) return { bg: 'bg-red-100', text: 'text-red-700', label: '극단적 공포' }
  if (score <= 45) return { bg: 'bg-orange-100', text: 'text-orange-700', label: '공포' }
  if (score <= 55) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '중립' }
  if (score <= 75) return { bg: 'bg-lime-100', text: 'text-lime-700', label: '탐욕' }
  return { bg: 'bg-green-100', text: 'text-green-700', label: '극단적 탐욕' }
}
