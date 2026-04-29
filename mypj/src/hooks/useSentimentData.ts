import { useQuery } from '@tanstack/react-query'
import { REFRESH_INTERVAL_MS } from '@/lib/constants'
import type { SentimentData } from '@/types'

export function useSentimentData() {
  return useQuery<SentimentData>({
    queryKey: ['sentiment'],
    queryFn: async () => {
      const res = await fetch('/api/sentiment')
      if (!res.ok) throw new Error('Failed to fetch sentiment data')
      return res.json()
    },
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}
