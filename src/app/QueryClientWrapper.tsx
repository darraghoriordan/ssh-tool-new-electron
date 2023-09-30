import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Layout } from './ResizableLayout'

const queryClient = new QueryClient()
export const QueryClientWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  )
}
