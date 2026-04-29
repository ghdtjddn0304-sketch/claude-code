import { QueryClient } from '@tanstack/react-query'
import { REFRESH_INTERVAL_MS } from './constants'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: REFRESH_INTERVAL_MS - 5_000,
        refetchIntervalInBackground: false,
        retry: 2,
        retryDelay: 3_000,
      },
    },
  })
}
