import { useQuery } from '@tanstack/react-query'
import { MACRO_REFRESH_INTERVAL_MS } from '@/lib/constants'
import type { MacroApiResponse } from '@/types'

export function useMacroData() {
  return useQuery<MacroApiResponse>({
    queryKey: ['macro'],
    queryFn: async () => {
      const res = await fetch('/api/macro')
      if (!res.ok) throw new Error('Failed to fetch macro data')
      return res.json()
    },
    refetchInterval: MACRO_REFRESH_INTERVAL_MS,
  })
}
