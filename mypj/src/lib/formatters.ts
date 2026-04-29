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
  hex: string
} {
  if (score <= 25) return { bg: 'bg-[rgba(255,77,109,0.12)]', text: 'text-[#ff4d6d]', label: '극단적 공포', hex: '#ff4d6d' }
  if (score <= 45) return { bg: 'bg-[rgba(255,154,90,0.12)]', text: 'text-[#ff9a5a]', label: '공포', hex: '#ff9a5a' }
  if (score <= 55) return { bg: 'bg-[rgba(255,215,112,0.12)]', text: 'text-[#ffd770]', label: '중립', hex: '#ffd770' }
  if (score <= 75) return { bg: 'bg-[rgba(100,220,170,0.12)]', text: 'text-[#64dca8]', label: '탐욕', hex: '#64dca8' }
  return { bg: 'bg-[rgba(16,228,158,0.12)]', text: 'text-[#10e49e]', label: '극단적 탐욕', hex: '#10e49e' }
}
