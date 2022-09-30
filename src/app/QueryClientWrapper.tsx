import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Layout } from './Layout'

const queryClient = new QueryClient()
export const QueryClientWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  )
}
