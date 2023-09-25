import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  getSingleDay: 'get-single-day',
}
export function useDevHistoryGetDay({ date }: { date: Date }) {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  return useQuery(
    [wellKnownQueries.getSingleDay, date.toISOString()],
    async () => {
      return window.GetDevHistorySingleDay.invoke({
        date: date,
      })
    },

    {
      // never invalidate
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.getSingleDay} tool completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
