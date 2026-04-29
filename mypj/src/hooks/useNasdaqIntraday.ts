import { useQuery } from '@tanstack/react-query'
import type { NasdaqIntradayResponse } from '@/app/api/nasdaq-intraday/route'

export function useNasdaqIntraday() {
  return useQuery<NasdaqIntradayResponse>({
    queryKey: ['nasdaq-intraday'],
    queryFn: async () => {
      const res = await fetch('/api/nasdaq-intraday')
      if (!res.ok) throw new Error('Failed to fetch NASDAQ intraday data')
      return res.json()
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  })
}
