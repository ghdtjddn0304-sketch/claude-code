import { useQuery } from '@tanstack/react-query'
import { REFRESH_INTERVAL_MS } from '@/lib/constants'
import type { MarketApiResponse } from '@/types'

export function useMarketData() {
  return useQuery<MarketApiResponse>({
    queryKey: ['market'],
    queryFn: async () => {
      const res = await fetch('/api/market')
      if (!res.ok) throw new Error('Failed to fetch market data')
      return res.json()
    },
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}
